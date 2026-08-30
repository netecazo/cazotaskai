# CazoTask

The 5-Hour AI Workweek Toolkit — a library of ready-to-run AI automations.

Next.js 14 (App Router) · Supabase (Postgres, Auth, RLS) · Stripe · Anthropic

---

## What is already done

| Piece | State |
|---|---|
| Marketing site | Built. Identical design to the approved landing page. |
| Auth | Built. Email + password and magic link, via Supabase. |
| Database | **Live.** Tables created and 44 automations seeded in your `Cazo Business Finder` Supabase project. |
| Automation engine | Built. Manual, webhook and scheduled triggers, AI step, approval gate, run log, usage metering. |
| Plan limits | Built and enforced server-side. |
| Stripe | Built. Checkout, billing portal, webhook, plan sync. Needs your keys. |
| Slack | Built. OAuth connect and posting. Needs your Slack app. |
| Dashboard | Built. Overview, library, automations, runs, approvals, connections, billing. |
| Deployment | **Blocked** — see below. |

---

## Deploying

The Vercel account connected to this session returned:

```
403 forbidden — You don't have permission to create a project.
```

Fix it one of two ways, then the deploy goes through unchanged:

1. **Pre-create the project.** In the Vercel dashboard create an empty project named `cazotask`, then redeploy into it.
2. **Grant permission.** If you are on a team, the connected account needs a role that can create projects.

Or deploy it yourself:

```bash
npm install
npx vercel --prod
```

---

## Environment variables

Copy `.env.example` to `.env.local` for development, and set the same values in your hosting dashboard for production.

### Required for the app to do real work

| Variable | Where to get it | What breaks without it |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | The engine cannot write runs. Every automation fails. |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys. Requires credit on the account. | Runs still work but return **sample output**, and each one is flagged `is_demo` in the run log and in the UI. Nothing pretends to be real. |
| `AI_MODEL` | Optional. Defaults to `claude-sonnet-5`. | Set it only if you want a different model — `claude-opus-5` for harder reasoning, `claude-haiku-4-5` for cheaper, faster runs. |
| `NEXT_PUBLIC_SITE_URL` | Your own domain | OAuth and Stripe redirects go to the wrong host. |
| `CRON_SECRET` | Any long random string | The scheduler endpoint is publicly callable. |

The two `NEXT_PUBLIC_SUPABASE_*` values already have defaults in `next.config.mjs` — the anon key is designed to be public and is protected by row-level security.

### Billing

| Variable | Notes |
|---|---|
| `STRIPE_SECRET_KEY` | Start with `sk_test_...`. The UI shows a "Test mode" badge automatically. |
| `STRIPE_WEBHOOK_SECRET` | From the webhook endpoint you create at `https://<your-domain>/api/stripe/webhook` |
| `STRIPE_PRICE_PRO` | A recurring price of $29/month |
| `STRIPE_PRICE_TEAM` | A recurring price of $79/month |

Subscribe the webhook to: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.

### Slack

| Variable | Notes |
|---|---|
| `SLACK_CLIENT_ID` / `SLACK_CLIENT_SECRET` | Create an app at api.slack.com/apps |
| Redirect URL | `https://<your-domain>/api/connections/slack/callback` |
| Bot scopes | `chat:write`, `channels:read`, `channels:history`, `groups:read` |

---

## How the automation engine works

`lib/engine.ts` is the single entry point. Every trigger path calls `executeAutomation()`:

1. Load the automation, its template and the owner's plan.
2. Enforce the monthly run allowance. Over the limit becomes a `skipped` run with a readable reason, not a silent failure.
3. Open a run row **before** doing any work, so a crash is still visible in the log.
4. Fill the template's `ai_user_template` with the trigger payload plus config, and call the AI step.
5. Apply the approval gate:
   - `auto` — ships immediately
   - `review_external` (default) — anything that leaves the system waits for a tap
   - `review_all` — everything waits
6. Perform the actions it can perform. Anything it cannot is recorded as `skipped` with the reason. It never reports an action as done when it was not.
7. Bank the minutes saved against the month.

### Trigger paths

- **Manual** — `POST /api/run` with `{automation_id}`
- **Webhook** — `POST /api/hooks/<webhook_token>`; the token is shown on the automation's detail page
- **Schedule** — `GET /api/cron`, called every 15 minutes by `vercel.json`, matching 5-field cron expressions in UTC

---

## The catalogue is honest about what runs

All 44 templates are real and complete — prompts, config, actions. What varies is whether the integration behind them can run today:

| State | Count | Meaning |
|---|---|---|
| `live` | 16 | Runs for real. Needs only Slack, an inbound webhook, or nothing. |
| `pending_review` | 14 | Gmail, Outlook, Calendar, Zoom, Teams. Built, waiting on OAuth verification from the provider. |
| `needs_key` | 14 | Notion, Sheets, HubSpot, Stripe, QuickBooks. Built, waiting on your API key. |

The library and connections pages show these states plainly. Do not remove that — the landing page says 40+ automations, and this is what keeps that claim true rather than a marketing number.

---

## Database

Tables are prefixed `ct_` and live in the `public` schema of the `Cazo Business Finder` project (`weyxewesdowmknygynys`), alongside your existing tables without colliding.

`ct_profiles` · `ct_templates` · `ct_automations` · `ct_connections` · `ct_connection_secrets` · `ct_runs` · `ct_approvals` · `ct_usage` · `ct_events`

Row-level security is on for every table. A user can only ever read their own rows. OAuth tokens live in `ct_connection_secrets`, which has a deny-all policy — only the service role reaches it.

A profile row is created automatically by a trigger on `auth.users`.

---

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

---

## Known gaps

- Google and Microsoft integrations need OAuth verification before they can run. The code is written; the approval is not.
- The cron matcher handles `*`, lists, ranges and steps. It does not handle names like `MON` or `JAN`.
- Team plan seats are billed but not yet enforced as separate logins.
