import type {
  Contract,
  ContractPayment,
  ContractPreview,
  CurrencySummary,
  Currency,
  PaymentMethod,
} from '@/src/core/api';

/** Enrollment a contract can be attached to (from the student row). */
export interface FinanceEnrollment {
  id: number;
  sectionName: string;
  yearName: string;
  status: string;
}

export interface FinanceStudent {
  id: number;
  fullName: string;
  enrollments: FinanceEnrollment[];
}

/** Contract form, kept as strings (inputs). Empty amount/currency = section fee. */
export interface ContractForm {
  grossAmount: string;
  currency: Currency | null;
  discountAmount: string;
  discountReason: string;
  firstPaymentAmount: string;
  numberOfInstallments: string;
  startDate: string;
}

export interface PaymentForm {
  amount: string;
  currency: Currency;
  exchangeRate: string;
  paymentMethod: PaymentMethod;
  note: string;
}

export type FinanceModal = 'contract' | 'editContract' | 'payment' | 'cancelPayment' | null;

/**
 * StudentFinanceState
 *
 * The "المالية" drawer of one student: summary per currency, contracts with
 * installments and payments, and the four modals (create / edit contract,
 * record / cancel payment). role.md §3: isolated store per student.
 */
export interface StudentFinanceState {
  student: FinanceStudent;
  /** fees.manage: contract / payment actions are shown (role.md §8.6). */
  canManage: boolean;
  contracts: Contract[];
  summary: CurrencySummary[];
  isLoading: boolean;

  modal: FinanceModal;
  enrollmentId: number | null;
  contract: Contract | null;
  payment: ContractPayment | null;
  contractForm: ContractForm;
  preview: ContractPreview | null;
  isPreviewing: boolean;
  paymentForm: PaymentForm;
  cancelReason: string;
  error: string | null;
  isSubmitting: boolean;

  openContractForm: (enrollmentId: number) => void;
  openEditContract: (contract: Contract) => void;
  openPayment: (contract: Contract) => void;
  openCancelPayment: (contract: Contract, payment: ContractPayment) => void;
  closeModal: () => void;
  setContractField: <K extends keyof ContractForm>(key: K, value: ContractForm[K]) => void;
  setPaymentField: <K extends keyof PaymentForm>(key: K, value: PaymentForm[K]) => void;
  setCancelReason: (reason: string) => void;
  setPreview: (preview: ContractPreview | null, isPreviewing: boolean) => void;
  setError: (error: string | null) => void;
  setIsSubmitting: (value: boolean) => void;
  syncFinance: (contracts: Contract[], summary: CurrencySummary[], isLoading: boolean) => void;
}
