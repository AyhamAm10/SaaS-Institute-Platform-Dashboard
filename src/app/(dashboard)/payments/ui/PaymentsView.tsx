'use client';

import { useMemo } from 'react';
import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconReceipt, IconReceiptOff } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppButton, AppInput, AppModal, ReportMenu } from '@/src/components/controllers';
import { type PaymentRecord, toAmount } from '@/src/core/api';
import { formatMoney, inputText } from '@/src/core/format';
import { usePaymentsMirror } from '../store/payments.store';
import { paymentsLabels as labels } from '../static-data/payments.data';
import { getPaymentsColumns } from './PaymentsColumns';
import { PaymentsFilters } from './PaymentsFilters';
import { PaymentsOverview } from './PaymentsOverview';

function CancelModal({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const target = usePaymentsMirror('cancelTarget');
  const reason = usePaymentsMirror('cancelReason');
  const setReason = usePaymentsMirror('setCancelReason');
  const error = usePaymentsMirror('cancelError');
  const isCancelling = usePaymentsMirror('isCancelling');
  const close = usePaymentsMirror('closeCancel');
  if (!target) return null;

  return (
    <AppModal opened onClose={close} size="sm" variant="danger">
      <AppModal.Header>
        <AppModal.Icon icon={<IconReceiptOff size={22} />} color="red" />
        <AppModal.Title>{labels.cancelTitle}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>
      <AppModal.Content>
        <Stack gap="md">
          <Text size="sm" fw={500}>
            #{target.receiptNumber} — {target.subscription.student.fullName} —{' '}
            {formatMoney(toAmount(target.amount), target.currency)}
          </Text>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          <AppInput
            type="textarea"
            label={labels.cancelReason}
            value={reason}
            onChange={(e: unknown) => setReason(inputText(e))}
            required
            rows={2}
          />
          <Text size="xs" c="var(--app-text-muted)">
            {labels.cancelHint}
          </Text>
        </Stack>
      </AppModal.Content>
      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.close}</AppModal.Cancel>
          <AppButton variant="dangerSolid" onClick={onConfirm} loading={isCancelling}>
            {labels.confirmCancel}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}

export function PaymentsView({
  onConfirmCancel,
  canCancel,
}: {
  onConfirmCancel: () => Promise<void>;
  canCancel: boolean;
}) {
  const data = usePaymentsMirror('data');
  const total = usePaymentsMirror('total');
  const page = usePaymentsMirror('page');
  const limit = usePaymentsMirror('limit');
  const totalPages = usePaymentsMirror('totalPages');
  const isLoading = usePaymentsMirror('isLoading');
  const setPage = usePaymentsMirror('setPage');
  const setSearch = usePaymentsMirror('setSearch');
  const openCancel = usePaymentsMirror('openCancel');
  const columns = useMemo(() => getPaymentsColumns(openCancel, canCancel), [openCancel, canCancel]);

  return (
    <AppModule exportTitle="الدفعات والإيصالات">
      <PaymentsOverview />

      <AppModule.Table>
        <DataModuleController
          selectable
          title={labels.title}
          description={labels.description}
          data={data}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          emptyMessage={labels.emptyMessage}
          emptyDescription={labels.emptyDescription}
          searchPlaceholder={labels.searchPlaceholder}
          keyExtractor={(item: PaymentRecord) => item.id}
          onPageChange={setPage}
          onSearchChange={setSearch}
        >
          <DataModuleController.Header>
            <DataModuleController.Title icon={<IconReceipt size={20} />} badgeLabel="دفعة" />
            <DataModuleController.Actions>
              <ReportMenu
                keys={['daily-cashbox', 'payments-register', 'monthly-collection', 'discounts', 'cancelled-payments']}
                params={{}}
              />
            </DataModuleController.Actions>
          </DataModuleController.Header>
          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder={labels.searchPlaceholder} />
            <DataModuleController.FilterSlot>
              <PaymentsFilters />
            </DataModuleController.FilterSlot>
          </DataModuleController.FilterBar>
          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>
          <DataModuleController.Footer />
        </DataModuleController>
      </AppModule.Table>

      <CancelModal onConfirm={onConfirmCancel} />
    </AppModule>
  );
}
