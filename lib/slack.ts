const SLACK_SCOPES = ['chat:write', 'channels:read', 'channels:history', 'groups:read'];

export function slackConfigured() {
  return Boolean(process.env.SLACK_CLIENT_ID && process.env.SLACK_CLIENT_SECRET);
}

export function slackAuthUrl(state: string, redirectUri: string) {
  const p = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID!,
    scope: SLACK_SCOPES.join(','),
    redirect_uri: redirectUri,
    state,
  });
  return `https://slack.com/oauth/v2/authorize?${p.toString()}`;
}

export async function slackExchange(code: string, redirectUri: string) {
  const res = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      code,
      redirect_uri: redirectUri,
    }),
  });
  const json: any = await res.json();
  if (!json.ok) throw new Error(json.error || 'Slack rejected the exchange');
  return {
    accessToken: json.access_token as string,
    team: json.team?.name as string | undefined,
    scopes: String(json.scope ?? '').split(',').filter(Boolean),
  };
}

export async function postToSlack(token: string, channel: string, text: string) {
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8', authorization: `Bearer ${token}` },
    body: JSON.stringify({ channel, text }),
  });
  const json: any = await res.json();
  if (!json.ok) throw new Error(json.error || 'Slack refused the message');
  return json;
}
