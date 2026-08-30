'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import CopyButton from '@/components/dash/CopyButton';

type ConfigValue = string | number | boolean | null | unknown;

export type AutomationDetailProps = {
  id: string;
  name: string;
  schedule: string | null;
  approvalMode: string;
  config: Record<string, ConfigValue>;
  triggerType: string | null;
  webhookToken: string | null;
  siteUrl: string;
};

const APPROVAL_MODES: { value: string; title: string; detail: string }[] = [
  {
    value: 'auto',
    title: 'Run and deliver',
    detail: 'Nothing waits on you. The output ships the moment the run finishes.',
  },
  {
    value: 'review_external',
    title: 'Review anything that leaves CazoTask',
    detail: 'Messages, calendar invites and outbound webhooks wait for your approval; everything else ships.',
  },
  {
    value: 'review_all',
    title: 'Review every run',
    detail: 'Every run lands in the approvals queue and does nothing until you decide.',
  },
];

const PRESETS: { label: string; cron: string }[] = [
  { label: 'Every 15 minutes', cron: '*/15 * * * *' },
  { label: 'Hourly', cron: '0 * * * *' },
  { label: 'Every weekday at 09:00', cron: '0 9 * * 1-5' },
  { label: 'Daily at 08:00', cron: '0 8 * * *' },
  { label: 'Fridays at 17:00', cron: '0 17 * * 5' },
];

function titleise(key: string) {
  return key.replace(/[_-]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

export default function AutomationDetail(props: AutomationDetailProps) {
  const router = useRouter();

  const [name, setName] = useState(props.name);
  const [schedule, setSchedule] = useState(props.schedule ?? '');
  const [approvalMode, setApprovalMode] = useState(props.approvalMode);
  const [config, setConfig] = useState<Record<string, ConfigValue>>(props.config);
  const [jsonDrafts, setJsonDrafts] = useState<Record<string, string>>({});
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [origin, setOrigin] = useState(props.siteUrl);
  useEffect(() => {
    if (!props.siteUrl && typeof window !== 'undefined') setOrigin(window.location.origin);
  }, [props.siteUrl]);

  const webhookUrl = props.webhookToken ? `${origin}/api/hooks/${props.webhookToken}` : null;
  const keys = Object.keys(config);

  function setField(key: string, value: ConfigValue) {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function setJson(key: string, raw: string) {
    setJsonDrafts((prev) => ({ ...prev, [key]: raw }));
    setSaved(false);
    try {
      const parsed = JSON.parse(raw);
      setJsonErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setConfig((prev) => ({ ...prev, [key]: parsed }));
    } catch {
      setJsonErrors((prev) => ({ ...prev, [key]: 'That is not valid JSON yet, so it will not be saved.' }));
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (Object.keys(jsonErrors).length > 0) {
      setError('Fix the highlighted JSON fields before saving.');
      return;
    }
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/automations/${props.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          schedule,
          approval_mode: approvalMode,
          config,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error ?? 'Could not save those settings.');
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save those settings.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="dash-form" onSubmit={save}>
      <div className="glass dash-panel">
        <div className="dash-section-head"><h2>Basics</h2></div>

        <div className="dash-grid-2">
          <div className="dash-field">
            <label htmlFor="automation-name">Name</label>
            <input
              id="automation-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setSaved(false); }}
              maxLength={120}
              required
            />
            <span className="hint">Only you see this. Name it after the job it does.</span>
          </div>

          <div className="dash-field">
            <label htmlFor="automation-schedule">Schedule (cron)</label>
            <input
              id="automation-schedule"
              type="text"
              value={schedule}
              onChange={(e) => { setSchedule(e.target.value); setSaved(false); }}
              placeholder="0 9 * * 1-5"
              spellCheck={false}
            />
            <span className="hint">
              Five fields, in UTC: minute, hour, day of month, month, day of week.
              Leave it empty to run this automation by hand only.
            </span>
            <div className="dash-presets">
              {PRESETS.map((p) => (
                <button
                  key={p.cron}
                  type="button"
                  className={`dash-chip ${schedule === p.cron ? 'on' : ''}`.trim()}
                  aria-pressed={schedule === p.cron}
                  onClick={() => { setSchedule(p.cron); setSaved(false); }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass dash-panel">
        <div className="dash-section-head"><h2>Approval mode</h2></div>
        <fieldset className="dash-radios" style={{ border: 0 }}>
          <legend className="dash-sr">Choose when this automation needs your approval</legend>
          {APPROVAL_MODES.map((m) => (
            <label
              key={m.value}
              className={`dash-radio ${approvalMode === m.value ? 'on' : ''}`.trim()}
              htmlFor={`approval-${m.value}`}
            >
              <input
                id={`approval-${m.value}`}
                type="radio"
                name="approval_mode"
                value={m.value}
                checked={approvalMode === m.value}
                onChange={() => { setApprovalMode(m.value); setSaved(false); }}
              />
              <span>
                <span className="t">{m.title}</span>
                <span className="d">{m.detail}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="glass dash-panel">
        <div className="dash-section-head"><h2>Configuration</h2></div>

        {keys.length === 0 ? (
          <p className="small">
            This automation has no settings to fill in. It uses the template&rsquo;s defaults as they are.
          </p>
        ) : (
          <div className="dash-grid-2">
            {keys.map((key) => {
              const value = config[key];
              const inputId = `config-${key}`;

              if (typeof value === 'boolean') {
                return (
                  <div className="dash-field" key={key}>
                    <span className="dash-check">
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setField(key, e.target.checked)}
                      />
                      <label htmlFor={inputId}>{titleise(key)}</label>
                    </span>
                  </div>
                );
              }

              if (typeof value === 'number') {
                return (
                  <div className="dash-field" key={key}>
                    <label htmlFor={inputId}>{titleise(key)}</label>
                    <input
                      id={inputId}
                      type="number"
                      value={Number.isFinite(value) ? value : 0}
                      onChange={(e) => setField(key, e.target.value === '' ? 0 : Number(e.target.value))}
                    />
                  </div>
                );
              }

              if (typeof value === 'string' || value === null) {
                return (
                  <div className="dash-field" key={key}>
                    <label htmlFor={inputId}>{titleise(key)}</label>
                    <input
                      id={inputId}
                      type="text"
                      value={value ?? ''}
                      onChange={(e) => setField(key, e.target.value)}
                    />
                  </div>
                );
              }

              const draft = jsonDrafts[key] ?? JSON.stringify(value, null, 2);
              return (
                <div className="dash-field" key={key}>
                  <label htmlFor={inputId}>{titleise(key)}</label>
                  <textarea
                    id={inputId}
                    rows={4}
                    value={draft}
                    spellCheck={false}
                    onChange={(e) => setJson(key, e.target.value)}
                  />
                  <span className="hint">This setting holds structured data, so it is edited as JSON.</span>
                  {jsonErrors[key] ? <span className="dash-error">{jsonErrors[key]}</span> : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {webhookUrl ? (
        <div className="glass dash-panel">
          <div className="dash-section-head"><h2>Webhook URL</h2></div>
          <p className="small" style={{ marginBottom: 12 }}>
            Send a POST request to this address to trigger the automation. The body you send
            becomes the trigger payload. Treat the URL as a secret.
          </p>
          <div className="dash-copy">
            <code className="dash-code">{webhookUrl}</code>
            <CopyButton value={webhookUrl} label="Copy URL" ariaLabel="Copy the webhook URL to the clipboard" />
          </div>
        </div>
      ) : props.triggerType === 'webhook' ? (
        <div className="dash-banner warn" role="status">
          <span>
            <strong>No webhook token yet</strong> — this automation is webhook-triggered but has
            no token. Save the settings once and reload to have one issued.
          </span>
        </div>
      ) : null}

      {error ? <p className="dash-error" role="alert">{error}</p> : null}
      {saved ? <p className="dash-ok" role="status">Settings saved.</p> : null}

      <div className="dash-row-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  );
}
