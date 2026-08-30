import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — CazoTask',
  description:
    'The agreement between you and CazoTask: what the service does, what you are responsible for, billing, cancellation, liability and termination.',
};

export default function TermsPage() {
  return (
    <main className="legal">
      <div className="wrap">
        <a href="/" className="back">← Back to CazoTask</a>

        <h1>Terms of Service</h1>
        <p className="updated">Last updated: 1 January 2026</p>

        <p>
          These terms are the agreement between you and CazoTask. By creating an account or using the
          service you accept them. If you are agreeing on behalf of a company, you confirm you have
          the authority to bind it, and &quot;you&quot; means that company.
        </p>

        <h2 id="service">What the service is</h2>
        <p>
          CazoTask is a library of pre-built automations. You connect your own accounts — email,
          calendar, chat, documents, CRM, billing — choose an automation, and CazoTask runs it on your
          behalf on a schedule or in response to a trigger. Some steps use AI to classify, summarise or
          draft. We may add, change or retire individual automations; if we retire one you actively
          use, we will give you 30 days&apos; notice and suggest a replacement.
        </p>

        <h2 id="account">Your account</h2>
        <ul>
          <li>You must be at least 16 and legally able to enter a contract.</li>
          <li>
            Keep your credentials secure. You are responsible for everything that happens under your
            account, including actions taken by automations you switched on.
          </li>
          <li>
            One account per person on Starter and Pro. Team plans include named seats; sharing a single
            login across people is not permitted.
          </li>
          <li>Tell us promptly at security@cazotaskai.com if you suspect unauthorised access.</li>
        </ul>

        <h2 id="your-responsibility">Automations act with your authority</h2>
        <p>
          This is the most important clause here, so it is not buried. When you switch an automation on
          and grant it access to an account, it acts as you. It can send email, post messages, create
          records and take other actions inside the scopes you approved. You choose the approval line:
          anything above it waits for your explicit confirmation, anything below it runs on its own.
          You are responsible for where you set that line and for what the automations you enabled do.
          Review an automation&apos;s description and its permissions before enabling it.
        </p>
        <p>
          You are also responsible for having the right to give us access to the data in those
          accounts, and for complying with the terms of the third-party services you connect. We are
          not responsible for a third party changing, rate-limiting or withdrawing its API.
        </p>

        <h2 id="acceptable-use">Acceptable use</h2>
        <p>You agree not to use CazoTask to:</p>
        <ul>
          <li>Send spam, bulk unsolicited messages, or anything that breaches anti-spam law.</li>
          <li>Impersonate a person or organisation, or generate content designed to deceive.</li>
          <li>
            Process data you are not permitted to process, or special-category data where you have no
            lawful basis.
          </li>
          <li>Break, probe or circumvent our security, rate limits or usage quotas.</li>
          <li>Resell the service or run it as a white-labelled product without a written agreement.</li>
          <li>Harass, defame, or do anything unlawful.</li>
        </ul>
        <p>
          We may suspend an account immediately for a serious or repeated breach. Where the risk allows,
          we will warn you first and give you a chance to fix it.
        </p>

        <h2 id="plans">Plans, billing and trials</h2>
        <p>
          The Starter plan is free and does not expire, with the published limits on active automations,
          monthly runs and connections. Paid plans are billed in advance, monthly or annually, through
          Stripe. Prices are exclusive of VAT and sales tax, which are added where applicable.
        </p>
        <ul>
          <li>
            <strong>Trials.</strong> Paid trials run for 14 days. If you do not cancel before the trial
            ends, the plan converts and the first payment is taken.
          </li>
          <li>
            <strong>Renewal.</strong> Subscriptions renew automatically for the same period until
            cancelled.
          </li>
          <li>
            <strong>Cancellation.</strong> Cancel any time from account settings, without contacting
            anyone. You keep access until the end of the period you have paid for. We do not pro-rate
            partial periods.
          </li>
          <li>
            <strong>Refunds.</strong> If something is genuinely broken on our side, email us within 14
            days and we will refund the period. UK and EU consumers keep their statutory rights.
          </li>
          <li>
            <strong>Price changes.</strong> We will give 30 days&apos; notice by email before any increase
            affects your renewal. You can cancel instead.
          </li>
          <li>
            <strong>Overages.</strong> If you exceed your monthly run allowance, automations pause until
            the next cycle or until you upgrade. We do not silently bill you for overage.
          </li>
        </ul>

        <h2 id="ip">Intellectual property</h2>
        <p>
          We own CazoTask — the software, the automation templates, the brand. You get a
          non-exclusive, non-transferable right to use it while your account is in good standing. You
          own your data and the outputs an automation produces for you, and you may use them however
          you like. You grant us only the licence needed to run the service for you: to process, store
          and transmit your content to deliver the automations you enabled. We do not train models on
          your content.
        </p>
        <p>
          If you send us feedback or a feature request, we may use it without obligation or payment.
        </p>

        <h2 id="ai-output">AI output</h2>
        <p>
          AI steps can be wrong. Drafts may contain factual errors, misread tone, or misclassify
          something important. CazoTask is a drafting and routing assistant, not professional advice of
          any kind. Keep an approval step on anything consequential — client communication, payments,
          legal or financial commitments — and review output before it goes out.
        </p>

        <h2 id="availability">Availability</h2>
        <p>
          We aim for high availability but do not promise uninterrupted service on Starter or Pro.
          Maintenance windows are announced in advance where possible. Team plans may include a
          separate service level commitment in a written order form, which takes precedence over this
          section.
        </p>

        <h2 id="liability">Warranties and liability</h2>
        <p>
          The service is provided &quot;as is&quot; to the fullest extent permitted by law. To the extent
          permitted, our total liability arising out of these terms in any 12-month period is limited to
          the amount you paid us in that period, and we are not liable for indirect or consequential
          loss, lost profits, lost revenue or lost data. Nothing here limits liability for death or
          personal injury caused by negligence, for fraud, or for anything else that cannot lawfully be
          limited.
        </p>

        <h2 id="termination">Termination</h2>
        <p>
          You can close your account at any time from settings; deletion follows our{' '}
          <a href="/privacy#deletion">data deletion process</a>. We may terminate for material breach,
          non-payment after notice, or if we discontinue the service entirely — in which case we will
          give 60 days&apos; notice and refund any unused prepaid period. Your data remains exportable
          for 30 days after termination.
        </p>

        <h2 id="general">General</h2>
        <p>
          These terms are governed by the laws of England and Wales, and the courts of England and
          Wales have exclusive jurisdiction, unless mandatory local consumer law in your country says
          otherwise. If a clause is unenforceable, the rest stands. We may update these terms and will
          email you at least 30 days before a material change takes effect; continuing to use the
          service after that means you accept the new version.
        </p>

        <div className="glass contact">
          Questions? Email <a href="mailto:legal@cazotaskai.com">legal@cazotaskai.com</a>.
        </div>
      </div>
    </main>
  );
}
