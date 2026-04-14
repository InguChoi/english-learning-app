export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeWordPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as Record<string, unknown>;

  if (!isNonEmptyString(data.word) || !isNonEmptyString(data.meaning)) {
    return null;
  }

  return {
    word: data.word.trim(),
    meaning: data.meaning.trim(),
    notes: typeof data.notes === "string" ? data.notes.trim() : ""
  };
}
