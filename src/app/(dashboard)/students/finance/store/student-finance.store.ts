'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { FinanceStudent, StudentFinanceState } from '../state/student-finance.state';
import { editFormFrom, EMPTY_CONTRACT_FORM, emptyPaymentForm } from '../utils/student-finance.utils';

export type StudentFinanceStore = ControllerStoreApi<StudentFinanceState>;

const reset = {
  modal: null,
  enrollmentId: null,
  contract: null,
  payment: null,
  preview: null,
  isPreviewing: false,
  cancelReason: '',
  error: null,
  isSubmitting: false,
};

/** Isolated store of one student's finance drawer (role.md §3). */
export function createStudentFinanceStore(student: FinanceStudent, canManage = true): StudentFinanceStore {
  return createControllerStore<StudentFinanceState>((set) => ({
    student,
    canManage,
    contracts: [],
    summary: [],
    isLoading: true,
    ...reset,
    contractForm: EMPTY_CONTRACT_FORM,
    paymentForm: { amount: '', currency: 'SYP', exchangeRate: '', paymentMethod: 'CASH', note: '' },

    openContractForm: (enrollmentId) =>
      set({ ...reset, modal: 'contract', enrollmentId, contractForm: EMPTY_CONTRACT_FORM }),
    openEditContract: (contract) =>
      set({ ...reset, modal: 'editContract', contract, contractForm: editFormFrom(contract) }),
    openPayment: (contract) =>
      set({ ...reset, modal: 'payment', contract, paymentForm: emptyPaymentForm(contract) }),
    openCancelPayment: (contract, payment) =>
      set({ ...reset, modal: 'cancelPayment', contract, payment }),
    closeModal: () => set(reset),

    setContractField: (key, value) =>
      set((s) => ({ contractForm: { ...s.contractForm, [key]: value }, preview: null, error: null })),
    setPaymentField: (key, value) =>
      set((s) => ({ paymentForm: { ...s.paymentForm, [key]: value }, error: null })),
    setCancelReason: (cancelReason) => set({ cancelReason, error: null }),
    setPreview: (preview, isPreviewing) => set({ preview, isPreviewing }),
    setError: (error) => set({ error }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    syncFinance: (contracts, summary, isLoading) => set({ contracts, summary, isLoading }),
  }));
}

export const StudentFinanceContext = createContext<StudentFinanceStore | null>(null);

export function useStudentFinanceStore(): StudentFinanceStore {
  const store = useContext(StudentFinanceContext);
  if (!store) throw new Error('useStudentFinanceStore must be used within <StudentFinanceController>.');
  return store;
}

/** Strongly typed Mirror hook for StudentFinanceController. */
export function useFinanceMirror<K extends keyof StudentFinanceState>(key: K): StudentFinanceState[K] {
  return useStore(useStudentFinanceStore(), (state) => state[key]);
}
