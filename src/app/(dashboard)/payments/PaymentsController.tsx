'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { getApiErrorMessage, useCancelPaymentMutation, usePaymentsQuery } from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { createPaymentsStore, PaymentsContext, PaymentsStore } from './store/payments.store';
import { toPaymentsQuery } from './utils/payments.utils';
import { paymentsLabels as labels } from './static-data/payments.data';
import { PaymentsView } from './ui/PaymentsView';

/** Bridges the filtered payments query into the store. */
function QuerySync({ store }: { store: PaymentsStore }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const filters = useStore(store, (s) => s.filters);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);
  const { data, isLoading } = usePaymentsQuery(toPaymentsQuery(page, limit, search, filters));

  useEffect(() => {
    syncQueryData({
      data: data?.data ?? [],
      total: data?.total ?? 0,
      totalPages: data?.totalPages ?? 1,
      isLoading,
    });
  }, [data, isLoading, syncQueryData]);

  return null;
}

/**
 * PaymentsController
 *
 * Payments page (E10): list with filters, receipt search, print and
 * cancellation (never delete). Owns its isolated store (role.md §3).
 */
export function PaymentsController() {
  const [store] = useState(createPaymentsStore);
  const cancelMutation = useCancelPaymentMutation();
  const canCancel = useAuth().can(PERMISSIONS.feesManage);

  const handleCancel = useCallback(async () => {
    const { cancelTarget, cancelReason, setCancelError, setIsCancelling, closeCancel } = store.getState();
    if (!cancelTarget) return;
    if (!cancelReason.trim()) return setCancelError(labels.cancelReasonRequired);
    setIsCancelling(true);
    try {
      await cancelMutation.mutateAsync({
        id: cancelTarget.id,
        reason: cancelReason.trim(),
      });
      closeCancel();
    } catch (err: unknown) {
      setCancelError(getApiErrorMessage(err, labels.cancelError));
    } finally {
      setIsCancelling(false);
    }
  }, [store, cancelMutation]);

  return (
    <PaymentsContext.Provider value={store}>
      <QuerySync store={store} />
      <PaymentsView onConfirmCancel={handleCancel} canCancel={canCancel} />
    </PaymentsContext.Provider>
  );
}
