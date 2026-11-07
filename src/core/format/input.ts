/** AppInput text change → string (the input may send a value or an event). */
export function inputText(e: unknown): string {
  if (typeof e === 'string') return e;
  if (typeof e === 'number') return Number.isFinite(e) ? String(e) : '';
  const target = (e as { target?: { value?: unknown } } | null)?.target;
  return typeof target?.value === 'string' ? target.value : '';
}
