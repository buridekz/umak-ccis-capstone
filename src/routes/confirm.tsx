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
          "After you say yes: a short confirmation of what we may model in the lab. Categories only.",
      },
    ],
  }),
  component: Confirm,
});

const QUESTIONS: SurveyQ[] = [
  {
    name: "scale",
    title: "1. Roughly how many sites should we treat this as?",
    hint: "A count is enough. Don’t name offices.",
    options: ["HQ plus one remote", "HQ plus two or three remotes", "HQ plus four or more", "Other", "Skip"],
  },
  {
    name: "path",
    title: "2. How does HQ usually reach a remote site?",
    hint: "One line, or a main plus a spare. No vendor names.",
    options: ["One path", "Main plus a backup", "Mix — it depends", "Other", "Skip"],
  },
  {
    name: "fault",
    title: "3. What’s the problem that keeps coming back?",
    hint: "The usual kind. Not a ticket, a circuit ID, or a site name.",
    options: ["Link or fiber down", "It flaps", "Power or the gateway", "Routing or a session", "Other", "Skip"],
  },
  {
    name: "frequency",
    title: "4. When that happens, how often does it actually bother people?",
    hint: "A feel is enough. Don’t export a log.",
    options: ["Rarely", "A few times a month", "Weekly or more", "Other", "Skip"],
  },
  {
    name: "recovery",
    title: "5. Right now, how does it usually get fixed?",
    hint: "Does it come back by itself, or does someone have to do it?",
    options: ["Mostly by itself", "A person does it", "Mix", "Other", "Skip"],
  },
  {
    name: "allowed_auto",
    title: "6. In our lab only, which automatic fixes are we allowed to try?",
    hint: "Tick every one that is okay. Fake network, our machines. If we should only watch and raise an alert, pick that — it clears the others.",
    multiple: true,
    exclusive: ["Only detect it and alert — no automatic fix", "Skip"],
    options: [
      "Move traffic onto the backup path",
      "Move traffic back to the main path once it is up again",
      "Disconnect and reconnect one stuck VPN or login — not restart the whole device",
      "Only detect it and alert — no automatic fix",
      "Other",
      "Skip",
    ],
  },
  {
    name: "never_lab",
    title: "7. Even in that lab, which of these must stay a person’s job — never a script?",
    hint: "Tick every line we must not let the lab cross on its own. If a script may do all of these in the lab, pick None of these.",
    multiple: true,
    exclusive: ["None of these", "Skip"],
    options: [
      "Change the routing",
      "Change firewall / ACL rules",
      "Shut a link on purpose",
      "Reboot a device",
      "None of these",
      "Other",
      "Skip",
    ],
  },
  {
    name: "stop_who",
    title: "8. If something does run by itself in the lab, who must be able to cancel it?",
    hint: "The person who can shut that automatic action off. A role, not a name.",
    options: ["Whoever is on duty", "A specific senior person", "Other", "Skip"],
  },
  {
    name: "simulate",
    title: "9. Next term, may we build a lab that behaves like this kind of network — not a copy of yours?",
    hint: "Simulation on our machines only. We do not touch your live network. If yes, say whether the organization can be named on the paper.",
    options: [
      "Yes — keep the organization unnamed",
      "Yes — the name may appear on the paper",
      "Not yet",
      "No",
    ],
  },
];

function Confirm() {
  return (
    <SurveyShell
      title="One more pass"
      lede="You already said yes. This just locks what we may fake in the lab — not on your network. Skip anything you can’t share. Other opens a line under that question."
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
        setError("Tick something on 6 and 7, even if it’s Skip.");
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
        {busy ? "Sending…" : "Send this"}
        {busy ? null : <ArrowRight className="size-5" />}
      </button>
    </form>
  );
}
