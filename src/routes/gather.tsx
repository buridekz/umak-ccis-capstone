import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Landmark, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";

import {
  Honeypot,
  IdentityFields,
  SurveyQuestion,
  SurveySaved,
  SurveyShell,
  type SurveyQ,
} from "../components/survey-shell";
import { submitSurvey } from "../lib/formspree";

export const Route = createFileRoute("/gather")({
  head: () => ({
    meta: [
      { title: "Screening Assessment — UMak CCIS Capstone" },
      {
        name: "description",
        content:
          "Step 1: Five operational screening questions for the UMak CCIS Capstone. Categories only. No IPs, configs, or client data.",
      },
    ],
  }),
  component: Gather,
});

const QUESTIONS: SurveyQ[] = [
  {
    name: "path",
    title: "1. Network Path to Remote Sites",
    hint: "Single link only, or a primary path plus a backup? No vendor names needed.",
    options: ["Single path only", "Primary + Backup link", "Mix (depends on location)", "Other", "Skip"],
  },
  {
    name: "fault",
    title: "2. Primary Repeating Problem at Remote Sites",
    hint: "The most frequent operational failure mode. No ticket IDs or IP schemes.",
    options: ["Link down / Fiber cut", "Link flapping (intermittent)", "Power / Gateway unreachable", "Routing loop / session stall", "Other", "Skip"],
  },
  {
    name: "failover",
    title: "3. When the Primary Path Fails",
    hint: "Does failover occur automatically, or does a network engineer manually step in?",
    options: ["Automatic failover", "Requires manual intervention", "Mix (partly automated)", "Other", "Skip"],
  },
  {
    name: "detection",
    title: "4. How Do You Usually First Detect an Outage?",
    hint: "User complaints, automated monitoring alert, or discovered during routine checks.",
    options: ["User reports", "Automated alert", "Discovered later", "Other", "Skip"],
  },
  {
    name: "never_auto",
    title: "5. Which Actions Must NEVER Run Without a Human Stop?",
    hint: "Select every action category that must strictly require human authorization. Skip if unsure.",
    multiple: true,
    exclusive: ["None (all safe in lab)", "Skip"],
    options: ["Dynamic Failover", "Routing Table Changes", "Session / Peer Restart", "Firewall / ACL Rules", "None (all safe in lab)", "Other", "Skip"],
  },
];

function Gather() {
  return (
    <SurveyShell
      title="Operational Screening"
      lede="Step 1: Baseline Assessment. A quick 3-minute operational survey for our Capstone research. We focus purely on general architecture categories — strictly zero IPs, configuration files, or credentials."
    >
      <GatherForm />
    </SurveyShell>
  );
}

function GatherForm() {
  const [sent, setSent] = useState(false);
  const [remote, setRemote] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <SurveySaved
        kind="screening"
        remote={remote}
        onAgain={() => setSent(false)}
        next={{ to: "/confirm", label: "Proceed to Step 2: Confirm Lab Bounds" }}
      />
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const never = [...form.querySelectorAll<HTMLInputElement>('input[name="never_auto"]:checked')];
    if (never.length === 0) {
      setError("Please select at least one option for Question 5 (or choose Skip).");
      return;
    }
    setBusy(true);
    const data = new FormData(form);
    data.set("never_auto", data.getAll("never_auto").map(String).join(", "));
    const result = await submitSurvey("screening", data);
    setBusy(false);
    setRemote(result.remote);
    setSent(true);
  }

  return (
    <form className="relative grid" onSubmit={onSubmit}>
      <input type="hidden" name="_subject" value="Capstone data gathering — screening assessment" />
      <Honeypot />
      <IdentityFields />

      {QUESTIONS.map((q) => (
        <SurveyQuestion key={q.name} q={q} />
      ))}

      <label className="survey-q grid gap-6">
        <span className="grid max-w-[46ch] gap-2">
          <span className="font-display text-xl font-bold tracking-tight">
            One sentence on your top recurring network headache (Optional)
          </span>
          <span className="font-body text-[0.95rem] font-normal leading-snug text-ink-soft">
            In your own words: what is the most frustrating repeating inter-site network issue? No
            IPs or configs.
          </span>
        </span>
        <textarea
          name="notes"
          rows={4}
          placeholder="e.g. ISP link flaps cause BGP drops before the NOC can verify the root cause..."
          className="field min-h-[8.5rem] resize-none"
        />
      </label>

      <fieldset className="survey-q grid gap-6">
        <legend className="grid max-w-[46ch] gap-2">
          <span className="font-display text-xl font-bold tracking-tight">
            Research Attribution Preference
          </span>
          <span className="font-body text-[0.95rem] font-normal leading-snug text-ink-soft">
            Select whether your organization can be named in our thesis paper.
          </span>
        </legend>
        <div className="grid gap-3">
          <label className="flex cursor-pointer items-start gap-4 rounded-[1.25rem] border border-ink/25 px-6 py-5 text-[0.95rem] font-medium leading-snug transition-colors duration-200 ease-out hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-canvas has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
            <input
              type="radio"
              name="attribution"
              value="Anonymize"
              defaultChecked
              className="sr-only"
            />
            <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>Keep Anonymized (Labeled as &apos;A Multi-Site Agency / Enterprise&apos;)</span>
          </label>
          <label className="flex cursor-pointer items-start gap-4 rounded-[1.25rem] border border-ink/25 px-6 py-5 text-[0.95rem] font-medium leading-snug transition-colors duration-200 ease-out hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-canvas has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
            <input type="radio" name="attribution" value="Yes" className="sr-only" />
            <Landmark className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>Organization Name May Be Acknowledged</span>
          </label>
        </div>
      </fieldset>

      {error ? (
        <p className="mt-10 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="press cta-gradient mt-12 inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 font-display text-base font-semibold text-ink disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {busy ? "Submitting Assessment…" : "Submit Screening Data"}
        {busy ? null : <ArrowRight className="size-5" />}
      </button>
    </form>
  );
}
