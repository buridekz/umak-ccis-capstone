const KEY = "umak-capstone-surveys";

export type SurveyRecord = {
  id: string;
  at: string;
  kind: "screening" | "confirmation";
  fields: Record<string, string>;
};

export function loadSurveys(): SurveyRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SurveyRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSurveyLocal(
  kind: SurveyRecord["kind"],
  data: FormData,
): SurveyRecord {
  const fields: Record<string, string> = {};
  for (const [key, value] of data.entries()) {
    if (key === "_gotcha") continue;
    fields[key] = String(value);
  }
  const record: SurveyRecord = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    kind,
    fields,
  };
  const all = loadSurveys();
  all.push(record);
  localStorage.setItem(KEY, JSON.stringify(all));
  return record;
}

export function deleteSurvey(id: string) {
  const next = loadSurveys().filter((row) => row.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function downloadSurveys(kind?: SurveyRecord["kind"]) {
  const rows = kind ? loadSurveys().filter((row) => row.kind === kind) : loadSurveys();
  const blob = new Blob([JSON.stringify(rows, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  const slug = kind === "screening" ? "screening" : kind === "confirmation" ? "lab-confirm" : "surveys";
  a.href = url;
  a.download = `capstone-${slug}-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
