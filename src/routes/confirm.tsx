import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Honeypot, IdentityFields, SurveyQuestion, SurveySaved, SurveyShell, type SurveyQ } from "../components/survey-shell";
import { submitSurvey } from "../lib/formspree";

export const Route = createFileRoute("/confirm")({
  head: () => ({
    meta: [
      { title: "Confirm lab bounds — UMak CCIS Capstone" },
      {
        name: "description",
        content:
          "After you agree to be the subject: confirm what we may model in EVE-NG. Categories only.",
      },
    ],
  }),
  component: Confirm,
});

const QUESTIONS: SurveyQ[] = [
  {
    name: "scale",
    title: "1. Scale we may treat as this kind of network",
    hint: "Counts only. Not office names or locations.",
    options: ["HQ + 1 remote", "HQ + 2–3 remotes", "HQ + 4 or more", "Other", "Skip"],
  },
  {
    name: "path",
    title: "2. Path between HQ and a remote",
    hint: "Confirm the pattern. No vendor names.",
    options: ["One path", "Primary + backup", "Mix", "Other", "Skip"],
  },
  {
    name: "fault",
    title: "3. The repeating fault we are allowed to study",
    hint: "One class — the one you already described, or Skip.",
    options: ["Link down / fiber", "Flapping", "Power / gateway", "Routing / session", "Other", "Skip"],
  },
  {
    name: "frequency",
    title: "4. When that happens, work is hit",
    hint: "A feel for how often. Not a log export.",
    options: ["Rarely", "A few times a month", "Weekly or more", "Other", "Skip"],
  },
  {
    name: "recovery",
    title: "5. Today, recovery is",
    hint: "How it usually gets restored — not the playbook file.",
    options: ["Mostly automatic", "A person does it", "Mix", "Other", "Skip"],
  },
  {
    name: "allowed_auto",
    title: "6. Allowed in the lab as a short automatic list",
    hint: "What we may simulate running by itself. Not on your network.",
    multiple: true,
    exclusive: ["Neither — detect and alert only", "Skip"],
    options: [
      "Fail over to backup",
      "Restart a known session",
      "Neither — detect and alert only",
      "Other",
      "Skip",
    ],
  },
  {
    name: "never_lab",
    title: "7. Must never run in the lab with no stop",
    hint: "The kill switch bound. Pick every class that stays human.",
    multiple: true,
    exclusive: ["None", "Skip"],
    options: ["Change routing", "Change firewall / ACL", "Shut a link", "None", "Other", "Skip"],
  },
  {
    name: "stop_who",
    title: "8. Who must be able to stop it",
    hint: "A role, not a person’s name.",
    options: ["Whoever is on duty", "A specific senior person", "Other", "Skip"],
  },
  {
    name: "simulate",
    title: "9. We may build a lab of this class in EVE-NG — not a copy of your design",
    hint: "This is the yes for Capstone 2 simulation.",
    options: ["Yes, anonymize the org", "Yes, name may appear", "Not yet", "No"],
  },
];

function Confirm() {
  return (
    <SurveyShell
      title="Confirm the lab"
      lede="Only after you agreed to be the subject. This locks what we may model in EVE-NG. Other opens a line under that question — still no IPs or configs."
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
        remote={remote}
        onAgain={() => setSent(false)}
        next={{ to: "/", label: "Back to the page" }}
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
        setError("Questions 6 and 7 need at least one pick, or Skip.");
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
        <p className="mt-10 text-sm font-medium text-ink" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="press cta-gradient mt-12 inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 font-display text-base font-semibold text-ink disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {busy ? "Sending…" : "Send confirmation"}
        {busy ? null : <ArrowRight className="size-5" />}
      </button>
    </form>
  );
}
