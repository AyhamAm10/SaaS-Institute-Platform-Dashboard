import { NUMBER_LOCALE } from '@/src/theme/typography';

/**
 * Money display + client-side previews (role.md §10.3 mirrors the server):
 * SYP has no fractions, USD has two decimals; rates are SYP per 1 USD.
 * The server stays the source of truth — previews only explain what it will do.
 */

export type MoneyCurrency = 'SYP' | 'USD';

const SCALE: Record<MoneyCurrency, number> = { SYP: 0, USD: 2 };

export const CURRENCY_LABELS: Record<MoneyCurrency, string> = {
  SYP: 'ل.س',
  USD: '$',
};

export const CURRENCY_OPTIONS = [
  { value: 'SYP', label: 'ليرة سورية (ل.س)' },
  { value: 'USD', label: 'دولار أمريكي ($)' },
];

const formatters: Record<MoneyCurrency, Intl.NumberFormat> = {
  SYP: new Intl.NumberFormat(NUMBER_LOCALE, { maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat(NUMBER_LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

/** "1,500,000 ل.س" / "12.50 $". */
export function formatMoney(value: number | string | null | undefined, currency: MoneyCurrency): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return '—';
  return `${formatters[currency].format(n)} ${CURRENCY_LABELS[currency]}`;
}

export function toMinor(value: number, currency: MoneyCurrency): number {
  return Math.round(value * 10 ** SCALE[currency]);
}

export function fromMinor(minor: number, currency: MoneyCurrency): number {
  return minor / 10 ** SCALE[currency];
}

/** True when the value has no more decimals than the currency allows. */
export function hasValidPrecision(value: number, currency: MoneyCurrency): boolean {
  const minor = value * 10 ** SCALE[currency];
  return Math.abs(minor - Math.round(minor)) < 1e-6;
}

/** Amount paid in `paid` currency, expressed in the contract currency (null without a rate). */
export function convertAmount(
  amount: number,
  paid: MoneyCurrency,
  contract: MoneyCurrency,
  rate: number | null,
): number | null {
  if (paid === contract) return amount;
  if (!rate || rate <= 0) return null;
  const converted = paid === 'USD' ? amount * rate : amount / rate;
  return fromMinor(Math.round(converted * 10 ** SCALE[contract]), contract);
}

export interface AllocationInstallment {
  id: number;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  paid: number;
}

/**
 * FIFO split of a payment over installments (oldest due date first).
 * Returns null when the payment is larger than what is still owed.
 */
export function previewAllocation(
  installments: AllocationInstallment[],
  applied: number,
  currency: MoneyCurrency,
): { installmentNumber: number; amount: number }[] | null {
  const ordered = [...installments].sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate) || a.installmentNumber - b.installmentNumber,
  );
  let left = toMinor(applied, currency);
  const owed = ordered.reduce(
    (s, i) => s + Math.max(0, toMinor(i.amount, currency) - toMinor(i.paid, currency)),
    0,
  );
  if (left > owed) return null;

  const result: { installmentNumber: number; amount: number }[] = [];
  for (const inst of ordered) {
    if (left <= 0) break;
    const open = toMinor(inst.amount, currency) - toMinor(inst.paid, currency);
    if (open <= 0) continue;
    const take = Math.min(open, left);
    result.push({ installmentNumber: inst.installmentNumber, amount: fromMinor(take, currency) });
    left -= take;
  }
  return result;
}
