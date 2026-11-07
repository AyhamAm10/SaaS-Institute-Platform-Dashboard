import {
  type Contract,
  type ContractPayload,
  type PaymentPayload,
  type Student,
  type UpdateContractPayload,
  toAmount,
} from '@/src/core/api';
import { convertAmount, previewAllocation } from '@/src/core/format';
import type { ContractForm, FinanceStudent, PaymentForm } from '../state/student-finance.state';

export const EMPTY_CONTRACT_FORM: ContractForm = {
  grossAmount: '',
  currency: null,
  discountAmount: '',
  discountReason: '',
  firstPaymentAmount: '',
  numberOfInstallments: '9',
  startDate: '',
};

const num = (value: string): number | undefined => {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : Number(trimmed);
};

/** Student row → the data the finance drawer needs. */
export function financeStudentFrom(student: Student): FinanceStudent {
  return {
    id: student.id,
    fullName: student.fullName,
    enrollments: (student.studentEnrollments ?? []).map((e) => ({
      id: e.id,
      sectionName: e.section?.name ?? '—',
      yearName: e.academicYear?.name ?? '—',
      status: e.status,
    })),
  };
}

/** Contract form → API payload (empty fields fall back to the section fee). */
export function toContractPayload(form: ContractForm): ContractPayload {
  return {
    grossAmount: num(form.grossAmount),
    currency: form.currency ?? undefined,
    discountAmount: num(form.discountAmount),
    discountReason: form.discountReason.trim() || undefined,
    firstPaymentAmount: num(form.firstPaymentAmount),
    numberOfInstallments: Number(form.numberOfInstallments) || 1,
    startDate: form.startDate || undefined,
  };
}

/** Edit form of an existing contract (discount + re-spread of unpaid installments). */
export function editFormFrom(contract: Contract): ContractForm {
  const unpaid = contract.installments.filter((i) => toAmount(i.paidAmount) === 0).length;
  return {
    ...EMPTY_CONTRACT_FORM,
    discountAmount: String(toAmount(contract.discountAmount)),
    discountReason: contract.discountReason ?? '',
    numberOfInstallments: String(Math.max(unpaid, 1)),
  };
}

export function toUpdateContractPayload(form: ContractForm): UpdateContractPayload {
  return {
    discountAmount: num(form.discountAmount) ?? 0,
    discountReason: form.discountReason.trim(),
    numberOfInstallments: Number(form.numberOfInstallments) || undefined,
    startDate: form.startDate || undefined,
  };
}

export function emptyPaymentForm(contract: Contract): PaymentForm {
  return { amount: '', currency: contract.currency, exchangeRate: '', paymentMethod: 'CASH', note: '' };
}

export function toPaymentPayload(form: PaymentForm, contract: Contract): PaymentPayload {
  const sameCurrency = form.currency === contract.currency;
  return {
    amount: Number(form.amount),
    currency: form.currency,
    exchangeRate: sameCurrency ? undefined : Number(form.exchangeRate),
    paymentMethod: form.paymentMethod,
    note: form.note.trim() || undefined,
  };
}

/** What is still owed on a contract (contract currency). */
export function contractRemaining(contract: Contract): number {
  return contract.installments.reduce(
    (sum, i) => sum + Math.max(0, toAmount(i.amount) - toAmount(i.paidAmount)),
    0,
  );
}

/**
 * Live preview of a payment: applied amount in the contract currency and
 * its FIFO split. `allocation` is null when it exceeds the remaining balance.
 */
export function paymentPreview(form: PaymentForm, contract: Contract) {
  const amount = Number(form.amount);
  if (!(amount > 0)) return null;
  const rate = Number(form.exchangeRate) || null;
  const applied = convertAmount(amount, form.currency, contract.currency, rate);
  if (applied === null) return { applied: null, allocation: null };
  const allocation = previewAllocation(
    contract.installments.map((i) => ({
      id: i.id,
      installmentNumber: i.installmentNumber,
      dueDate: i.dueDate.slice(0, 10),
      amount: toAmount(i.amount),
      paid: toAmount(i.paidAmount),
    })),
    applied,
    contract.currency,
  );
  return { applied, allocation };
}
