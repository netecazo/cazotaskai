/**
 * The automation engine.
 *
 * One entry point — executeAutomation — used by every trigger path:
 * manual "run now", inbound webhooks, and the scheduler.
 *
 * Order of operations:
 *   1. load automation + template + owner profile
 *   2. enforce the plan's monthly run allowance
 *   3. create a run row so a crash is still visible in the log
 *   4. call the AI step
 *   5. decide whether the output ships or waits for approval
 *   6. execute the actions we can execute, record the ones we cannot
 *   7. bank the minutes saved
 */

import { supabaseAdmin } from './supabase/admin';
import { runAi, fillTemplate, aiConfigured } from './ai';
import { limitsFor, periodStart } from './plans';
import { postToSlack } from './slack';
import { decryptSecret } from '@/lib/crypto';

export type TriggerPayload = Record<string, unknown>;

export type ExecuteResult = {
  runId: string;
  status: 'succeeded' | 'failed' | 'awaiting_approval' | 'skipped';
  message: string;
  output?: string;
  demo?: boolean;
};

/** Actions that reach the outside world and therefore default to needing a nod. */
const EXTERNAL_ACTIONS = new Set([
  'send_message', 'post_slack', 'webhook_out', 'create_event', 'send_digest',
]);

export async function executeAutomation(
  automationId: string,
  trigger: TriggerPayload = {},
  opts: { source?: string } = {}
): Promise<ExecuteResult> {
  const db = supabaseAdmin();

  const { data: automation, error: aErr } = await db
    .from('ct_automations')
    .select('*, ct_templates(*)')
    .eq('id', automationId)
    .single();

  if (aErr || !automation) throw new Error('Automation not found');

  const template: any = (automation as any).ct_templates;
  const userId: string = (automation as any).user_id;

  const { data: profile } = await db
    .from('ct_profiles').select('plan, plan_status').eq('id', userId).single();

  const limits = limitsFor(profile?.plan ?? 'starter');
  const period = periodStart();

  const { data: usage } = await db
    .from('ct_usage').select('runs_used, minutes_saved')
    .eq('user_id', userId).eq('period_start', period).maybeSingle();

  const used = usage?.runs_used ?? 0;

  if (used >= limits.maxRuns) {
    const { data: skipped } = await db.from('ct_runs').insert({
      user_id: userId,
      automation_id: automationId,
      template_slug: template.slug,
      status: 'skipped',
      trigger,
      error: `Monthly run allowance reached (${limits.maxRuns} on the ${limits.name} plan).`,
      started_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
    }).select('id').single();

    return {
      runId: skipped?.id ?? '',
      status: 'skipped',
      message: `You have used all ${limits.maxRuns} runs on ${limits.name} this month. Upgrade to keep going.`,
    };
  }

  // ---- open the run ----
  const { data: run, error: rErr } = await db.from('ct_runs').insert({
    user_id: userId,
    automation_id: automationId,
    template_slug: template.slug,
    status: 'running',
    trigger: { ...trigger, _source: opts.source ?? 'manual' },
    started_at: new Date().toISOString(),
  }).select('id').single();

  if (rErr || !run) throw new Error('Could not open a run');
  const runId = run.id as string;

  try {
    // ---- AI step ----
    const config = { ...(template.default_config ?? {}), ...((automation as any).config ?? {}) };
    const context = { ...trigger, ...config, automation_name: (automation as any).name };

    const userMessage = fillTemplate(template.ai_user_template ?? '', context);
    const { text, tokens, demo } = await runAi(
      template.ai_system_prompt ?? 'You are a careful assistant.',
      userMessage || 'No input was supplied for this run.'
    );

    // ---- approval gate ----
    const actions: string[] = template.output_actions ?? [];
    const touchesOutside = actions.some((a) => EXTERNAL_ACTIONS.has(a));
    const mode = (automation as any).approval_mode as string;

    const needsApproval =
      mode === 'review_all' || (mode === 'review_external' && touchesOutside);

    if (needsApproval) {
      await db.from('ct_approvals').insert({
        run_id: runId,
        user_id: userId,
        status: 'pending',
        preview: { output: text, actions, template: template.name },
      });
      await finish(db, runId, 'awaiting_approval', { text, tokens, demo, actions: [] });
      await bankUsage(db, userId, period, 0);
      return {
        runId, status: 'awaiting_approval', output: text, demo,
        message: 'Ready for you to approve.',
      };
    }

    // ---- execute what we can ----
    const performed = await performActions(db, userId, actions, text, config);
    await finish(db, runId, 'succeeded', { text, tokens, demo, actions: performed });
    await bankUsage(db, userId, period, Number(template.est_minutes_saved ?? 0));

    return { runId, status: 'succeeded', output: text, demo, message: 'Run complete.' };
  } catch (err: any) {
    await db.from('ct_runs').update({
      status: 'failed',
      error: String(err?.message ?? err).slice(0, 800),
      finished_at: new Date().toISOString(),
    }).eq('id', runId);
    return { runId, status: 'failed', message: String(err?.message ?? err) };
  }
}

async function finish(
  db: any, runId: string, status: string,
  p: { text: string; tokens: number | null; demo: boolean; actions: any[] }
) {
  await db.from('ct_runs').update({
    status,
    ai_output: { text: p.text },
    tokens_used: p.tokens,
    is_demo: p.demo,
    actions: p.actions,
    finished_at: new Date().toISOString(),
  }).eq('id', runId);
}

async function bankUsage(db: any, userId: string, period: string, minutes: number) {
  const { data: existing } = await db.from('ct_usage')
    .select('runs_used, minutes_saved')
    .eq('user_id', userId).eq('period_start', period).maybeSingle();

  if (existing) {
    await db.from('ct_usage').update({
      runs_used: existing.runs_used + 1,
      minutes_saved: Number(existing.minutes_saved) + minutes,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId).eq('period_start', period);
  } else {
    await db.from('ct_usage').insert({
      user_id: userId, period_start: period, runs_used: 1, minutes_saved: minutes,
    });
  }
}

/**
 * Carries out the template's declared actions.
 * Anything we cannot do yet is recorded honestly rather than reported as done.
 */
async function performActions(
  db: any, userId: string, actions: string[], text: string, config: any
) {
  const done: any[] = [];

  for (const action of actions) {
    if (action === 'post_slack' || action === 'send_digest') {
      const { data: conn } = await db.from('ct_connections')
        .select('id, status').eq('user_id', userId).eq('provider', 'slack')
        .eq('status', 'connected').maybeSingle();

      if (!conn) {
        done.push({ action, status: 'skipped', reason: 'Slack is not connected' });
        continue;
      }
      const { data: secret } = await db.from('ct_connection_secrets')
        .select('access_token').eq('connection_id', conn.id).maybeSingle();

      if (!secret?.access_token) {
        done.push({ action, status: 'skipped', reason: 'Slack credential is missing' });
        continue;
      }

      try {
        await postToSlack(decryptSecret(secret.access_token), config.post_channel ?? '#general', text);
        done.push({ action, status: 'done', channel: config.post_channel ?? '#general' });
      } catch (e: any) {
        done.push({ action, status: 'failed', reason: String(e?.message ?? e) });
      }
      continue;
    }

    if (action === 'webhook_out' && config.webhook_url) {
      try {
        await fetch(config.webhook_url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ output: text, source: 'cazotask' }),
        });
        done.push({ action, status: 'done', url: config.webhook_url });
      } catch (e: any) {
        done.push({ action, status: 'failed', reason: String(e?.message ?? e) });
      }
      continue;
    }

    // Drafting-style actions produce text the user collects from the run log.
    if (['draft_reply', 'create_doc', 'generate_report', 'create_task', 'label_thread', 'update_row', 'send_message', 'create_event'].includes(action)) {
      done.push({
        action,
        status: 'output_ready',
        note: 'Output is on the run. Connect the destination tool to deliver it automatically.',
      });
      continue;
    }

    done.push({ action, status: 'unsupported' });
  }

  return done;
}

export function engineStatus() {
  return {
    ai: aiConfigured() ? 'live' : 'sample-mode',
    slack: process.env.SLACK_CLIENT_ID ? 'available' : 'not-configured',
    stripe: process.env.STRIPE_SECRET_KEY ? 'available' : 'not-configured',
  };
}
