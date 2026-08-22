import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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

export const Route = createFileRoute("/confirm")({
  head: () => ({
    meta: [
      { title: "Lab Bounds Confirmation — UMak CCIS Capstone" },
      {
        name: "description",
        content:
          "Step 2: Defining the simulation parameters and bounded automation safety rules for EVE-NG. Categories only.",
      },
    ],
  }),
  component: Confirm,
});

const QUESTIONS: SurveyQ[] = [
  {
    name: "scale",
    title: "1. Roughly how many sites / branches should we model in the simulation?",
    hint: "A general scale is enough. No specific office names needed.",
    options: [
      "HQ + 1 Remote Site / Floor",
      "HQ + 2 to 3 Remote Branches",
      "HQ + 4 or more (Nationwide scale)",
      "Other",
      "Skip",
    ],
  },
  {
    name: "path",
    title: "2. How does HQ typically connect to a remote site?",
    hint: "Single link or dual-redundancy. No vendor or provider names needed.",
    options: ["Single path only", "Primary + Backup link", "Mix (depends on location)", "Other", "Skip"],
  },
  {
    name: "fault",
    title: "3. What is the main repeating network issue you experience?",
    hint: "The general failure category. No ticket numbers or IP schemes.",
    options: ["Physical link / Fiber down", "Link flapping (intermittent)", "Power / Gateway unreachable", "Routing session stall (OSPF/BGP)", "Other", "Skip"],
  },
  {
    name: "frequency",
    title: "4. When that happens, roughly how often does it disrupt operations?",
    hint: "A general estimate is fine. No need to export incident logs.",
    options: ["Rarely (few times a year)", "A few times a month", "Weekly or more", "Other", "Skip"],
  },
  {
    name: "recovery",
    title: "5. Right now, how does that issue usually get resolved?",
    hint: "Does it recover automatically, or does a network engineer manually step in?",
    options: ["Mostly automatic", "Requires manual engineer intervention", "Mix (partly automated, partly manual)", "Other", "Skip"],
  },
  {
    name: "allowed_auto",
    title: "6. In our virtual lab only, which automated actions are safe to test?",
    hint: "Select all that are acceptable in an isolated EVE-NG simulation. If we should only detect and alert with zero automatic fix, select that.",
    multiple: true,
    exclusive: ["Only detect & raise alert (no auto-fix)", "Skip"],
    options: [
      "Auto-switch traffic to Backup WAN path",
      "Auto-revert traffic back to Primary WAN once link is stable",
      "Soft-reset a stuck VPN interface or routing session (no device reboot)",
      "Only detect & raise alert (no auto-fix)",
      "Other",
      "Skip",
    ],
  },
  {
    name: "never_lab",
    title: "7. Which actions must NEVER run automatically without a human stop?",
    hint: "Select every action that must strictly require manual administrator confirmation.",
    multiple: true,
    exclusive: ["None of these", "Skip"],
    options: [
      "Dynamic routing table changes",
      "Modifying firewall / ACL security policies",
      "Intentionally disabling a core link",
      "Rebooting physical/virtual network hardware",
      "None of these",
      "Other",
      "Skip",
    ],
  },
  {
    name: "stop_who",
    title: "8. When an automated action triggers, who should hold the Kill Switch authority?",
    hint: "The role authorized to cancel or override the automation.",
    options: ["Any NOC engineer on duty", "Designated Senior Admin / IT Lead only", "Other", "Skip"],
  },
  {
    name: "simulate",
    title: "9. May we model this architectural profile in our EVE-NG research testbed?",
    hint: "Simulated entirely on our private machines. We never touch live networks. Please select your attribution preference.",
    options: [
      "Yes — keep the organization fully anonymized",
      "Yes — organization name may be acknowledged in the paper",
      "Not yet (needs further alignment)",
      "No",
    ],
  },
];

function Confirm() {
  return (
    <SurveyShell
      title="Lab Bounds Confirmation"
      lede="Step 2: Technical Lab Parameterization. This locks the bounded remediation actions and safety guardrails we will simulate in our EVE-NG testbed. Categories only."
    >
      <ConfirmForm />
    </SurveyShell>
  );
}

function ConfirmForm() {
  const [sent, setSent] = useState(false);
  const [remote, setRemote] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (sent) {
    return (
      <SurveySaved
        kind="confirmation"
        remote={remote}
        onAgain={() => setSent(false)}
        next={{ to: "/", label: "Return to Project Overview" }}
      />
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    for (const name of ["allowed_auto", "never_lab"] as const) {
      const picked = [...form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)];
      if (picked.length === 0) {
        setError("Please select an option for questions 6 and 7 (or choose Skip).");
        return;
      }
    }
    setBusy(true);
    const data = new FormData(form);
    for (const name of ["allowed_auto", "never_lab"]) {
      data.set(name, data.getAll(name).map(String).join(", "));
    }
    const result = await submitSurvey("confirmation", data);
    setBusy(false);
    setRemote(result.remote);
    setSent(true);
  }

  return (
    <form className="relative grid" onSubmit={onSubmit}>
      <input type="hidden" name="_subject" value="Capstone data gathering — lab confirmation" />
      <Honeypot />
      <IdentityFields />

      {QUESTIONS.map((q) => (
        <SurveyQuestion key={q.name} q={q} />
      ))}

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
        {busy ? "Submitting Parameters…" : "Confirm & Save Lab Parameters"}
        {busy ? null : <ArrowRight className="size-5" />}
      </button>
    </form>
  );
}
