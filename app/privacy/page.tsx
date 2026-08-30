import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — CazoTask',
  description:
    'How CazoTask collects, uses, stores and deletes your data, including connected accounts, AI processing and your rights under US state privacy laws and the GDPR where it applies.',
};

export default function PrivacyPage() {
  return (
    <main className="legal">
      <div className="wrap">
        <a href="/" className="back">← Back to CazoTask</a>

        <h1>Privacy Policy</h1>
        <p className="updated">Last updated: 1 January 2026</p>

        <p>
          This policy explains what CazoTask does with your information. CazoTask runs automations on
          your behalf, which means we necessarily touch the content inside your connected accounts —
          emails, calendar entries, documents, messages. We have tried to write this in plain English
          rather than the usual fog, because you should be able to tell exactly what happens before
          you connect anything.
        </p>

        <h2 id="who-we-are">Who we are</h2>
        <p>
          CazoTask is the controller of the personal data described here. We are based in Florida,
          in the United States, and we store and process data in the United States. We process data
          under applicable US state privacy laws, including the CCPA/CPRA where you are a California
          resident, and under the UK and EU GDPR where they apply to you. You can reach our
          privacy team at <a href="mailto:privacy@cazotaskai.com">privacy@cazotaskai.com</a>.
        </p>

        <h2 id="what-we-collect">What we collect</h2>
        <ul>
          <li>
            <strong>Account data.</strong> Your email address, authentication identifiers, plan and
            billing status. Card details are handled by Stripe; we never see or store a full card
            number.
          </li>
          <li>
            <strong>Connection data.</strong> When you connect Gmail, Slack, Notion, HubSpot or any
            other tool, we store OAuth access and refresh tokens plus the scopes you granted and the
            account identifier the provider gives us.
          </li>
          <li>
            <strong>Content processed by automations.</strong> The material an automation needs to do
            its job — the body of an email it is triaging, the transcript it is summarising, the
            invoice line items it is chasing — along with the output it produced.
          </li>
          <li>
            <strong>Run logs.</strong> Timestamps, which automation ran, whether it succeeded, what
            action it took, and any errors. Logs include short excerpts of content so you can audit
            what happened.
          </li>
          <li>
            <strong>Product and device data.</strong> IP address, browser and device type, pages
            viewed and features used, for security and to work out what to build next.
          </li>
        </ul>

        <h2 id="how-we-use-it">How we use it</h2>
        <p>
          We use your data to run the automations you switch on, to show you what happened and how
          much time it saved, to keep your account secure, to bill you, and to provide support. We
          also use aggregated, de-identified statistics — how many runs the platform handled, which
          automations are popular — to improve the product. We do not sell personal data, and we do
          not share it with advertising networks.
        </p>

        <h2 id="connected-accounts">Connected accounts and tokens</h2>
        <p>
          Every connection uses OAuth, so you authorise us at the provider and can withdraw that
          authorisation at any time from their settings or ours. We request the narrowest scopes the
          automation you selected actually needs, and we show you each scope in plain English before
          you approve it. Access and refresh tokens are encrypted individually with AES-256-GCM
          before they are stored, under a key the database cannot reach, and are kept in a restricted
          table protected by row-level security. They are decrypted in memory only for the duration of
          a run and are never written to logs.
        </p>

        <h2 id="ai-processing">AI processing</h2>
        <p>
          Automations that draft, classify or summarise send the relevant content to a third-party AI
          provider over an encrypted connection. We use those providers under API terms that prohibit
          training on data submitted through the API and that limit retention to a short window used
          only for abuse monitoring. <strong>Your content is never used to train
          our models or any public model</strong>, and we do not use one customer&apos;s data to improve
          another customer&apos;s results. We send the minimum content the step requires rather than the
          whole mailbox.
        </p>

        <h2 id="legal-bases">Legal bases</h2>
        <p>
          Where the UK or EU GDPR applies to you, we rely on: performance of a contract, to deliver the
          service you signed up for; legitimate interests, for security, fraud prevention and product
          improvement; consent, for optional marketing email and for the specific scopes you grant at
          connection time; and legal obligation, for tax and accounting records.
        </p>

        <h2 id="sharing">Who we share with</h2>
        <p>
          We use a small set of processors: a cloud hosting and database provider, an AI model
          provider, Stripe for payments, an email delivery service, and error and analytics tooling.
          Each is bound by a data processing agreement and standard contractual clauses where data
          moves internationally. We will disclose data if legally compelled, and we will tell you
          unless we are prohibited from doing so.
        </p>

        <h2 id="retention">How long we keep it</h2>
        <p>
          Account data is kept while your account is open. Run logs and processed content are retained
          for 90 days by default so you can audit what an automation did, then deleted automatically;
          paid plans can shorten this. Backups roll off within 35 days. Invoices and tax records are
          kept for six years because we are required to.
        </p>

        <h2 id="deletion">Deleting your data</h2>
        <p>
          You are in control of this and you do not need to email anyone to exercise it.
        </p>
        <ul>
          <li>
            <strong>Disconnect a tool.</strong> Open Settings → Connections and revoke it. The stored
            tokens are destroyed immediately and any automation depending on that tool is paused.
          </li>
          <li>
            <strong>Delete run history.</strong> From the same screen you can clear logs and processed
            content for a single automation or for everything, at any time.
          </li>
          <li>
            <strong>Delete your account.</strong> Settings → Account → Delete account removes your
            profile, connections, automations, logs and processed content from live systems within 24
            hours, and from encrypted backups within 35 days. This is a real deletion, not a hidden
            flag, and it cannot be undone.
          </li>
        </ul>
        <p>
          You can also export everything as JSON before you go. If you would rather we did it for you,
          email <a href="mailto:privacy@cazotaskai.com">privacy@cazotaskai.com</a> from your account
          address and we will action it within 30 days.
        </p>

        <h2 id="your-rights">Your rights</h2>
        <p>
          Depending on where you live, you have the right to access, correct, delete, port and
          restrict processing of your data, to object to processing based on legitimate interests, and
          to withdraw consent. US state residents may also opt out of sale or sharing — we do neither,
          so there is nothing to opt out of. We will not discriminate against you for exercising any
          of these rights. If you are unhappy with our response you can escalate: US residents may
          complain to their state attorney general or to the Federal Trade Commission, UK residents to
          the Information Commissioner&apos;s Office, and EU residents to their national supervisory
          authority.
        </p>

        <h2 id="children">Children</h2>
        <p>
          CazoTask is a business tool and is not directed at anyone under 16. We do not knowingly
          collect data from children, and we delete it if we discover we have.
        </p>

        <h2 id="changes">Changes</h2>
        <p>
          If we make a material change we will email you at least 30 days before it takes effect. The
          date at the top of this page always reflects the current version.
        </p>

        <div className="glass contact">
          Questions about any of this? Email{' '}
          <a href="mailto:privacy@cazotaskai.com">privacy@cazotaskai.com</a> and a person will answer.
        </div>
      </div>
    </main>
  );
}
