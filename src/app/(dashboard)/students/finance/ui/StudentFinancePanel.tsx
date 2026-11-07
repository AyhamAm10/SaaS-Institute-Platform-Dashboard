'use client';

import { Center, Group, Loader, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconFilePlus, IconReceipt2 } from '@tabler/icons-react';
import { AppButton, AppEmptyState, AppSurface, StatusBadge } from '@/src/components/controllers';
import { formatMoney } from '@/src/core/format';
import { useFinanceMirror } from '../store/student-finance.store';
import { financeLabels as labels } from '../static-data/student-finance.data';
import { ContractCard } from './ContractCard';
import { ContractFormModal } from './ContractFormModal';
import { PaymentModal } from './PaymentModal';
import { CancelPaymentModal } from './CancelPaymentModal';

export interface FinanceActions {
  preview: () => Promise<void>;
  submitContract: () => Promise<void>;
  submitPayment: () => Promise<void>;
  submitCancel: () => Promise<void>;
}

/**
 * StudentFinancePanel
 *
 * Summary per currency, then one block per enrollment: its contract or a
 * "create contract" action, plus the finance modals. Used inside the
 * finance drawer (students list) and the student profile tab.
 * ZERO useState hooks.
 */
export function StudentFinancePanel({ actions }: { actions: FinanceActions }) {
  const student = useFinanceMirror('student');
  const contracts = useFinanceMirror('contracts');
  const summary = useFinanceMirror('summary');
  const isLoading = useFinanceMirror('isLoading');
  const openContractForm = useFinanceMirror('openContractForm');
  const canManage = useFinanceMirror('canManage');

  return (
    <>
    {isLoading ? (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    ) : (
      <Stack gap="lg">
        {summary.map((row) => (
          <SimpleGrid key={row.currency} cols={{ base: 2, sm: 4 }} spacing="xs">
            {[
              [labels.summaryTotal, row.total, 'ink'],
              [labels.summaryPaid, row.paid, 'success'],
              [labels.summaryRemaining, row.remaining, 'brand'],
              [labels.summaryOverdue, row.overdue, row.overdue > 0 ? 'danger' : 'neutral'],
            ].map(([label, value, tone]) => (
              <AppSurface key={String(label)} level={2} radius="md" padding="sm">
                <Text size="xs" c="var(--app-text-muted)">
                  {label}
                </Text>
                <StatusBadge tone={tone as 'ink'} size="md">
                  {formatMoney(Number(value), row.currency)}
                </StatusBadge>
              </AppSurface>
            ))}
          </SimpleGrid>
        ))}

        {student.enrollments.length === 0 && (
          <AppEmptyState compact icon={<IconReceipt2 size={22} />} title={labels.noEnrollments} />
        )}

        {student.enrollments.map((enrollment) => {
          const contract = contracts.find((c) => c.enrollmentId === enrollment.id);
          return contract ? (
            <ContractCard key={enrollment.id} contract={contract} />
          ) : (
            <AppSurface key={enrollment.id} level={2} radius="md" padding="md">
              <Group justify="space-between">
                <Stack gap={2}>
                  <Text size="sm" fw={500}>
                    {enrollment.sectionName} · {enrollment.yearName}
                  </Text>
                  <Text size="xs" c="var(--app-text-muted)">
                    {labels.noContract}
                  </Text>
                </Stack>
                {canManage && enrollment.status === 'ACTIVE' && (
                  <AppButton
                    size="sm"
                    leftSection={<IconFilePlus size={16} />}
                    onClick={() => openContractForm(enrollment.id)}
                  >
                    {labels.createContract}
                  </AppButton>
                )}
              </Group>
            </AppSurface>
          );
        })}
      </Stack>
    )}

    <ContractFormModal onPreview={actions.preview} onSubmit={actions.submitContract} />
    <PaymentModal onSubmit={actions.submitPayment} />
    <CancelPaymentModal onSubmit={actions.submitCancel} />
    </>
  );
}
