import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent } from "react";

import { SurveyShell } from "../components/survey-shell";
import { viewRequestLetter } from "../lib/letter-pdf";

export const Route = createFileRoute("/letter")({
  head: () => ({
    meta: [
      { title: "Request letter — UMak CCIS Capstone" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "UMak CCIS request letter for an industry partner. Fill the addressee, then print or save as PDF.",
      },
    ],
  }),
  component: Letter,
});

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function Letter() {
  return (
    <SurveyShell
      title="Request letter"
      lede="The school request letter. Fill whoever can sign, then print."
    >
      <LetterForm />
    </SurveyShell>
  );
}

function LetterForm() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    viewRequestLetter({
      date: String(data.get("date") || ""),
      honorific: String(data.get("honorific") || "Mr."),
      lastName: String(data.get("lastName") || ""),
      fullName: String(data.get("fullName") || ""),
      title: String(data.get("title") || ""),
      organization: String(data.get("organization") || ""),
      address: String(data.get("address") || ""),
    });
  }

  return (
    <form className="grid max-w-[36rem] gap-4" onSubmit={onSubmit}>
      <p className="max-w-[42ch] text-[0.95rem] leading-relaxed text-ink-soft">
        Same layout as the template from class. Names, email, and phone are already filled. Adviser
        stays blank for wet ink.
      </p>
      <label className="grid gap-2">
        <span className="sr-only">Date</span>
        <input required type="date" name="date" defaultValue={todayIso()} className="field" />
      </label>
      <div className="grid gap-4 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
        <label className="grid gap-2">
          <span className="sr-only">Honorific</span>
          <select name="honorific" className="field" defaultValue="Mr.">
            <option>Mr.</option>
            <option>Ms.</option>
            <option>Mx.</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="sr-only">Last name for Dear</span>
          <input required name="lastName" placeholder="Last name (Dear …)" className="field" />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="sr-only">Full name</span>
        <input required name="fullName" placeholder="Full name" className="field" />
      </label>
      <label className="grid gap-2">
        <span className="sr-only">Title</span>
        <input required name="title" defaultValue="I.T. Department Head" className="field" />
      </label>
      <label className="grid gap-2">
        <span className="sr-only">Organization</span>
        <input required name="organization" placeholder="Organization" className="field" />
      </label>
      <label className="grid gap-2">
        <span className="sr-only">Address</span>
        <textarea
          required
          name="address"
          rows={3}
          placeholder="Address"
          className="field resize-none"
        />
      </label>
      <button
        type="submit"
        className="press cta-gradient mt-2 w-fit rounded-full px-8 py-4 font-display text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        View / save PDF
      </button>
    </form>
  );
}
