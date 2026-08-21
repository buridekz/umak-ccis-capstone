import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Honeypot, IdentityFields, SurveyQuestion, SurveySaved, SurveyShell, SURVEY_PILL, type SurveyQ } from "../components/survey-shell";
import { submitSurvey } from "../lib/formspree";

export const Route = createFileRoute("/gather")({
  head: () => ({
    meta: [
      { title: "Five questions — UMak CCIS Capstone" },
      {
        name: "description",
        content:
          "Five category questions for the UMak CCIS capstone. About five minutes. No IPs, configs, or client data.",
      },
    ],
  }),
  component: Gather,
});

const QUESTIONS: SurveyQ[] = [
  {
    name: "path",
    title: "1. Path between HQ and a remote site",
    hint: "One link only, or a primary plus a backup? No vendor names.",
    options: ["One path", "Primary + backup", "Other", "Skip"],
  },
  {
    name: "fault",
    title: "2. What kind of problem repeats at a remote site?",
    hint: "The usual class — not a ticket, circuit ID, or site name.",
    options: ["Link down / fiber", "Flapping", "Power / gateway", "Other", "Skip"],
  },
  {
    name: "failover",
    title: "3. If that main path dies",
    hint: "Does failover run by itself, or does a person have to do it?",
    options: ["Automatic", "A person does it", "Mix", "Other", "Skip"],
  },
  {
    name: "detection",
    title: "4. How do you usually first find out?",
    hint: "Users complaining, an alert, or you notice later.",
    options: ["Users", "An alert", "Later", "Other", "Skip"],
  },
  {
    name: "never_auto",
    title: "5. What must never run with nobody able to stop it?",
    hint: "Pick every class that should stay human. Skip if you cannot say.",
    multiple: true,
    exclusive: ["None", "Skip"],
    options: ["Failover", "Routing", "Session restart", "Firewall / ACL", "None", "Other", "Skip"],
  },
];

function Gather() {
  return (
    <SurveyShell
      title="Five questions"
      lede="About five minutes. Categories only. Skip anything you cannot share. Other opens a line under that question — still no IPs, configs, or passwords."
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
        next={{ to: "/confirm", label: "Confirm lab bounds" }}
      />
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const never = [...form.querySelectorAll<HTMLInputElement>('input[name="never_auto"]:checked')];
    if (never.length === 0) {
      setError("Question 5 needs at least one pick, or Skip.");
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
      <input type="hidden" name="_subject" value="Capstone data gathering — screening" />
      <Honeypot />
      <IdentityFields />

      {QUESTIONS.map((q) => (
        <SurveyQuestion key={q.name} q={q} />
      ))}

      <fieldset className="survey-q grid gap-5">
        <legend className="grid max-w-[46ch] gap-2">
          <span className="font-display text-xl font-bold tracking-tight">
            Organization name on the paper
          </span>
          <span className="font-body text-[0.95rem] font-normal leading-snug text-ink-soft">
            Anonymize is the default. The school letter can still name the office.
          </span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {["Anonymize", "Yes"].map((opt, i) => (
            <label key={opt} className={SURVEY_PILL}>
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

      {error ? (
        <p className="mt-10 text-sm font-medium text-ink" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="press cta-gradient mt-12 inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 font-display text-base font-semibold text-ink disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {busy ? "Sending…" : "Send answers"}
        {busy ? null : <ArrowRight className="size-5" />}
      </button>
    </form>
  );
}
