import { saveSurveyLocal, type SurveyRecord } from "./survey-store";

const FORMSPREE = "https://formspree.io/f/mzepybyl";

export async function postFormspree(data: FormData): Promise<{
  ok: boolean;
  message?: string;
}> {
  const res = await fetch(FORMSPREE, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  });
  const body = (await res.json().catch(() => null)) as {
    error?: string;
    errors?: Array<{ message: string }>;
  } | null;
  if (res.ok) return { ok: true };
  return {
    ok: false,
    message: body?.errors?.[0]?.message ?? body?.error ?? "Couldn’t send. Email Lance instead.",
  };
}

export async function submitSurvey(
  kind: SurveyRecord["kind"],
  data: FormData,
): Promise<{ remote: boolean }> {
  saveSurveyLocal(kind, data);
  try {
    const result = await postFormspree(data);
    return { remote: result.ok };
  } catch {
    return { remote: false };
  }
}
