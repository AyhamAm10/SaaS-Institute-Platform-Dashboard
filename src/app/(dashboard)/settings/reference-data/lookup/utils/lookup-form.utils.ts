import type { LookupItem, LookupPayload } from '@/src/core/api';
import { LookupFieldConfig, LookupFormValue } from '../lookup.config';

export type LookupForm = Record<string, LookupFormValue>;

const emptyValue = (field: LookupFieldConfig): LookupFormValue =>
  field.defaultValue !== undefined ? field.defaultValue : field.type === 'switch' ? false : '';

/** Form state of a new entry (field defaults). */
export function emptyLookupForm(fields: LookupFieldConfig[]): LookupForm {
  return Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]));
}

/** Form state of an existing entry. */
export function lookupFormFrom(fields: LookupFieldConfig[], item: LookupItem): LookupForm {
  const row = item as unknown as Record<string, LookupFormValue | undefined>;
  return Object.fromEntries(
    fields.map((f) => [f.name, row[f.name] ?? (f.type === 'text' || f.type === 'tel' ? '' : emptyValue(f))]),
  );
}

/** Required-field validation; returns field → Arabic message. */
export function validateLookupForm(fields: LookupFieldConfig[], form: LookupForm): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = form[field.name];
    if (field.required && (value === null || String(value).trim() === '')) {
      errors[field.name] = `يرجى إدخال ${field.label}`;
    }
  }
  return errors;
}

/** API payload: trims text, empty optional values become null. */
export function toLookupPayload(
  fields: LookupFieldConfig[],
  form: LookupForm,
  isCreate: boolean,
): LookupPayload {
  const payload: LookupPayload = {};
  for (const field of fields) {
    if (field.createOnly && !isCreate) continue;
    const value = form[field.name];
    if (field.type === 'switch') payload[field.name] = Boolean(value);
    else if (field.type === 'number' || field.type === 'select')
      payload[field.name] = value === null || value === '' ? null : Number(value);
    else payload[field.name] = typeof value === 'string' ? value.trim() || null : value;
  }
  return payload;
}
