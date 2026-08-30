/**
 * AI layer. Talks to Anthropic when a key is present.
 * With no key configured, runs fall back to the sample engine so the product
 * is still explorable — and every such run is flagged is_demo so nothing
 * in the dashboard silently overstates what happened.
 */

export type AiResult = {
  text: string;
  tokens: number | null;
  demo: boolean;
};

const MODEL = process.env.AI_MODEL || 'claude-sonnet-5';

export function aiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Fill {{placeholders}} from a flat context object. Unknown keys become ''. */
export function fillTemplate(tpl: string, ctx: Record<string, unknown>) {
  return tpl.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_m, key: string) => {
    const v = key.split('.').reduce<any>((acc, k) => (acc == null ? acc : acc[k]), ctx);
    if (v == null) return '';
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
  });
}

export async function runAi(
  systemPrompt: string,
  userMessage: string,
  opts: { maxTokens?: number } = {}
): Promise<AiResult> {
  const key = process.env.ANTHROPIC_API_KEY;

  if (!key) {
    return { text: sampleOutput(userMessage), tokens: null, demo: true };
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 1400,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`AI request failed (${res.status}): ${detail.slice(0, 300)}`);
  }

  const json: any = await res.json();
  const text = (json.content ?? [])
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('\n')
    .trim();

  const tokens =
    (json.usage?.input_tokens ?? 0) + (json.usage?.output_tokens ?? 0) || null;

  return { text, tokens, demo: false };
}

/** Deterministic stand-in so the UI has something real-shaped to render. */
function sampleOutput(userMessage: string) {
  const firstLine = userMessage.split('\n').find((l) => l.trim().length > 0) ?? '';
  return [
    'SAMPLE OUTPUT — no AI key is configured on this deployment.',
    '',
    'This is what the automation would have produced. Add ANTHROPIC_API_KEY',
    'in your environment and re-run to get a real result.',
    '',
    `Input received: ${firstLine.slice(0, 140)}`,
  ].join('\n');
}
