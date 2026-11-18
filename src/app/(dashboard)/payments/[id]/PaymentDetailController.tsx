'use client';

import { Center, Loader, Text } from '@mantine/core';
import { IconReceipt } from '@tabler/icons-react';
import { AppButton, StatusBadge } from '@/src/components/controllers';
import { DetailPage } from '@/src/components/controllers/detail-page';
import { type PaymentRecord, usePaymentQuery } from '@/src/core/api';
import { paymentDetailLabels as labels } from './static-data/payment-detail.data';
import { PaymentDetailBody } from './ui/PaymentDetailBody';

/**
 * PaymentDetailController
 *
 * One payment: who paid, how much, which installments it covered and its
 * receipt. Cancelling stays on the student's finance tab (it needs the
 * contract context), reachable from the student link.
 */
export function PaymentDetailController({ paymentId }: { paymentId: number }) {
  const { data, isLoading } = usePaymentQuery(paymentId);
  const payment = data as PaymentRecord | undefined;

  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (!payment)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.notFound}
      </Text>
    );

  const cancelled = payment.status === 'CANCELLED';
  return (
    <DetailPage
      icon={<IconReceipt size={22} />}
      title={`${labels.receipt} #${payment.receiptNumber}`}
      description={payment.subscription.student.fullName}
      badge={
        <StatusBadge tone={cancelled ? 'danger' : 'success'} size="sm">
          {cancelled ? labels.cancelled : labels.active}
        </StatusBadge>
      }
      breadcrumbs={[{ label: labels.list, href: '/payments' }, { label: `#${payment.receiptNumber}` }]}
      actions={
        <>
          <AppButton variant="outline" href={`/students/${payment.subscription.student.id}?tab=finance`}>
            {labels.openFinance}
          </AppButton>
          <AppButton href={`/payments/${payment.id}/receipt`}>{labels.printReceipt}</AppButton>
        </>
      }
    >
      <PaymentDetailBody payment={payment} />
    </DetailPage>
  );
}
