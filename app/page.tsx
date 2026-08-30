import Interactions from './(marketing)/Interactions';

export default function HomePage() {
  return (
    <>
      <Interactions />

      <div className="mesh" aria-hidden="true">
        <div className="blob a"></div><div className="blob b"></div><div className="blob c"></div><div className="blob d"></div>
      </div>
      <div className="grain" aria-hidden="true"></div>

      {/* ===================== NAV ===================== */}
      <header id="hdr">
        <div className="wrap">
          <nav className="nav" aria-label="Main">
            <a href="#top" className="logo">
              <span className="logo-mark" aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
              </span>
              CazoTask
            </a>
            <div className="nav-links">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#library">Automations</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="nav-cta">
              <a href="/login" className="btn btn-primary">Start free</a>
              <button className="burger" id="burger" aria-label="Open menu" aria-expanded="false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main id="top">

        {/* ===================== HERO ===================== */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-grid">

              <div>
                <div className="pill"><b>New</b> 12 automations added this month</div>

                <h1 className="h-display">
                  Your week has<br />
                  <span className="grad-text">35 hours of admin</span><br />
                  in it. Delete them.
                </h1>

                <p className="lede">
                  CazoTask is a library of 40+ ready-to-run AI automations for the work that
                  fills your calendar but never moves it forward. Connect your tools, switch
                  one on, and it runs without you from then on.
                </p>

                <div className="hero-cta">
                  <a href="/login" className="btn btn-primary btn-lg">
                    Start free — no card
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </a>
                  <a href="#how" className="btn btn-ghost btn-lg">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    See it run
                  </a>
                </div>

                <div className="hero-note">
                  <span><svg className="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Live in under 10 minutes</span>
                  <span><svg className="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> No code, ever</span>
                  <span><svg className="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Cancel anytime</span>
                </div>

                <div className="stat-rail">
                  <div><strong className="grad-text">40+</strong><span>Ready automations</span></div>
                  <div><strong className="grad-text">Beta</strong><span>Onboarding first users</span></div>
                  <div><strong className="grad-text">No code</strong><span>Switch on, not build</span></div>
                </div>
              </div>

              {/* ---------- automation canvas ---------- */}
              <div className="canvas-shell">
                <div className="float-chip chip-1">
                  <div className="k grad-text">Preview</div>
                  <div className="v">Product interface</div>
                </div>
                <div className="float-chip chip-2">
                  <div className="k" style={{ color: 'var(--mint)' }}>Approval</div>
                  <div className="v">Gate before send</div>
                </div>

                <div className="canvas-bar">
                  <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                  <span className="label">Inbox Triage → Draft → Route</span>
                  <span className="live"><span className="live-dot"></span>Running</span>
                </div>

                <div className="canvas-body">
                  <svg viewBox="0 0 520 400" role="img" aria-label="An automation workflow: incoming email is classified by AI, then a reply is drafted, a task is created, and the team is notified in Slack.">
                    <defs>
                      <linearGradient id="gA" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#6D5EF8"/><stop offset="100%" stopColor="#22D3EE"/>
                      </linearGradient>
                      <linearGradient id="gB" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#34E2A8"/><stop offset="100%" stopColor="#22D3EE"/>
                      </linearGradient>
                      <linearGradient id="gC" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFB020"/><stop offset="100%" stopColor="#FF6B6B"/>
                      </linearGradient>
                      <filter id="gl" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="8" result="b"/>
                        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>

                    {/* connectors */}
                    <g fill="none" strokeWidth="2" strokeLinecap="round">
                      <path d="M150 92 C210 92 210 186 262 186" stroke="rgba(255,255,255,.14)"/>
                      <path d="M150 92 C210 92 210 186 262 186" stroke="url(#gA)" strokeDasharray="7 11" opacity=".95">
                        <animate attributeName="stroke-dashoffset" from="72" to="0" dur="2.4s" repeatCount="indefinite"/>
                      </path>

                      <path d="M370 186 C420 186 420 296 262 296" stroke="rgba(255,255,255,.14)"/>
                      <path d="M370 186 C420 186 420 296 262 296" stroke="url(#gB)" strokeDasharray="7 11" opacity=".95">
                        <animate attributeName="stroke-dashoffset" from="72" to="0" dur="2.4s" begin=".5s" repeatCount="indefinite"/>
                      </path>

                      <path d="M150 296 C110 296 110 186 60 186" stroke="rgba(255,255,255,.10)"/>
                    </g>

                    {/* node: trigger */}
                    <g>
                      <rect x="24" y="58" width="126" height="68" rx="16" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.16)"/>
                      <rect x="38" y="72" width="26" height="26" rx="8" fill="url(#gC)" opacity=".9"/>
                      <path d="M44 80h14v10H44z" fill="none" stroke="#0B0E14" strokeWidth="1.7"/>
                      <path d="M44 80l7 6 7-6" fill="none" stroke="#0B0E14" strokeWidth="1.7"/>
                      <text x="72" y="83" fill="#F6F8FB" fontFamily="Inter,sans-serif" fontSize="11.5" fontWeight="600">Email in</text>
                      <text x="72" y="96" fill="#7A889A" fontFamily="Inter,sans-serif" fontSize="9.5">Trigger</text>
                      <text x="38" y="118" fill="#94A1B2" fontFamily="Inter,sans-serif" fontSize="9.5">Gmail · Outlook</text>
                    </g>

                    {/* node: AI */}
                    <g filter="url(#gl)">
                      <rect x="262" y="150" width="108" height="72" rx="18" fill="rgba(109,94,248,.20)" stroke="rgba(139,123,255,.55)"/>
                    </g>
                    <g>
                      <circle cx="290" cy="180" r="13" fill="url(#gA)"/>
                      <path d="M285 180l4 4 7-8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <text x="310" y="177" fill="#F6F8FB" fontFamily="Inter,sans-serif" fontSize="11.5" fontWeight="600">AI step</text>
                      <text x="310" y="190" fill="#A9B4FF" fontFamily="Inter,sans-serif" fontSize="9.5">Classify</text>
                      <text x="276" y="212" fill="#94A1B2" fontFamily="Inter,sans-serif" fontSize="9.5">Reads · decides · drafts</text>
                    </g>

                    {/* node: actions */}
                    <g>
                      <rect x="150" y="264" width="112" height="64" rx="16" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.16)"/>
                      <rect x="164" y="278" width="24" height="24" rx="7" fill="url(#gB)" opacity=".9"/>
                      <path d="M170 290l4 4 7-8" fill="none" stroke="#08121B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <text x="196" y="288" fill="#F6F8FB" fontFamily="Inter,sans-serif" fontSize="11.5" fontWeight="600">Task</text>
                      <text x="196" y="300" fill="#7A889A" fontFamily="Inter,sans-serif" fontSize="9.5">Created</text>
                    </g>

                    <g>
                      <rect x="286" y="264" width="112" height="64" rx="16" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.16)"/>
                      <rect x="300" y="278" width="24" height="24" rx="7" fill="url(#gA)" opacity=".9"/>
                      <path d="M306 288h12M306 293h8" stroke="#0B0E14" strokeWidth="2" strokeLinecap="round"/>
                      <text x="332" y="288" fill="#F6F8FB" fontFamily="Inter,sans-serif" fontSize="11.5" fontWeight="600">Slack</text>
                      <text x="332" y="300" fill="#7A889A" fontFamily="Inter,sans-serif" fontSize="9.5">Notified</text>
                    </g>

                    {/* ticker */}
                    <g>
                      <rect x="24" y="348" width="374" height="32" rx="11" fill="rgba(52,226,168,.10)" stroke="rgba(52,226,168,.28)"/>
                      <circle cx="42" cy="364" r="4" fill="#34E2A8"><animate attributeName="opacity" values="1;.25;1" dur="1.9s" repeatCount="indefinite"/></circle>
                      <text x="56" y="368" fill="#8FF0CE" fontFamily="Inter,sans-serif" fontSize="10.5" fontWeight="500">Handled 47 emails today · 3h 12m returned to you</text>
                    </g>

                    {/* side rail */}
                    <g opacity=".55">
                      <rect x="424" y="58" width="72" height="14" rx="7" fill="rgba(255,255,255,.10)"/>
                      <rect x="424" y="80" width="52" height="14" rx="7" fill="rgba(255,255,255,.08)"/>
                      <rect x="424" y="102" width="64" height="14" rx="7" fill="rgba(255,255,255,.06)"/>
                    </g>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===================== TRUST STRIP ===================== */}
        <div className="strip">
          <div className="wrap">
            <p>Connects to the tools you already pay for</p>
            <div className="strip-row">
              <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg> Gmail</span>
              <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> Calendar</span>
              <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 9V5a3 3 0 0 0-6 0v4M5 9h14l1 12H4z"/></svg> Slack</span>
              <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11"/></svg> Notion</span>
              <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/></svg> HubSpot</span>
              <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M3 12h18M3 18h12"/></svg> Sheets</span>
              <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8M12 8v8"/></svg> Stripe</span>
            </div>
          </div>
        </div>

        {/* ===================== FEATURES ===================== */}
        <section id="features">
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">Why CazoTask</span>
              <h2 className="h1">Automation without<br />the automation project</h2>
              <p className="lede">Most tools hand you a blank canvas and wish you luck. CazoTask hands you
              the finished workflow, already wired, already tested.</p>
            </div>

            <div className="grid-3">
              <article className="glass card rv">
                <div className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg></div>
                <h3>Switch on, not build</h3>
                <p>Every automation arrives complete — trigger, logic, AI step and output. You pick it, point it at your account, and it starts. No canvas, no nodes, no weekend lost.</p>
              </article>

              <article className="glass card rv">
                <div className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.4"/></svg></div>
                <h3>It learns your voice</h3>
                <p>Drafts come back sounding like you, not like a chatbot. CazoTask reads your past replies and matches tone, length and the phrases you actually use.</p>
              </article>

              <article className="glass card rv">
                <div className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4.5 8-10V5l-8-3-8 3v7c0 5.5 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></div>
                <h3>You approve what matters</h3>
                <p>Set the line yourself. Low-stakes work runs silently; anything that touches a client, a payment or a commitment waits for one tap from you.</p>
              </article>

              <article className="glass card rv">
                <div className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m7 15 4-5 3 3 5-7"/></svg></div>
                <h3>Hours back, counted</h3>
                <p>Every run is logged against the time it would have taken you by hand. Open the dashboard and see the number, not a feeling.</p>
              </article>

              <article className="glass card rv">
                <div className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                <h3>Your data stays yours</h3>
                <p>Encrypted in transit and at rest. Nothing is used to train a public model, and you can revoke any connection and delete the history from one screen.</p>
              </article>

              <article className="glass card rv">
                <div className="ico"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 1.9"/></svg></div>
                <h3>New ones every month</h3>
                <p>The library grows with whatever the community is drowning in. Twelve automations landed this month, and every one is included in your plan.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ===================== HOW IT WORKS ===================== */}
        <section id="how">
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">How it works</span>
              <h2 className="h1">Three steps. Under ten minutes.</h2>
              <p className="lede">The whole point is that setup is not a project. Here is the entire thing.</p>
            </div>

            <div className="steps">

              <article className="glass step rv">
                <div className="step-n">1</div>
                <h3>Connect your tools</h3>
                <p>Sign in with Google, Slack or Microsoft. CazoTask asks only for the permissions the automation you chose actually needs, and shows you each one in plain English.</p>
                <div className="step-art">
                  <svg viewBox="0 0 340 160" role="img" aria-label="Connecting accounts: three app tiles link to CazoTask.">
                    <defs><linearGradient id="s1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6D5EF8"/><stop offset="100%" stopColor="#22D3EE"/></linearGradient></defs>
                    <g fill="none" stroke="url(#s1)" strokeWidth="1.8" strokeDasharray="5 7">
                      <path d="M78 44h84"><animate attributeName="stroke-dashoffset" from="48" to="0" dur="2s" repeatCount="indefinite"/></path>
                      <path d="M78 80h84"><animate attributeName="stroke-dashoffset" from="48" to="0" dur="2s" begin=".3s" repeatCount="indefinite"/></path>
                      <path d="M78 116h84"><animate attributeName="stroke-dashoffset" from="48" to="0" dur="2s" begin=".6s" repeatCount="indefinite"/></path>
                    </g>
                    <g>
                      <rect x="18" y="28" width="60" height="32" rx="10" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.16)"/>
                      <text x="48" y="48" textAnchor="middle" fill="#C6CFDA" fontFamily="Inter,sans-serif" fontSize="10.5" fontWeight="600">Gmail</text>
                      <rect x="18" y="64" width="60" height="32" rx="10" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.16)"/>
                      <text x="48" y="84" textAnchor="middle" fill="#C6CFDA" fontFamily="Inter,sans-serif" fontSize="10.5" fontWeight="600">Slack</text>
                      <rect x="18" y="100" width="60" height="32" rx="10" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.16)"/>
                      <text x="48" y="120" textAnchor="middle" fill="#C6CFDA" fontFamily="Inter,sans-serif" fontSize="10.5" fontWeight="600">Notion</text>
                    </g>
                    <rect x="164" y="52" width="92" height="56" rx="16" fill="rgba(109,94,248,.20)" stroke="rgba(139,123,255,.55)"/>
                    <text x="210" y="78" textAnchor="middle" fill="#fff" fontFamily="Inter,sans-serif" fontSize="12" fontWeight="700">CazoTask</text>
                    <text x="210" y="93" textAnchor="middle" fill="#A9B4FF" fontFamily="Inter,sans-serif" fontSize="9">3 connected</text>
                    <g>
                      <circle cx="292" cy="80" r="18" fill="rgba(52,226,168,.16)" stroke="rgba(52,226,168,.5)"/>
                      <path d="M285 80l5 5 9-10" fill="none" stroke="#34E2A8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  </svg>
                </div>
              </article>

              <article className="glass step rv">
                <div className="step-n">2</div>
                <h3>Pick an automation</h3>
                <p>Browse 40+ finished workflows by the job they do — inbox, meetings, invoices, follow-ups, reporting. Read what it will do, then switch it on.</p>
                <div className="step-art">
                  <svg viewBox="0 0 340 160" role="img" aria-label="Choosing an automation from a list, with a toggle switching to on.">
                    <defs><linearGradient id="s2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6D5EF8"/><stop offset="100%" stopColor="#22D3EE"/></linearGradient></defs>
                    <g>
                      <rect x="20" y="20" width="300" height="36" rx="12" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.10)"/>
                      <circle cx="42" cy="38" r="8" fill="rgba(255,255,255,.14)"/>
                      <rect x="60" y="31" width="110" height="7" rx="3.5" fill="rgba(255,255,255,.22)"/>
                      <rect x="60" y="43" width="70" height="6" rx="3" fill="rgba(255,255,255,.10)"/>
                      <rect x="270" y="30" width="34" height="17" rx="8.5" fill="rgba(255,255,255,.10)"/>
                      <circle cx="279" cy="38.5" r="6" fill="rgba(255,255,255,.35)"/>
                    </g>
                    <g>
                      <rect x="20" y="62" width="300" height="36" rx="12" fill="rgba(109,94,248,.16)" stroke="rgba(139,123,255,.55)"/>
                      <circle cx="42" cy="80" r="8" fill="url(#s2)"/>
                      <rect x="60" y="73" width="126" height="7" rx="3.5" fill="rgba(255,255,255,.6)"/>
                      <rect x="60" y="85" width="84" height="6" rx="3" fill="rgba(255,255,255,.24)"/>
                      <rect x="270" y="72" width="34" height="17" rx="8.5" fill="url(#s2)"/>
                      <circle cx="295" cy="80.5" r="6" fill="#fff"/>
                    </g>
                    <g>
                      <rect x="20" y="104" width="300" height="36" rx="12" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.10)"/>
                      <circle cx="42" cy="122" r="8" fill="rgba(255,255,255,.14)"/>
                      <rect x="60" y="115" width="96" height="7" rx="3.5" fill="rgba(255,255,255,.22)"/>
                      <rect x="60" y="127" width="60" height="6" rx="3" fill="rgba(255,255,255,.10)"/>
                      <rect x="270" y="114" width="34" height="17" rx="8.5" fill="rgba(255,255,255,.10)"/>
                      <circle cx="279" cy="122.5" r="6" fill="rgba(255,255,255,.35)"/>
                    </g>
                  </svg>
                </div>
              </article>

              <article className="glass step rv">
                <div className="step-n">3</div>
                <h3>Get your week back</h3>
                <p>It runs on its own from there. You get a short digest of what happened and what needs a decision from you.</p>
                <div className="step-art">
                  <svg viewBox="0 0 340 160" role="img" aria-label="An illustration of a chart trending upward week over week.">
                    <defs>
                      <linearGradient id="s3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6D5EF8" stopOpacity=".55"/>
                        <stop offset="100%" stopColor="#6D5EF8" stopOpacity="0"/>
                      </linearGradient>
                      <linearGradient id="s3l" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6D5EF8"/><stop offset="100%" stopColor="#34E2A8"/></linearGradient>
                    </defs>
                    <g stroke="rgba(255,255,255,.07)" strokeWidth="1">
                      <path d="M24 132h296M24 100h296M24 68h296M24 36h296"/>
                    </g>
                    <path d="M28 124 L82 112 L136 92 L190 74 L244 52 L298 30 L298 132 L28 132 Z" fill="url(#s3)"/>
                    <path d="M28 124 L82 112 L136 92 L190 74 L244 52 L298 30" fill="none" stroke="url(#s3l)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <g fill="#34E2A8">
                      <circle cx="298" cy="30" r="5"/>
                      <circle cx="298" cy="30" r="9" fill="none" stroke="#34E2A8" strokeWidth="1.4" opacity=".5">
                        <animate attributeName="r" values="6;13;6" dur="2.6s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values=".6;0;.6" dur="2.6s" repeatCount="indefinite"/>
                      </circle>
                    </g>
                    <text x="24" y="150" fill="#6F7C8C" fontFamily="Inter,sans-serif" fontSize="9.5">Week 1</text>
                    <text x="272" y="150" fill="#6F7C8C" fontFamily="Inter,sans-serif" fontSize="9.5">Week 6</text>
                  </svg>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* ===================== METRICS BAND ===================== */}
        <section style={{ paddingTop: '20px' }}>
          <div className="wrap">
            <div className="glass glass-strong band rv">
              <span className="eyebrow">Where we are</span>
              <h2 className="h1" style={{ margin: '14px 0 18px' }}>New product,<br />real results coming soon</h2>
              <p className="lede" style={{ margin: '0 auto', maxWidth: '620px' }}>
                We are running CazoTask with our first beta users right now. Real numbers — hours saved,
                drafts approved — will replace this section as soon as we have them, not before.
              </p>
            </div>
          </div>
        </section>

        {/* ===================== LIBRARY ===================== */}
        <section id="library">
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">The library</span>
              <h2 className="h1">Forty-plus automations,<br />already finished</h2>
              <p className="lede">A sample of what is switched on most often. Each one is live the moment
              you connect the account it needs.</p>
            </div>

            <div className="lib">
              <article className="glass lib-card rv">
                <div className="lib-top">
                  <div className="lib-ico" style={{ background: 'linear-gradient(150deg,rgba(255,176,32,.3),rgba(255,107,107,.16))', border: '1px solid rgba(255,255,255,.12)' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFC978" strokeWidth="1.9"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
                  </div>
                  <h4>Inbox triage &amp; reply</h4>
                </div>
                <p>Sorts every incoming email, drafts the reply in your voice, and files what needs no answer.</p>
                <div className="lib-meta"><span>Gmail · Outlook</span><b>~6.2h / wk</b></div>
              </article>

              <article className="glass lib-card rv">
                <div className="lib-top">
                  <div className="lib-ico" style={{ background: 'linear-gradient(150deg,rgba(109,94,248,.32),rgba(34,211,238,.16))', border: '1px solid rgba(255,255,255,.12)' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#B7BDFF" strokeWidth="1.9"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  </div>
                  <h4>Meeting notes &amp; actions</h4>
                </div>
                <p>Joins the call, writes the summary, pulls out every commitment and assigns it before you leave the room.</p>
                <div className="lib-meta"><span>Zoom · Meet · Teams</span><b>~3.8h / wk</b></div>
              </article>

              <article className="glass lib-card rv">
                <div className="lib-top">
                  <div className="lib-ico" style={{ background: 'linear-gradient(150deg,rgba(52,226,168,.3),rgba(34,211,238,.16))', border: '1px solid rgba(255,255,255,.12)' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7DE9C0" strokeWidth="1.9"><path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <h4>Invoice chase</h4>
                </div>
                <p>Watches what is overdue and sends the polite, escalating follow-up you keep meaning to write.</p>
                <div className="lib-meta"><span>Stripe · QuickBooks</span><b>~1.9h / wk</b></div>
              </article>

              <article className="glass lib-card rv">
                <div className="lib-top">
                  <div className="lib-ico" style={{ background: 'linear-gradient(150deg,rgba(34,211,238,.3),rgba(109,94,248,.16))', border: '1px solid rgba(255,255,255,.12)' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8FE4F5" strokeWidth="1.9"><path d="M3 3v18h18"/><path d="m7 15 4-5 3 3 5-7"/></svg>
                  </div>
                  <h4>Monday client report</h4>
                </div>
                <p>Pulls last week's numbers from every source, writes the commentary, and sends it before you wake up.</p>
                <div className="lib-meta"><span>Sheets · GA4 · HubSpot</span><b>~2.4h / wk</b></div>
              </article>

              <article className="glass lib-card rv">
                <div className="lib-top">
                  <div className="lib-ico" style={{ background: 'linear-gradient(150deg,rgba(255,107,107,.3),rgba(255,176,32,.16))', border: '1px solid rgba(255,255,255,.12)' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFA8A8" strokeWidth="1.9"><path d="M22 17H2l3-4V9a7 7 0 1 1 14 0v4z"/><path d="M10 21h4"/></svg>
                  </div>
                  <h4>Follow-up rescue</h4>
                </div>
                <p>Finds every thread that went quiet on your side and drafts the nudge, ranked by what the deal is worth.</p>
                <div className="lib-meta"><span>Gmail · HubSpot</span><b>~2.1h / wk</b></div>
              </article>

              <article className="glass lib-card rv">
                <div className="lib-top">
                  <div className="lib-ico" style={{ background: 'linear-gradient(150deg,rgba(109,94,248,.32),rgba(255,107,107,.14))', border: '1px solid rgba(255,255,255,.12)' }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C3B8FF" strokeWidth="1.9"><path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11"/></svg>
                  </div>
                  <h4>Proposal builder</h4>
                </div>
                <p>Turns a discovery call transcript into a scoped, priced first-draft proposal on your template.</p>
                <div className="lib-meta"><span>Notion · Docs</span><b>~2.0h / wk</b></div>
              </article>
            </div>

            <div className="center rv" style={{ marginTop: '40px' }}>
              <a href="/login" className="btn btn-ghost">
                Browse all 40+ automations
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </a>
            </div>
          </div>
        </section>

        {/* ===================== PRICING ===================== */}
        <section id="pricing">
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">Pricing</span>
              <h2 className="h1">Cheaper than the hours</h2>
              <p className="lede">Start free and keep the automations you switch on. No card until you decide it is worth it.</p>
            </div>

            <div className="tiers">

              <article className="glass tier rv">
                <h3>Starter</h3>
                <p className="sub">Prove it on one workflow.</p>
                <div className="price"><b>$0</b><i>/ month</i></div>
                <div className="bill">Free forever</div>
                <ul>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 2 active automations</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 100 runs a month</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 3 tool connections</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Hours-saved dashboard</li>
                </ul>
                <a href="/login" className="btn btn-ghost">Start free</a>
              </article>

              <article className="glass tier hot rv">
                <span className="tier-tag">Most popular</span>
                <h3>Pro</h3>
                <p className="sub">The full library, running.</p>
                <div className="price"><b>$29</b><i>/ month</i></div>
                <div className="bill">or $290 a year — two months free</div>
                <ul>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Unlimited automations</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 5,000 runs a month</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Unlimited connections</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Voice matching on every draft</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Custom approval rules</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Every new automation, included</li>
                </ul>
                <a href="/login?plan=pro" className="btn btn-primary">Start 14-day trial</a>
              </article>

              <article className="glass tier rv">
                <h3>Team</h3>
                <p className="sub">Shared workflows, one bill.</p>
                <div className="price"><b>$79</b><i>/ month</i></div>
                <div className="bill">Up to 10 seats</div>
                <ul>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Everything in Pro</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> 25,000 runs a month</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Shared automation library</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Roles and audit log</li>
                  <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Priority support</li>
                </ul>
                <a href="/login?plan=team" className="btn btn-ghost">Start 14-day trial</a>
              </article>

            </div>
          </div>
        </section>

        {/* ===================== FAQ ===================== */}
        <section id="faq">
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">Questions</span>
              <h2 className="h1">Before you connect anything</h2>
            </div>

            <div className="faq">
              <details className="glass q rv">
                <summary>Do I need to know how to build automations?</summary>
                <div className="a">No. That is the whole premise. Every automation in the library is already built, tested and wired end to end. You choose one, connect the account it needs, and it starts running. There is no canvas to drag nodes around on.</div>
              </details>

              <details className="glass q rv">
                <summary>What stops it sending something embarrassing?</summary>
                <div className="a">You set the approval line. Anything below it runs silently; anything above it queues for one tap from you. Client-facing email, payments and anything that makes a commitment default to needing approval, and you can move the line either way at any time.</div>
              </details>

              <details className="glass q rv">
                <summary>Which tools does it connect to?</summary>
                <div className="a">Gmail, Outlook, Google Calendar, Slack, Notion, Google Sheets, HubSpot, Stripe, QuickBooks, Zoom, Google Meet and Microsoft Teams, with more added most months. If an automation needs a tool you do not use, it tells you before you switch it on.</div>
              </details>

              <details className="glass q rv">
                <summary>What happens to my data?</summary>
                <div className="a">It is encrypted in transit and at rest, and it is never used to train a public model. You can revoke any connection and delete the associated history from one screen, and deletion removes it from our systems rather than hiding it.</div>
              </details>

              <details className="glass q rv">
                <summary>Is the free plan actually free?</summary>
                <div className="a">Yes, and it does not expire. Two active automations and 100 runs a month, no card required. Most people run the inbox automation on it for a week, see the hours, and upgrade because they want the rest of the library.</div>
              </details>

              <details className="glass q rv">
                <summary>Can I cancel?</summary>
                <div className="a">Any time, from your account settings, without emailing anyone. You keep access until the end of the period you have paid for, and your data stays available to export for 30 days after that.</div>
              </details>
            </div>
          </div>
        </section>

        {/* ===================== FINAL CTA ===================== */}
        <section style={{ paddingBottom: '40px' }}>
          <div className="wrap">
            <div className="glass glass-strong final rv">
              <h2 className="h1" style={{ marginBottom: '18px' }}>Get the 35 hours back</h2>
              <p className="lede" style={{ maxWidth: '520px', margin: '0 auto 32px' }}>
                Two automations, a hundred runs a month, no card. Switch one on and see
                the number for yourself by Friday.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center' }}>
                <a href="/login" className="btn btn-primary btn-lg">
                  Start free
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
                <a href="#library" className="btn btn-ghost btn-lg">See the library</a>
              </div>
              <p className="small" style={{ marginTop: '22px', color: 'var(--muted-2)' }}>No credit card · Live in under 10 minutes · Cancel any time</p>
            </div>
          </div>
        </section>

      </main>

      {/* ===================== FOOTER ===================== */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <a href="#top" className="logo" style={{ marginBottom: '16px' }}>
                <span className="logo-mark" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
                </span>
                CazoTask
              </a>
              <p className="small" style={{ maxWidth: '290px' }}>The 5-Hour AI Workweek Toolkit. Ready-to-run automations for the admin work that fills your week.</p>
            </div>
            <div>
              <h5>Product</h5>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#library">Automations</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#how">How it works</a></li>
              </ul>
            </div>
            <div>
              <h5>Company</h5>
              <ul>
                <li><a href="/about">About</a></li>
                <li><a href="mailto:support@cazotaskai.com">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5>Legal</h5>
              <ul>
                <li><a href="/privacy">Privacy</a></li>
                <li><a href="/terms">Terms</a></li>
                <li><a href="/security">Security</a></li>
                <li><a href="/privacy#deletion">Data deletion</a></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 CazoTask. All rights reserved.</span>
            <span>Built for people who would rather be doing the actual work.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
