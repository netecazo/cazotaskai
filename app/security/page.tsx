import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security — CazoTask',
  description:
    'How CazoTask protects your data: encryption, OAuth scope minimisation, token storage, AI provider handling, access control, monitoring and vulnerability reporting.',
};

export default function SecurityPage() {
  return (
    <main className="legal">
      <div className="wrap">
        <a href="/" className="back">← Back to CazoTask</a>

        <h1>Security</h1>
        <p className="updated">Last updated: 1 January 2026</p>

        <p>
          You are about to give CazoTask access to your inbox, your calendar and your client
          conversations. That deserves a straight description of how we protect it, not a page of
          badges. Here is what we actually do, and where the honest limits are.
        </p>

        <h2 id="encryption">Encryption</h2>
        <p>
          Everything in transit uses TLS 1.2 or higher, with HSTS enforced on our domains and modern
          cipher suites only. Everything at rest — the application database, object storage and backups
          — is encrypted with AES-256 using managed keys.
        </p>
        <p>
          Credentials for your connected tools get a second layer. OAuth access and refresh tokens are
          encrypted individually with envelope encryption before they touch the database, using data
          keys wrapped by a master key held in a managed key service that the application database has
          no access to. A dump of the database on its own would not yield usable tokens. Tokens are
          unwrapped in memory for the length of a run and are never written to logs.
        </p>

        <h2 id="oauth">Connections and scope minimisation</h2>
        <p>
          Every integration uses OAuth. We never ask for and never store your password to a third-party
          service. We request the narrowest scope set the automation you selected genuinely needs — an
          inbox triage automation that only reads and drafts does not get send-on-your-behalf
          permission — and the consent screen lists each scope in plain English before you approve it.
        </p>
        <p>
          You can revoke a connection from Settings → Connections at any time. Revocation destroys the
          stored tokens immediately, calls the provider&apos;s revoke endpoint where one exists, and
          pauses every automation that depended on it.
        </p>

        <h2 id="ai">AI provider handling</h2>
        <p>
          Automation steps that classify, summarise or draft send content to a third-party AI provider
          over an encrypted connection. We hold enterprise or API terms with those providers that
          prohibit training on submitted data. <strong>Your content is not used to train our models or
          any public model.</strong> We send the smallest slice of content the step needs rather than
          the whole account, and we do not use one customer&apos;s data to produce another
          customer&apos;s results. Providers retain a short abuse-monitoring window as their terms
          require, after which the data is deleted on their side.
        </p>

        <h2 id="approvals">Approval controls</h2>
        <p>
          The strongest safety control on the platform is one you set. Every automation has an approval
          line: actions below it run silently, actions above it queue for your explicit confirmation.
          Client-facing email, payments and anything that makes a commitment default to requiring
          approval. You can move the line in either direction per automation, and every approval and
          rejection is recorded in the audit log.
        </p>

        <h2 id="isolation">Tenant isolation and access control</h2>
        <p>
          Customer data is logically isolated. Row-level security in the database ties every record to
          an owning account, and API routes authorise on the session rather than trusting a client-side
          identifier. Automation runs execute in isolated workers with only the credentials for the
          account that owns the run.
        </p>
        <p>
          Internally we operate on least privilege. Production access is limited to a small number of
          engineers, requires SSO with mandatory multi-factor authentication and a hardware key, and is
          logged. Nobody reads customer content routinely; access to production data happens only when
          you ask us to debug something, or during a live incident, and it is recorded either way.
          Development and staging environments never contain real customer content.
        </p>

        <h2 id="infrastructure">Infrastructure</h2>
        <p>
          We run on major cloud providers whose data centres hold SOC 2 Type II and ISO 27001
          certifications, in UK, EU and US regions. Infrastructure is defined as code and changes go
          through review. Backups are encrypted, taken continuously with point-in-time recovery, and
          restore procedures are tested. Backups roll off within 35 days, which is why deleted data
          takes up to 35 days to disappear from every copy rather than vanishing instantly.
        </p>

        <h2 id="development">Secure development</h2>
        <ul>
          <li>Every change is peer-reviewed before it can reach production.</li>
          <li>Automated dependency scanning and static analysis run on every commit.</li>
          <li>Secrets live in a managed secret store, never in the repository.</li>
          <li>We patch high and critical severity vulnerabilities on a defined schedule.</li>
          <li>Independent penetration testing is performed periodically and findings are tracked to closure.</li>
        </ul>

        <h2 id="monitoring">Monitoring and incident response</h2>
        <p>
          We monitor application and infrastructure telemetry with alerting on anomalies — unusual
          authentication patterns, spikes in failed runs, unexpected data egress. We maintain a written
          incident response plan with defined roles and severity levels. If a security incident affects
          your data, we will notify you without undue delay and in any case within 72 hours of becoming
          aware, tell you what happened, what data was involved and what we are doing about it, and
          follow up with a post-incident review.
        </p>

        <h2 id="compliance">Compliance posture</h2>
        <p>
          We process personal data in line with the UK GDPR, the EU GDPR and applicable US state
          privacy laws, and we will sign a data processing agreement on request. Sub-processors are
          bound by equivalent obligations, with standard contractual clauses covering international
          transfers. We are being honest about certification status: our controls are built to the SOC 2
          criteria and formal attestation is in progress rather than complete. If you need current
          documentation for a vendor review, email us and we will send what we have.
        </p>

        <h2 id="your-part">Your part</h2>
        <ul>
          <li>Use a strong, unique password or the magic-link sign-in.</li>
          <li>Review the scopes on the consent screen before approving a connection.</li>
          <li>Keep approvals on for anything that leaves your organisation.</li>
          <li>Remove seats promptly when someone leaves your team.</li>
          <li>Disconnect tools you no longer use.</li>
        </ul>

        <h2 id="reporting">Reporting a vulnerability</h2>
        <p>
          If you have found a security issue, email{' '}
          <a href="mailto:security@cazotaskai.com">security@cazotaskai.com</a> with enough detail to
          reproduce it. We acknowledge within one business day, keep you updated, and will not pursue
          legal action against good-faith research that avoids privacy violations, data destruction and
          service disruption. We are happy to credit you publicly once a fix has shipped.
        </p>

        <div className="glass contact">
          Running a vendor review? Email{' '}
          <a href="mailto:security@cazotaskai.com">security@cazotaskai.com</a> and we will complete your
          questionnaire.
        </div>
      </div>
    </main>
  );
}
