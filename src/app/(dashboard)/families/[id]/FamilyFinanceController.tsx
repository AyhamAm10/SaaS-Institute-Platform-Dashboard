'use client';

import { useState } from 'react';
import { Alert } from '@mantine/core';
import { IconCash } from '@tabler/icons-react';
import { AppButton } from '@/src/components/controllers';
import { getApiErrorMessage, useCreateFamilyPaymentMutation, useFamilyFinancialSummaryQuery } from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { familyDetailLabels as labels } from './static-data/family-detail.data';
import { FamilyFinanceTab } from './ui/FamilyFinanceTab';
import { type FamilyPaymentValues, FamilyPaymentModal } from './ui/FamilyPaymentModal';

const EMPTY: FamilyPaymentValues = { amounts: {}, method: 'CASH', note: '' };

/**
 * Finance tab of the family page: totals and children, plus one payment for
 * several children at once (needs fees.manage). Each child's amount becomes
 * its own payment and receipt; the server saves all or none.
 */
export function FamilyFinanceController({ familyId }: { familyId: number }) {
  const { can } = useAuth();
  const { data, isLoading } = useFamilyFinancialSummaryQuery(familyId);
  const pay = useCreateFamilyPaymentMutation(familyId);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FamilyPaymentValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const contracts = data?.openContracts ?? [];
  const show = () => {
    setValues(EMPTY);
    setError(null);
    setDone(null);
    setOpen(true);
  };

  const submit = async () => {
    const lines = contracts
      .map((c) => ({ contract: c, amount: Number(values.amounts[c.contractId] ?? 0) }))
      .filter((l) => l.amount !== 0);
    if (lines.length === 0) return setError(labels.enterAmount);
    if (lines.some((l) => !(l.amount > 0) || l.amount > l.contract.remaining)) return setError(labels.amountInvalid);
    setError(null);
    try {
      const receipts = await pay.mutateAsync({
        payments: lines.map((l) => ({ contractId: l.contract.contractId, amount: l.amount })),
        paymentMethod: values.method,
        note: values.note.trim() || undefined,
      });
      setOpen(false);
      setDone(labels.paidDone(receipts.length));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, labels.payError));
    }
  };

  return (
    <>
      {done && (
        <Alert color="green" variant="light" radius="md" mb="sm">
          {done}
        </Alert>
      )}
      {can(PERMISSIONS.feesManage) && contracts.length > 0 && (
        <AppButton leftSection={<IconCash size={16} />} onClick={show} mb="md">
          {labels.payAction}
        </AppButton>
      )}
      <FamilyFinanceTab summary={data ?? null} isLoading={isLoading} />
      <FamilyPaymentModal
        opened={open}
        contracts={contracts}
        values={values}
        error={error}
        isSubmitting={pay.isPending}
        onChange={(patch) => setValues((v) => ({ ...v, ...patch }))}
        onAmount={(id, value) => setValues((v) => ({ ...v, amounts: { ...v.amounts, [id]: value } }))}
        onClose={() => setOpen(false)}
        onSubmit={submit}
      />
    </>
  );
}
