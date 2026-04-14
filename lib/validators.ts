export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeWordPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as Record<string, unknown>;

  if (!isNonEmptyString(data.word)) {
    return null;
  }

  return {
    word: data.word.trim(),
    meaning: typeof data.meaning === "string" ? data.meaning.trim() : null,
    notes: typeof data.notes === "string" ? data.notes.trim() : ""
  };
}
