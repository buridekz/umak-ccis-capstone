import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  FileText,
  Terminal,
  Radio,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/idea")({
  head: () => ({
    meta: [
      {
        title: "System Architecture & Study Blueprint — UMak CCIS Capstone",
      },
      {
        name: "description",
        content:
          "Automated Fault Detection and Bounded Self-Healing Architecture for Multi-Site Enterprise Networks with a Human-in-the-Loop Safety Guardrail. Modeled in EVE-NG with a Next.js Operations Console.",
      },
    ],
  }),
  component: Idea,
});

const LAYERS = [
  {
    n: "01",
    title: "Real-Time Telemetry & Sensing Layer",
    subtitle: "Continuous Health & Anomaly Detection",
    icon: Activity,
    points: [
      "Continuous ICMP IP SLA tracking probes, SNMP interface counters, and Syslog log streams.",
      "Accurately distinguishes between a 'Hard Down' link failure vs. intermittent 'Flapping' or 'Silent Blackholing'.",
      "All probes run inside our private EVE-NG virtual environment with zero connection to live corporate networks.",
    ],
  },
  {
    n: "02",
    title: "Bounded Self-Healing Automation Engine",
    subtitle: "Deterministic Python Playbooks (Netmiko / Scrapli)",
    icon: Zap,
    points: [
      "Executes only strictly pre-approved, vetted actions from the defined Bounded Catalog.",
      "Zero unconstrained 'black-box' AI—every action is deterministic and mathematically predictable.",
      "Automatic Rollback Guardrail: Reverts router/switch configuration if healthy metrics are not restored in 60 seconds.",
    ],
  },
  {
    n: "03",
    title: "Next.js Operations & Kill Switch Dashboard",
    subtitle: "Human-in-the-Loop Oversight & Management",
    icon: Sliders,
    points: [
      "Live multi-site topology health map with Green / Amber / Red node and link states.",
      "Real-time incident audit stream displaying detected faults, remediation executed, and exact MTTR in seconds.",
      "Single-Click Emergency Kill Switch: Instantly halts all automation and hands full control back to human engineers.",
    ],
  },
];

const FAULTS = [
  {
    id: "WAN-01",
    domain: "Layer 3 · WAN Link",
    name: "Primary WAN Link Flapping",
    fault:
      "Primary ISP connection drops and recovers repeatedly (>3 drops in 60s), causing routing oscillation.",
    action:
      "Automatically damps the primary interface, adjusts OSPF/BGP route metrics, and cleanly shifts traffic to Backup WAN.",
    safety:
      "Traffic automatically fails back to the primary link only after 5 continuous minutes of zero flap events.",
  },
  {
    id: "WAN-02",
    domain: "Layer 3 · WAN Link",
    name: "Silent Gateway Blackholing",
    fault:
      "Physical WAN interface appears UP, but the upstream next-hop provider silently drops all egress packets.",
    action:
      "IP SLA probe detects packet loss threshold, triggers dynamic route withdrawal, and re-routes via secondary gateway.",
    safety:
      "Auto-rollbacks and alerts NOC if the secondary link also exhibits packet loss, preventing routing loop storms.",
  },
  {
    id: "LAN-01",
    domain: "Layer 2 · Campus LAN",
    name: "LACP / EtherChannel Trunk Degradation",
    fault:
      "One physical member link inside an active 2-port bundle experiences duplex mismatch or heavy CRC errors.",
    action: "Identifies the degrading interface and dynamically isolates it from the Port-Channel bundle.",
    safety:
      "Keeps trunk traffic flowing seamlessly across the remaining healthy member without dropping the entire trunk.",
  },
  {
    id: "LAN-02",
    domain: "Layer 2 · Campus LAN",
    name: "Rogue Switch / STP BPDU Loop",
    fault:
      "Accidental cable loop or unauthorized rogue switch insertion triggers BPDU inundation and network-wide TCN storms.",
    action:
      "Anomaly detector identifies rogue BPDU source and immediately error-disables (err-disable) the offending access port.",
    safety:
      "Port remains safely quarantined until a human administrator reviews and re-enables it from the Next.js dashboard.",
  },
];

const ADDONS = [
  {
    title: "Instant Webhook NOC Alerts",
    desc: "Broadcasts structured incident and remediation summaries directly to Discord, Telegram, or MS Teams channels.",
    icon: Radio,
  },
  {
    title: "Automated Post-Mortem Generator",
    desc: "Generates clean one-page RCA (Root Cause Analysis) PDF/Markdown reports with timestamps, actions, and verified MTTR.",
    icon: FileText,
  },
  {
    title: "Live Application Traffic Generator",
    desc: "Simulated iperf3 / ping bots in EVE-NG demonstrating real-time packet loss charts before, during, and after self-healing.",
    icon: Terminal,
  },
  {
    title: "Dynamic Bounded Catalog Editor",
    desc: "Web GUI configuration panel allowing engineers to safely fine-tune threshold timers without modifying backend code.",
    icon: Sliders,
  },
];

function Idea() {
  return (
    <main className="bg-canvas font-body text-ink">
      <nav className="site-nav flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Link
          to="/"
          className="font-display text-lg font-extrabold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:text-xl"
        >
          UMak CCIS <span className="text-ink-soft">· Capstone 1</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-display text-sm font-semibold text-ink underline-offset-4 transition-colors duration-200 ease-out hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span>Back to Overview</span>
        </Link>
      </nav>

      <div className="bento-frame mx-3 mb-3 sm:mx-5">
        <article className="flex flex-col justify-between bg-ink px-8 py-10 text-canvas sm:px-12 sm:py-14 lg:min-h-[min(88dvh,52rem)] lg:px-16 lg:py-16">
          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-canvas/55">
              Technical Architecture & Research Blueprint
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-[0.95rem] text-canvas/70">
              <ShieldCheck className="size-4 shrink-0" aria-hidden />
              100% Simulation in EVE-NG
            </p>
            <h1 className="mt-10 max-w-[22ch] font-display text-[clamp(2.2rem,5.4vw,4.4rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
              Automated Fault Detection and Bounded Self-Healing Architecture for Multi-Site
              Enterprise Networks with a Human-in-the-Loop Safety Guardrail
            </h1>
          </div>
          <div className="mt-14 max-w-[66ch]">
            <p className="text-[1.05rem] leading-relaxed text-canvas/70">
              In multi-site enterprise and government infrastructures (Central Office to
              Regional/District branches), everyday network faults—link flapping, silent blackholes,
              LACP degradation, and STP loops—frequently cause prolonged downtime. Manual NOC triage
              typically takes{" "}
              <strong className="font-semibold text-canvas">20 to 45 minutes</strong>.
            </p>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-canvas/70">
              This research establishes an extensible automation framework simulated in{" "}
              <strong className="font-semibold text-canvas">EVE-NG</strong> paired with a{" "}
              <strong className="font-semibold text-canvas">Next.js Operations Dashboard</strong>.
              The system continuously monitors network health, detects anomalies instantly, executes
              pre-approved remediation from a{" "}
              <strong className="font-semibold text-canvas">Bounded Action Catalog</strong>, and
              strictly enforces an{" "}
              <strong className="font-semibold text-canvas">
                Emergency Human Kill Switch & Auto-Rollback
              </strong>{" "}
              to eliminate runaway automation risks.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/gather"
                className="press cta-gradient inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas"
              >
                <span>Step 1: 5-Question Screening</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/confirm"
                className="press-fill inline-flex items-center gap-2 rounded-full border border-canvas/40 px-6 py-3.5 font-display text-sm font-semibold text-canvas transition-colors duration-200 ease-out hover:border-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas"
              >
                <span>Step 2: Confirm Lab Bounds</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </article>
      </div>

      <div className="bento-frame mx-3 mb-3 sm:mx-5">
        <article className="bento px-8 py-10 sm:px-12 sm:py-14 lg:px-16">
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-soft">
            System Decomposition
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.8rem)] font-extrabold tracking-tight">
            Three-Tier Architectural Model
          </h2>
          <p className="mt-4 max-w-[52ch] text-[0.98rem] leading-relaxed text-ink-soft">
            Executed entirely on dedicated research machines connected to virtualized EVE-NG network
            nodes.
          </p>
          <ol className="mt-12 grid gap-0">
            {LAYERS.map((layer) => {
              const Icon = layer.icon;
              return (
                <li
                  key={layer.n}
                  className="grid gap-4 border-t border-ink/15 py-10 lg:grid-cols-[6.5rem_minmax(0,1fr)] lg:gap-12"
                >
                  <p className="font-display text-4xl font-extrabold tracking-tight text-ink-soft">
                    {layer.n}
                  </p>
                  <div>
                    <div className="flex items-start gap-3">
                      <Icon className="mt-1 size-5 shrink-0 text-ink" aria-hidden />
                      <div>
                        <h3 className="font-display text-2xl font-bold tracking-tight">{layer.title}</h3>
                        <p className="mt-1.5 text-[0.95rem] font-medium text-ink-soft">{layer.subtitle}</p>
                      </div>
                    </div>
                    <ul className="mt-6 grid max-w-[58ch] gap-3">
                      {layer.points.map((pt) => (
                        <li key={pt} className="text-[0.98rem] leading-relaxed text-ink-soft">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </article>
      </div>

      <div className="bento-frame mx-3 mb-3 sm:mx-5">
        <article className="bento px-8 py-10 sm:px-12 sm:py-14 lg:px-16">
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-soft">
            Bounded Playbook Matrix
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.8rem)] font-extrabold tracking-tight">
            The Four Reference Fault Playbooks
          </h2>
          <p className="mt-4 max-w-[58ch] text-[0.98rem] leading-relaxed text-ink-soft">
            To guarantee high scientific rigor and avoid unmanageable scope sprawl, the core engine
            validates four representative Layer 2 & Layer 3 operational fault categories.
          </p>
          <ul className="mt-4">
            {FAULTS.map((row) => (
              <li key={row.id} className="border-t border-ink/15 py-10 first:mt-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-display text-[0.8rem] font-semibold tracking-[0.12em] text-ink-soft">
                    {row.id}
                    <span className="mx-3 text-ink/25">/</span>
                    {row.domain}
                  </p>
                </div>
                <h3 className="mt-3 font-display text-[1.65rem] font-bold tracking-tight">{row.name}</h3>
                <dl className="mt-8 grid gap-8 lg:grid-cols-3">
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <AlertTriangle className="size-3.5" aria-hidden />
                      Failure Mode
                    </dt>
                    <dd className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{row.fault}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <CheckCircle2 className="size-3.5" aria-hidden />
                      Bounded Automated Action
                    </dt>
                    <dd className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{row.action}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <ShieldCheck className="size-3.5" aria-hidden />
                      Safety & Rollback Rule
                    </dt>
                    <dd className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{row.safety}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="bento-frame mx-3 mb-3 sm:mx-5">
        <article className="bento px-8 py-10 sm:px-12 sm:py-14 lg:px-16">
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-soft">
            Extensibility & Tooling
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.2vw,2.8rem)] font-extrabold tracking-tight">
            Modular Capabilities & Analytics Extensions
          </h2>
          <p className="mt-4 max-w-[52ch] text-[0.98rem] leading-relaxed text-ink-soft">
            Additional operational modules integrated into the platform to enhance situational
            awareness.
          </p>
          <ul className="mt-10 grid gap-x-16 gap-y-10 sm:grid-cols-2">
            {ADDONS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="border-t border-ink/15 pt-6">
                  <p className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {item.title}
                  </p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{item.desc}</p>
                </li>
              );
            })}
          </ul>
        </article>
      </div>

      <div className="bento-frame mx-3 mb-3 sm:mx-5">
        <article className="bento grid gap-12 px-8 py-10 sm:px-12 sm:py-14 lg:grid-cols-2 lg:gap-20 lg:px-16">
          <div>
            <p className="font-display text-sm font-semibold tracking-tight text-ink-soft">A</p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,2.4vw,2.1rem)] font-extrabold tracking-tight">
              What the Client / Partner Provides
            </h2>
            <ul className="mt-6 grid gap-4 text-[0.98rem] leading-relaxed text-ink-soft">
              <li>
                High-level insights on typical multi-site routing setups and recurring operational
                failure modes.
              </li>
              <li>
                Responses to the two short questionnaires (
                <Link
                  to="/gather"
                  className="font-semibold text-ink underline-offset-4 hover:underline"
                >
                  /gather
                </Link>{" "}
                and{" "}
                <Link
                  to="/confirm"
                  className="font-semibold text-ink underline-offset-4 hover:underline"
                >
                  /confirm
                </Link>
                ) to parameterize the EVE-NG lab.
              </li>
              <li>Review and feedback on the proposed Bounded Catalog and safety rules.</li>
            </ul>
          </div>
          <div className="border-t border-ink/15 pt-12 lg:border-l lg:border-t-0 lg:pl-20 lg:pt-0">
            <p className="font-display text-sm font-semibold tracking-tight text-ink-soft">B</p>
            <h2 className="mt-3 font-display text-[clamp(1.6rem,2.4vw,2.1rem)] font-extrabold tracking-tight">
              What the Client / Partner Receives
            </h2>
            <ul className="mt-6 grid gap-4 text-[0.98rem] leading-relaxed text-ink-soft">
              <li>
                A complete documented{" "}
                <strong className="font-semibold text-ink">
                  Architecture Blueprint & Self-Healing Evaluation Report
                </strong>{" "}
                detailing measured MTTR recovery metrics.
              </li>
              <li>
                Pre-configured{" "}
                <strong className="font-semibold text-ink">
                  EVE-NG Simulation Topologies & Python Automation Scripts
                </strong>{" "}
                for independent testing.
              </li>
              <li>
                Formal academic acknowledgment (or 100% anonymization, based on client preference).
              </li>
            </ul>
          </div>
        </article>
      </div>

      <div className="px-8 py-12 sm:px-12">
        <p className="text-center text-[0.72rem] font-semibold tracking-[0.16em] text-ink-soft">
          Ready to Begin Data Gathering?
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/gather"
            className="press cta-gradient inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-display text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <span>Step 1: Open Screening Questionnaire</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/"
            className="press-fill inline-flex items-center gap-2 rounded-full border border-ink/70 px-6 py-3.5 font-display text-sm font-semibold transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
