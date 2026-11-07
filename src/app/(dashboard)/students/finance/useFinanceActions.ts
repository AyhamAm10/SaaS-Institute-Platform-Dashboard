'use client';

import { useCallback } from 'react';
import {
  getApiErrorMessage,
  previewContract,
  useCancelPaymentMutation,
  useCreateContractMutation,
  useCreatePaymentMutation,
  useUpdateContractMutation,
} from '@/src/core/api';
import { StudentFinanceStore } from './store/student-finance.store';
import {
  paymentPreview,
  toContractPayload,
  toPaymentPayload,
  toUpdateContractPayload,
} from './utils/student-finance.utils';
import { financeLabels as labels } from './static-data/student-finance.data';

/**
 * Orchestrates the finance modals (contract preview / create / edit, payment,
 * cancellation). Controller-level hook (role.md §3), never used from ui/.
 */
export function useFinanceActions(store: StudentFinanceStore) {
  const createContract = useCreateContractMutation();
  const updateContract = useUpdateContractMutation();
  const createPayment = useCreatePaymentMutation();
  const cancelPayment = useCancelPaymentMutation();

  /** Runs `fn`, closing the modal on success and showing the server message on failure. */
  const run = useCallback(
    async (fn: () => Promise<unknown>, fallback: string) => {
      const { setError, setIsSubmitting, closeModal } = store.getState();
      setError(null);
      setIsSubmitting(true);
      try {
        await fn();
        closeModal();
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, fallback));
      } finally {
        setIsSubmitting(false);
      }
    },
    [store],
  );

  const preview = useCallback(async () => {
    const { enrollmentId, contractForm, setPreview, setError } = store.getState();
    if (!enrollmentId) return;
    setError(null);
    setPreview(null, true);
    try {
      setPreview(await previewContract(enrollmentId, toContractPayload(contractForm)), false);
    } catch (err: unknown) {
      setPreview(null, false);
      setError(getApiErrorMessage(err, labels.previewError));
    }
  }, [store]);

  const submitContract = useCallback(async () => {
    const { modal, enrollmentId, contract, contractForm } = store.getState();
    if (modal === 'editContract' && contract) {
      await run(
        () => updateContract.mutateAsync({ id: contract.id, payload: toUpdateContractPayload(contractForm) }),
        labels.contractError,
      );
    } else if (enrollmentId) {
      await run(
        () => createContract.mutateAsync({ enrollmentId, payload: toContractPayload(contractForm) }),
        labels.contractError,
      );
    }
  }, [store, run, createContract, updateContract]);

  const submitPayment = useCallback(async () => {
    const { contract, paymentForm, setError } = store.getState();
    if (!contract) return;
    const previewResult = paymentPreview(paymentForm, contract);
    if (!previewResult) return setError(labels.amountRequired);
    if (previewResult.applied === null) return setError(labels.rateRequired);
    if (!previewResult.allocation) return setError(labels.exceedsRemaining);
    await run(
      () => createPayment.mutateAsync({ contractId: contract.id, payload: toPaymentPayload(paymentForm, contract) }),
      labels.paymentError,
    );
  }, [store, run, createPayment]);

  const submitCancel = useCallback(async () => {
    const { payment, cancelReason, setError } = store.getState();
    if (!payment) return;
    if (!cancelReason.trim()) return setError(labels.cancelReasonRequired);
    await run(
      () => cancelPayment.mutateAsync({ id: payment.id, reason: cancelReason.trim() }),
      labels.cancelError,
    );
  }, [store, run, cancelPayment]);

  return { preview, submitContract, submitPayment, submitCancel };
}
