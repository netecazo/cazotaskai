import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — CazoTask',
  description:
    'Why CazoTask exists: ready-to-run automations for the admin work that fills a small business owner’s week.',
};

export default function AboutPage() {
  return (
    <main className="legal">
      <div className="wrap">
        <a href="/" className="back">← Back to CazoTask</a>

        <h1>About CazoTask</h1>

        <p>
          CazoTask was built by Elie Casimir, after watching small business owners lose whole days a
          week to work that no one actually chose to do — sorting the inbox, chasing follow-ups,
          rewriting the same reply, assembling the same Monday report. The tools that promised to fix
          it mostly handed you a blank canvas and a weekend of wiring. Most people never finished.
        </p>

        <p>
          So CazoTask starts from the other end. Every automation in the library is already built,
          already tested, and does one specific job. You connect the account it needs and switch it
          on. Anything that goes out under your name waits for your approval first — that gate is not
          optional, and it is the reason people trust it with an inbox.
        </p>

        <p>
          The approach behind it is process improvement, not novelty: find the step that eats the
          most time, measure it, remove the variation, and leave the human in the loop where judgment
          actually matters. Same discipline that reduces defects on a production line, applied to the
          admin work that fills your week.
        </p>

        <p>
          We are early. CazoTask is running with its first beta users right now, and we would rather
          say that plainly than publish numbers we have not earned. If you want to be one of them,
          or you just want to tell us what is eating your week, we read every email.
        </p>

        <div className="glass contact">
          Questions, feedback or press? Email{' '}
          <a href="mailto:support@cazotaskai.com">support@cazotaskai.com</a>. A person answers,
          usually within one business day.
        </div>
      </div>
    </main>
  );
}
