'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { PaymentFilters, PaymentsState } from '../state/payments.state';

export type PaymentsStore = ControllerStoreApi<PaymentsState>;

export const EMPTY_PAYMENT_FILTERS: PaymentFilters = {
  from: null,
  to: null,
  currency: null,
  paymentMethod: null,
  status: null,
  receiptNumber: '',
};

/** Isolated store of the payments page (role.md §3). */
export function createPaymentsStore(): PaymentsStore {
  return createControllerStore<PaymentsState>((set) => ({
    page: 1,
    limit: 10,
    search: '',
    filters: EMPTY_PAYMENT_FILTERS,
    data: [],
    total: 0,
    totalPages: 1,
    isLoading: true,

    cancelTarget: null,
    cancelReason: '',
    cancelError: null,
    isCancelling: false,

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value }, page: 1 })),
    openCancel: (cancelTarget) => set({ cancelTarget, cancelReason: '', cancelError: null }),
    closeCancel: () => set({ cancelTarget: null }),
    setCancelReason: (cancelReason) => set({ cancelReason, cancelError: null }),
    setCancelError: (cancelError) => set({ cancelError }),
    setIsCancelling: (isCancelling) => set({ isCancelling }),
    syncQueryData: (payload) => set(payload),
  }));
}

export const PaymentsContext = createContext<PaymentsStore | null>(null);

export function usePaymentsStore(): PaymentsStore {
  const store = useContext(PaymentsContext);
  if (!store) throw new Error('usePaymentsStore must be used within <PaymentsController>.');
  return store;
}

/** Strongly typed Mirror hook for PaymentsController. */
export function usePaymentsMirror<K extends keyof PaymentsState>(key: K): PaymentsState[K] {
  return useStore(usePaymentsStore(), (state) => state[key]);
}
