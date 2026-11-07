/**
 * Extracts the user-facing message of an API error (the backend returns a
 * localized `message`, or a list of validation messages).
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string | string[] } }; message?: string };
  const message = e?.response?.data?.message || e?.message || fallback;
  return Array.isArray(message) ? message.join('، ') : message;
}
