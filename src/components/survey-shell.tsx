import { Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, CheckCircle2, ShieldCheck } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { deleteSurvey, loadSurveys, type SurveyRecord } from "../lib/survey-store";
import { viewSurveysPdf } from "../lib/survey-pdf";

export const SURVEY_PILL =
  "cursor-pointer rounded-full border border-ink/25 px-5 py-2 text-sm font-medium transition-colors duration-200 ease-out has-[:checked]:bg-ink has-[:checked]:text-canvas has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink";

export const SURVEY_RULES = [
  "Zero production access, configs, or credentials required",
  "Zero proprietary logs, client data, or PCI scope",
  "100% simulated inside an isolated EVE-NG virtual testbed",
  "Organization named on the paper only if explicitly authorized",
];

const FIELD_LABELS: Record<string, string> = {
  path: "Path to Remote Sites",
  fault: "Primary Recurring Fault",
  failover: "Current Failover Process",
  detection: "Incident Detection Method",
  never_auto: "Prohibited Automated Actions",
  attribution: "Research Attribution",
  notes: "Operational Notes / Scenarios",
  scale: "Infrastructure Scale",
  frequency: "Fault Frequency",
  recovery: "Current Recovery Workflow",
  allowed_auto: "Approved Automated Actions",
  never_lab: "Strictly Prohibited in Lab",
  stop_who: "Kill Switch Authority Role",
  simulate: "EVE-NG Simulation Consent",
  path_other: "Other Path Details",
  fault_other: "Other Fault Details",
  failover_other: "Other Failover Details",
  detection_other: "Other Detection Details",
  never_auto_other: "Other Prohibited Actions",
  scale_other: "Other Scale Details",
  frequency_other: "Other Frequency Details",
  recovery_other: "Other Recovery Details",
  allowed_auto_other: "Other Approved Actions",
  never_lab_other: "Other Prohibited Actions",
};

export function Honeypot() {
  return (
    <input
      type="text"
      name="_gotcha"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
    />
  );
}

export function SurveyShell({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-canvas font-body text-ink">
      <div className="bento-frame m-3 grid sm:m-5 lg:h-[calc(100dvh-2.5rem)] lg:grid-cols-[minmax(18rem,0.82fr)_minmax(0,1.18fr)]">
        <aside className="flex flex-col justify-between bg-ink px-8 py-8 text-canvas sm:px-10 sm:py-10 lg:min-h-0 lg:px-12 lg:py-12">
          <div>
            <Link
              to="/"
              className="font-display text-lg font-extrabold tracking-tight text-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas"
            >
              UMak CCIS <span className="text-canvas/55">· Capstone 1</span>
            </Link>
            <h1 className="mt-14 font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
              {title}
            </h1>
            <p className="mt-8 max-w-[34ch] text-[1.05rem] leading-relaxed text-canvas/75">{lede}</p>
          </div>
          <ul className="mt-10 grid gap-3 lg:mt-20">
            {SURVEY_RULES.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-2.5 border-t border-canvas/15 pt-3 text-[0.92rem] leading-snug text-canvas/75"
              >
                <ShieldCheck className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </aside>
        <section className="survey-pane bento flex min-h-0 flex-col overflow-y-auto px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <Link
            to="/"
            className="mb-8 inline-flex w-fit items-center gap-2 font-display text-sm font-semibold text-ink underline-offset-4 transition-colors duration-200 ease-out hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to Overview
          </Link>
          {children}
        </section>
      </div>
    </main>
  );
}

export function IdentityFields() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2">
        <span className="sr-only">Name</span>
        <input required name="name" placeholder="Full Name" className="field" />
      </label>
      <label className="grid gap-2">
        <span className="sr-only">Role</span>
        <input required name="role" placeholder="Role / Position (e.g. Systems Admin)" className="field" />
      </label>
      <label className="grid gap-2">
        <span className="sr-only">Email</span>
        <input required type="email" name="email" placeholder="Email Address" className="field" />
      </label>
      <label className="grid gap-2">
        <span className="sr-only">Organization</span>
        <input required name="organization" placeholder="Organization / Agency Name" className="field" />
      </label>
    </div>
  );
}

export type SurveyQ = {
  name: string;
  title: string;
  hint: string;
  multiple?: boolean;
  exclusive?: string[];
  options: string[];
};

export function SurveyQuestion({ q }: { q: SurveyQ }) {
  function onChange(e: FormEvent<HTMLFieldSetElement>) {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.checked && q.multiple && q.exclusive?.length) {
      const boxes = [
        ...e.currentTarget.querySelectorAll<HTMLInputElement>(`input[name="${q.name}"]`),
      ];
      if (q.exclusive.includes(target.value)) {
        boxes.forEach((box) => {
          if (box !== target) box.checked = false;
        });
      } else {
        boxes.forEach((box) => {
          if (box !== target && q.exclusive?.includes(box.value)) box.checked = false;
        });
      }
    }
    const otherOn = Boolean(e.currentTarget.querySelector('input[value="Other"]:checked'));
    const extra = e.currentTarget.querySelector<HTMLInputElement>(`input[name="${q.name}_other"]`);
    if (extra) {
      extra.disabled = !otherOn;
      if (otherOn) {
        const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.setTimeout(() => extra.focus(), instant ? 0 : 380);
      }
    }
  }

  return (
    <fieldset className="survey-q grid gap-5" onChange={onChange}>
      <legend className="grid max-w-[46ch] gap-2">
        <span className="font-display text-xl font-bold tracking-tight">{q.title}</span>
        <span className="font-body text-[0.95rem] font-normal leading-snug text-ink-soft">
          {q.hint}
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {q.options.map((opt) => (
          <label key={opt} className={SURVEY_PILL}>
            <input
              type={q.multiple ? "checkbox" : "radio"}
              name={q.name}
              value={opt}
              required={!q.multiple}
              className="sr-only"
            />
            {opt}
          </label>
        ))}
      </div>
      {q.options.includes("Other") ? (
        <div className="other-field">
          <div className="other-field-inner">
            <label className="sr-only" htmlFor={`${q.name}_other`}>
              Other answer for {q.title}
            </label>
            <input
              id={`${q.name}_other`}
              name={`${q.name}_other`}
              disabled
              autoComplete="off"
              placeholder="Specify (categories only, no IPs or passwords)"
              className="field"
            />
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}

const HIDDEN_FIELDS = new Set(["_subject", "_gotcha"]);

function recapEntries(fields: Record<string, string>) {
  return Object.entries(fields).filter(([key, value]) => !HIDDEN_FIELDS.has(key) && value.trim());
}

function kindLabel(kind: SurveyRecord["kind"]) {
  return kind === "screening" ? "Screening Assessment" : "Lab Bounds Confirmation";
}

function whenLocal(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function SurveySaved({
  kind,
  remote,
  next,
  onAgain,
}: {
  kind: SurveyRecord["kind"];
  remote: boolean;
  next?: { to: "/" | "/gather" | "/confirm"; label: string };
  onAgain?: () => void;
}) {
  const [all, setAll] = useState(() => loadSurveys());
  const records = all.filter((row) => row.kind === kind);
  const latest = records[records.length - 1];
  const rows = [...records].reverse();

  function remove(id: string) {
    deleteSurvey(id);
    setAll(loadSurveys());
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 mb-2">
            <CheckCircle2 className="size-3.5" />
            <span>Submission Logged</span>
          </div>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold tracking-tight">
            Research Response Summary
          </h2>
          <p className="mt-2 max-w-[44ch] text-[0.95rem] leading-snug text-ink-soft">
            Your operational insights have been securely recorded. You can view or save a formal PDF summary of your responses below.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => viewSurveysPdf(kind)}
            className="press cta-gradient flex items-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <FileText className="size-4" />
            <span>View / Save PDF</span>
          </button>
        </div>
      </header>

      {latest ? (
        <section className="mt-8 border-t border-ink/15 pt-6">
          <p className="font-display text-2xl font-bold tracking-tight">{latest.fields.name || "Participant"}</p>
          <p className="mt-1 text-[0.95rem] text-ink-soft">
            {[latest.fields.role, latest.fields.organization, kindLabel(latest.kind)]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="mt-0.5 text-xs text-ink-soft">{whenLocal(latest.at)}</p>
          
          <dl className="mt-6 grid gap-3">
            {recapEntries(latest.fields)
              .filter(([key]) => !["name", "role", "organization", "email"].includes(key))
              .map(([key, value]) => (
                <div key={key} className="grid grid-cols-[minmax(10rem,0.4fr)_minmax(0,1fr)] gap-3 border-t border-ink/10 pt-3">
                  <dt className="text-sm font-semibold text-ink-soft">
                    {FIELD_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </dt>
                  <dd className="text-[0.95rem] leading-snug font-medium text-ink">{value}</dd>
                </div>
              ))}
          </dl>
        </section>
      ) : (
        <p className="mt-10 text-ink-soft">No responses recorded on this session.</p>
      )}

      <section className="mt-10 flex min-h-0 flex-1 flex-col border-t border-ink/15 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold tracking-tight text-ink-soft">
            Submission History ({records.length})
          </h3>
        </div>
        <ul className="mt-3 min-h-0 flex-1 overflow-y-auto">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-4 border-t border-ink/10 py-3 first:border-t-0"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-[0.95rem] font-semibold tracking-tight">
                  {row.fields.name || "Participant"}
                  <span className="font-body font-normal text-ink-soft">
                    {" · "}
                    {kindLabel(row.kind)}
                  </span>
                </p>
                <p className="truncate text-xs text-ink-soft">
                  {row.fields.organization || "Anonymized"} · {whenLocal(row.at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(row.id)}
                className="shrink-0 text-xs font-medium text-ink-soft underline-offset-4 hover:text-red-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Clear
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {onAgain ? (
            <button
              type="button"
              onClick={onAgain}
              className="press-fill rounded-full border border-ink/70 px-6 py-3 font-display text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Submit Another Response
            </button>
          ) : null}
          {next ? (
            <Link
              to={next.to}
              className="press cta-gradient rounded-full px-6 py-3 font-display text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {next.label}
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
