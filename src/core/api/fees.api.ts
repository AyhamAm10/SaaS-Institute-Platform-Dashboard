import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { PaginatedResponse } from './types';

/**
 * Student fees (E10): contracts, installments, payments and receipts.
 * Money fields come from the server as Decimal strings; use `toAmount()`.
 */

export type Currency = 'SYP' | 'USD';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'OTHER';
export type PaymentStatus = 'ACTIVE' | 'CANCELLED';
export type InstallmentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type ContractStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
type Money = string | number;

export const toAmount = (value: Money | null | undefined): number => Number(value ?? 0);

export interface Installment {
  id: number;
  installmentNumber: number;
  amount: Money;
  paidAmount: Money;
  dueDate: string;
  status: InstallmentStatus;
}

export interface ContractPayment {
  id: number;
  receiptNumber: number;
  amount: Money;
  currency: Currency;
  exchangeRate: Money | null;
  appliedAmount: Money;
  paidAt: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  cancelReason: string | null;
  note: string | null;
  allocations: { installmentId: number; amount: Money }[];
}

export interface Contract {
  id: number;
  studentId: number;
  enrollmentId: number;
  currency: Currency;
  grossAmount: Money;
  discountAmount: Money;
  discountReason: string | null;
  totalAmount: Money;
  firstPaymentAmount: Money | null;
  numberOfInstallments: number;
  startDate: string;
  status: ContractStatus;
  section: { id: number; name: string };
  academicYear: { id: number; name: string };
  installments: Installment[];
  payments: ContractPayment[];
}

export interface ContractPayload {
  grossAmount?: number;
  currency?: Currency;
  discountAmount?: number;
  discountReason?: string;
  firstPaymentAmount?: number;
  numberOfInstallments: number;
  startDate?: string;
}

export interface ContractPreview {
  currency: Currency;
  grossAmount: number;
  discountAmount: number;
  totalAmount: number;
  firstPaymentAmount: number;
  numberOfInstallments: number;
  startDate: string;
  installments: { installmentNumber: number; amount: number; dueDate: string }[];
}

export interface UpdateContractPayload {
  discountAmount?: number;
  discountReason?: string;
  numberOfInstallments?: number;
  startDate?: string;
}

export interface PaymentPayload {
  amount: number;
  currency?: Currency;
  exchangeRate?: number;
  paymentMethod?: PaymentMethod;
  paidAt?: string;
  note?: string;
}

/** Payment as listed / printed (with student, contract and allocations). */
export interface PaymentRecord extends Omit<ContractPayment, 'allocations'> {
  branch: { id: number; name: string };
  academicYear: { id: number; name: string };
  subscription: {
    id: number;
    currency: Currency;
    totalAmount: Money;
    student: {
      id: number;
      fullName: string;
      family: { familyName: string; phone: string | null } | null;
    };
    section: { id: number; name: string };
  };
  allocations: {
    amount: Money;
    installment: { id: number; installmentNumber: number; dueDate: string };
  }[];
}

export interface PaymentsQuery {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  currency?: Currency;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
  receiptNumber?: number;
  studentId?: number;
  search?: string;
}

export interface OverdueInstallment extends Installment {
  subscription: {
    id: number;
    currency: Currency;
    student: {
      id: number;
      fullName: string;
      family: { familyName: string; phone: string | null } | null;
    };
    section: { id: number; name: string };
  };
}

export interface OverdueQuery {
  page?: number;
  limit?: number;
  currency?: Currency;
  sectionId?: number;
  search?: string;
}

export interface CurrencySummary {
  currency: Currency;
  total: number;
  paid: number;
  remaining: number;
  overdue: number;
}

// ── API functions ───────────────────────────────────────────────────────────

const get = async <T>(url: string, params?: object) => (await apiClient.get<T>(url, { params })).data;

export const getStudentContracts = (studentId: number) =>
  get<Contract[]>(`/students/${studentId}/contracts`);
export const getStudentFinancialSummary = (studentId: number) =>
  get<CurrencySummary[]>(`/students/${studentId}/financial-summary`);
export const getPayments = (params: PaymentsQuery) =>
  get<PaginatedResponse<PaymentRecord>>('/payments', params);
export const getPayment = (id: number) => get<PaymentRecord>(`/payments/${id}`);
export const getOverdueInstallments = (params: OverdueQuery) =>
  get<PaginatedResponse<OverdueInstallment>>('/installments/overdue', params);
/** Branch / year come from the header context (role.md §3). */
export const getOverdueSummary = () => get<OverdueAgingItem[]>('/fees/overdue/summary');

export interface OverdueAgingItem {
  currency: Currency;
  bucket: '1-30' | '31-60' | '61-90' | '90+';
  count: number;
  amount: number;
}

export async function previewContract(enrollmentId: number, payload: ContractPayload) {
  const { data } = await apiClient.post<ContractPreview>(
    `/enrollments/${enrollmentId}/contract/preview`,
    payload,
  );
  return data;
}

export async function createContract(enrollmentId: number, payload: ContractPayload) {
  const { data } = await apiClient.post<Contract>(`/enrollments/${enrollmentId}/contract`, payload);
  return data;
}

export async function updateContract(id: number, payload: UpdateContractPayload) {
  const { data } = await apiClient.patch<Contract>(`/contracts/${id}`, payload);
  return data;
}

export async function createPayment(contractId: number, payload: PaymentPayload) {
  const { data } = await apiClient.post<PaymentRecord>(`/contracts/${contractId}/payments`, payload);
  return data;
}

export async function cancelPayment(id: number, reason: string) {
  const { data } = await apiClient.patch<PaymentRecord>(`/payments/${id}/cancel`, { reason });
  return data;
}

// ── React Query hooks ───────────────────────────────────────────────────────

export const feesKeys = {
  all: ['fees'] as const,
  contracts: (studentId: number) => [...feesKeys.all, 'contracts', studentId] as const,
  summary: (studentId: number) => [...feesKeys.all, 'summary', studentId] as const,
  payments: (params: PaymentsQuery) => [...feesKeys.all, 'payments', params] as const,
  payment: (id: number) => [...feesKeys.all, 'payment', id] as const,
  overdue: (params: OverdueQuery) => [...feesKeys.all, 'overdue', params] as const,
};

export function useStudentContractsQuery(studentId: number) {
  return useQuery({
    queryKey: feesKeys.contracts(studentId),
    queryFn: () => getStudentContracts(studentId),
    enabled: studentId > 0,
  });
}

export function useStudentFinancialSummaryQuery(studentId: number) {
  return useQuery({
    queryKey: feesKeys.summary(studentId),
    queryFn: () => getStudentFinancialSummary(studentId),
    enabled: studentId > 0,
  });
}

export function usePaymentsQuery(params: PaymentsQuery) {
  return useQuery({
    queryKey: feesKeys.payments(params),
    queryFn: () => getPayments(params),
    placeholderData: keepPreviousData,
  });
}

export function usePaymentQuery(id: number) {
  return useQuery({ queryKey: feesKeys.payment(id), queryFn: () => getPayment(id), enabled: id > 0 });
}

export function useOverdueInstallmentsQuery(params: OverdueQuery) {
  return useQuery({
    queryKey: feesKeys.overdue(params),
    queryFn: () => getOverdueInstallments(params),
    placeholderData: keepPreviousData,
  });
}

export function useOverdueSummaryQuery() {
  return useQuery({
    queryKey: ['fees', 'overdue', 'summary'],
    queryFn: getOverdueSummary,
    staleTime: 60_000,
  });
}

/** Any fee mutation can change contracts, summaries, payments and overdue lists. */
function useFeesMutation<TVars, TData>(fn: (vars: TVars) => Promise<TData>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feesKeys.all }),
  });
}

export const useCreateContractMutation = () =>
  useFeesMutation(({ enrollmentId, payload }: { enrollmentId: number; payload: ContractPayload }) =>
    createContract(enrollmentId, payload),
  );

export const useUpdateContractMutation = () =>
  useFeesMutation(({ id, payload }: { id: number; payload: UpdateContractPayload }) =>
    updateContract(id, payload),
  );

export const useCreatePaymentMutation = () =>
  useFeesMutation(({ contractId, payload }: { contractId: number; payload: PaymentPayload }) =>
    createPayment(contractId, payload),
  );

export const useCancelPaymentMutation = () =>
  useFeesMutation(({ id, reason }: { id: number; reason: string }) => cancelPayment(id, reason));
