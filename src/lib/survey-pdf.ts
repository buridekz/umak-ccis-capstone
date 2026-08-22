import { loadSurveys, type SurveyRecord } from "./survey-store";

const HIDDEN = new Set(["_subject", "_gotcha"]);

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

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

function recordHtml(row: SurveyRecord) {
  const fields = Object.entries(row.fields).filter(
    ([key, value]) => !HIDDEN.has(key) && value.trim(),
  );
  const identity = ["name", "role", "email", "organization"] as const;
  const rest = fields.filter(([key]) => !identity.includes(key as (typeof identity)[number]));
  return `
    <article class="record">
      <h2>${esc(row.fields.name || "Participant")}</h2>
      <p class="meta">${esc(kindLabel(row.kind))} · ${esc(whenLocal(row.at))}</p>
      <p class="meta">${esc([row.fields.role, row.fields.organization, row.fields.email].filter(Boolean).join(" · "))}</p>
      <dl>
        ${rest
          .map(
            ([key, value]) =>
              `<div><dt>${esc(FIELD_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))}</dt><dd>${esc(value)}</dd></div>`,
          )
          .join("")}
      </dl>
    </article>
  `;
}

export function viewSurveysPdf(kind: SurveyRecord["kind"]) {
  const records = loadSurveys().filter((row) => row.kind === kind);
  if (records.length === 0) return;

  const heading = kind === "screening" ? "Five Questions Screening Summary" : "Lab Confirmation Summary";
  const lede =
    kind === "screening"
      ? "Operational screening assessment. Categories only. Academic use. Organization named on the paper only if authorized."
      : "Lab bounds confirmation. Simulated testbed parameters in EVE-NG. Not a copy of a live design.";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>UMak CCIS Capstone — ${heading}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 2.5rem 2.25rem 3.5rem;
      font-family: "DM Sans", "Segoe UI", sans-serif;
      color: #111;
      background: #f4f3f0;
    }
    h1 {
      margin: 0;
      font-family: Figtree, "Segoe UI", sans-serif;
      font-size: 1.85rem;
      letter-spacing: -0.03em;
      line-height: 0.95;
    }
    .lede {
      margin: 0.85rem 0 0;
      max-width: 44ch;
      color: #5a5a5a;
      line-height: 1.45;
    }
    .hint {
      margin: 1.5rem 0 0;
      font-size: 0.85rem;
      color: #5a5a5a;
    }
    .record {
      margin-top: 2.25rem;
      padding-top: 1.5rem;
      border-top: 1px solid #d8d6d2;
      break-inside: avoid;
    }
    h2 {
      margin: 0;
      font-family: Figtree, "Segoe UI", sans-serif;
      font-size: 1.35rem;
      letter-spacing: -0.02em;
    }
    .meta { margin: 0.35rem 0 0; color: #5a5a5a; font-size: 0.92rem; }
    dl { margin: 1rem 0 0; }
    dl div {
      display: grid;
      grid-template-columns: 14rem 1fr;
      gap: 0.75rem;
      padding: 0.55rem 0;
      border-top: 1px solid #e6e4e0;
    }
    dt { color: #5a5a5a; font-size: 0.85rem; font-weight: 600; }
    dd { margin: 0; }
    @media print {
      body { background: white; padding: 0; }
      .hint { display: none; }
    }
  </style>
</head>
<body>
  <h1>UMak CCIS Capstone 1</h1>
  <p class="lede">${esc(lede)}</p>
  <p class="hint">To save a PDF: Print this page → Save as PDF. Then close the tab.</p>
  ${records.map(recordHtml).join("")}
  <script>window.addEventListener("load", () => setTimeout(() => window.print(), 250));</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const tab = window.open(url, "_blank", "noopener");
  if (!tab) {
    URL.revokeObjectURL(url);
    return;
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
