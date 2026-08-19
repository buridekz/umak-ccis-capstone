import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UMak CCIS Capstone — Calling for an Industry Partner" },
      {
        name: "description",
        content:
          "BSIT Information and Network Security capstone at University of Makati is looking for a multi-site company as the subject of the study. Data gathering from conversations, not from your network. Simulated in EVE-NG. No fee.",
      },
      { property: "og:title", content: "UMak CCIS Capstone — Calling for an Industry Partner" },
      {
        property: "og:description",
        content:
          "Academic capstone seeking a multi-site company as the subject of the study. Modeled in EVE-NG. We never touch your live network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NEVER_ASK = [
  "Production access, configs, syslog, or passwords",
  "Client data or PCI",
  "A live assessment of your LAN",
  "Your company name on the paper, unless you authorize it",
];

const WHO: Array<{ k: string; v: string }> = [
  {
    k: "Organization",
    v: "More than one site: HQ and a branch, two buildings, or two delivery floors. Work-from-home is useful, not required.",
  },
  {
    k: "Person",
    v: "IT, NOC, infrastructure, or BCP who can take two or three short conversations.",
  },
  {
    k: "You get",
    v: "Your organization as the subject of the study. We gather from conversations you approve, model that kind of network in EVE-NG, and put your name on the paper only if you allow it.",
  },
  {
    k: "We will not",
    v: "Rewire your floor, copy your real design, install hardware, or handle client traffic.",
  },
];

function Nav() {
  return (
    <nav className="site-nav px-5 py-4 sm:px-8 sm:py-5">
      <span className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
        UMak CCIS <span className="text-ink-soft">· Capstone 1</span>
      </span>
    </nav>
  );
}

const FORMSPREE = "https://formspree.io/f/mzepybyl";

function PartnerForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <div className="form-received grid min-h-[280px] place-items-center text-center">
        <p className="font-display text-2xl font-bold leading-snug tracking-tight">
          Received.
          <br />
          <span className="text-ink-soft">We&rsquo;ll email you a short briefing you can forward.</span>
        </p>
      </div>
    );
  }

  return (
    <form
      className="relative grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setBusy(true);
        const data = new FormData(e.currentTarget);
        try {
          const res = await fetch(FORMSPREE, {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" },
          });
          const body = (await res.json().catch(() => null)) as {
            error?: string;
            errors?: Array<{ message: string }>;
          } | null;
          if (res.ok) {
            setSent(true);
            return;
          }
          setError(
            body?.errors?.[0]?.message ??
              body?.error ??
              "Couldn’t send. Email Lance instead.",
          );
        } catch {
          setError("Couldn’t send. Check your connection or email Lance.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <input type="hidden" name="_subject" value="Capstone partner request" />
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="sr-only">Name</span>
          <input required name="name" placeholder="Name" className="field" />
        </label>
        <label className="grid gap-2">
          <span className="sr-only">Role</span>
          <input required name="role" placeholder="Role" className="field" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="sr-only">Email</span>
          <input required type="email" name="email" placeholder="Email" className="field" />
        </label>
        <label className="grid gap-2">
          <span className="sr-only">Organization</span>
          <input required name="organization" placeholder="Organization" className="field" />
        </label>
      </div>
      <fieldset className="grid gap-2">
        <legend className="pb-1 text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft">
          COMPANY NAME ON THE PAPER
        </legend>
        <div className="flex flex-wrap gap-2">
          {["Yes", "Anonymize"].map((opt, i) => (
            <label
              key={opt}
              className="cursor-pointer rounded-full border border-ink/25 px-5 py-2 text-sm font-medium transition-colors duration-200 ease-out has-[:checked]:bg-ink has-[:checked]:text-canvas has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
            >
              <input
                type="radio"
                name="attribution"
                value={opt}
                defaultChecked={i === 0}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-2">
        <span className="sr-only">Message (optional)</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Message (optional)"
          className="field resize-none"
        />
      </label>
      {error ? (
        <p className="text-sm font-medium text-ink" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="press cta-gradient mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 font-display text-base font-semibold text-ink disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {busy ? "Sending…" : "Request a 15-min conversation"}
        {busy ? null : <ArrowRight className="size-5" />}
      </button>
    </form>
  );
}

function NeverMarquee() {
  const set = (hidden = false) => (
    <ul className="never-marquee-set" aria-hidden={hidden || undefined}>
      {NEVER_ASK.map((item) => (
        <li key={`${hidden ? "b" : "a"}-${item}`} className="never-marquee-item">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="never-marquee" aria-label="What we will never ask">
      <p className="never-marquee-label">WHAT WE WILL NEVER ASK</p>
      <div className="never-marquee-viewport">
        <div className="never-marquee-track">
          {set()}
          {set(true)}
        </div>
      </div>
    </div>
  );
}

function Index() {
  const poc = {
    name: "Lance Josh M. Corpuz",
    email: "lcorpuz.k12149953@umak.edu.ph",
    phone: "0962-298-2327",
    tel: "+639622982327",
  };
  const teammates = ["Jhorenz S. Camarador", "Justin Mark B. Luzano"];

  return (
    <main className="bg-canvas font-body text-ink">
      <div className="stage">
        <Nav />

        <div className="billboard bento-frame">
          <section className="hero-billboard bento">
            <h1 className="hero-title">
              <span>Calling for an</span>
              <span>industry partner</span>
            </h1>
            <p className="hero-lede">
              Capstone Project and Research 1. Academic project. Not a paid engagement. We need a
              company with more than one site as the subject of the study. Data gathering is short
              conversations and what you allow us to describe, not a pull from your systems.
              Simulated in EVE-NG.{" "}
              <span className="font-semibold text-ink">We do not touch your live network.</span>
            </p>
            <div className="hero-actions">
              <a href="#contact" className="press cta-gradient rounded-full px-9 py-5 font-display text-lg font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                Request a 15-min conversation
              </a>
              <a
                href={`mailto:${poc.email}`}
                aria-label={`Email ${poc.name}`}
                className="press-fill grid size-14 place-items-center rounded-full border border-ink/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <Mail className="size-5" />
              </a>
            </div>
          </section>
          <NeverMarquee />
        </div>
      </div>

      <div className="bento-frame bento-cards mx-3 mb-3 sm:mx-5 sm:mb-5">
        <div className="grid gap-[5px] lg:grid-cols-3">
          <article id="idea" className="bento flex min-h-[560px] flex-col justify-between p-10">
            <div>
              <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-soft">
                STARTING IDEA
              </p>
              <h2 className="mt-6 font-display text-[1.85rem] font-bold leading-[1.12] tracking-tight">
                A multi-site network that detects everyday faults, self-heals inside a bounded
                catalog, and still has a human kill switch.
              </h2>
            </div>
            <p className="mt-8 text-base leading-relaxed text-ink-soft">
              If it is not useful, tell us — we reshape it from what you are allowed to share.
              Networking and infrastructure only.{" "}
              <span className="font-semibold text-ink">We do not touch production.</span>
            </p>
          </article>

          <article
            id="who"
            className="bento grain flex min-h-[560px] flex-col justify-between bg-surface-2 p-10"
          >
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight">
              Who this is for
            </h2>
            <ul className="mt-8 grid gap-4">
              {WHO.map((row) => (
                <li key={row.k} className="border-t border-ink/15 pt-4">
                  <p className="font-display text-base font-bold tracking-tight">{row.k}</p>
                  <p className="mt-1.5 text-[0.95rem] leading-snug text-ink-soft">{row.v}</p>
                </li>
              ))}
            </ul>
          </article>

          <article id="when" className="bento flex min-h-[560px] flex-col justify-between p-10">
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight">When</h2>
            <div className="mt-8 grid gap-7">
              <div className="border-t border-ink/15 pt-4">
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-soft">NOW</p>
                <p className="mt-1.5 font-display text-xl font-bold tracking-tight">Capstone 1</p>
                <p className="mt-1.5 text-[0.95rem] leading-snug text-ink-soft">
                  Partner yes or no, interviews, design on paper, proposal defense. No build on your
                  site.
                </p>
              </div>
              <div className="border-t border-ink/15 pt-4">
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-soft">
                  NEXT TERM
                </p>
                <p className="mt-1.5 font-display text-xl font-bold tracking-tight">Capstone 2</p>
                <p className="mt-1.5 text-[0.95rem] leading-snug text-ink-soft">
                  EVE-NG topology, injected faults, defense, optional walkthrough. Mostly online —
                  we visit only if you invite us.
                </p>
              </div>
            </div>
            <p className="mt-8 text-[0.95rem] leading-snug text-ink-soft">
              Most coordination is online. We visit only if you invite us.
            </p>
          </article>
        </div>
      </div>

      <section
        id="contact"
        className="mx-3 mt-16 grid gap-12 sm:mx-5 sm:mt-24 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16"
      >
        <div>
          <h2 className="font-display text-[clamp(2.8rem,6vw,4.2rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
            Talk to us
          </h2>
          <p className="mt-12 font-display text-[1.65rem] font-bold leading-tight tracking-tight">
            {poc.name}
          </p>
          <div className="mt-5 grid gap-3">
            <a
              href={`mailto:${poc.email}`}
              className="flex items-start gap-3 text-[0.95rem] text-ink-soft transition-colors duration-200 ease-out hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span className="break-words underline-offset-4 hover:underline">{poc.email}</span>
            </a>
            <a
              href={`tel:${poc.tel}`}
              className="flex items-center gap-3 text-[0.95rem] text-ink-soft transition-colors duration-200 ease-out hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Phone className="size-4 shrink-0" aria-hidden />
              <span className="underline-offset-4 hover:underline">{poc.phone}</span>
            </a>
          </div>
          <ul className="mt-12 grid gap-1">
            {teammates.map((name) => (
              <li
                key={name}
                className="font-display text-base font-semibold tracking-tight text-ink-soft"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-ink/15 pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          <PartnerForm />
        </div>
      </section>

      <footer className="grid gap-2 px-5 py-10 text-sm text-ink-soft sm:flex sm:items-center sm:justify-between sm:px-8">
        <p>University of Makati · College of Computing and Information Sciences · 2026</p>
        <p>Academic capstone. Not a commercial engagement.</p>
      </footer>
    </main>
  );
}
