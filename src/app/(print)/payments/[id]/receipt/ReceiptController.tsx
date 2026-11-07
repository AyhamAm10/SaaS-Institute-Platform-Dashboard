'use client';

import { Center, Loader, Text } from '@mantine/core';
import { usePaymentQuery, useReceiptVerificationQuery } from '@/src/core/api';
import { useQrDataUri } from '@/src/components/controllers/report';
import { useAuth } from '@/src/core/auth';
import { ReceiptView } from './ReceiptView';

/**
 * ReceiptController
 *
 * Printable receipt of one payment (A5), branded with the institute's logo
 * and colors. Not the postponed "export": it prints from the browser.
 */
export function ReceiptController({ paymentId }: { paymentId: number }) {
  const { user } = useAuth();
  const { data: payment, isLoading, isError } = usePaymentQuery(paymentId);
  // Signed document number + QR to the public verification page (D3)
  const { data: verification } = useReceiptVerificationQuery(paymentId);
  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  const qr = useQrDataUri(verification ? `${origin}/verify/${verification.token}` : null);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="sm" />
      </Center>
    );
  }
  if (isError || !payment) {
    return (
      <Center h="100vh">
        <Text>تعذّر تحميل الإيصال</Text>
      </Center>
    );
  }
  return (
    <ReceiptView
      payment={payment}
      institute={user?.institute ?? null}
      verification={verification && qr ? { number: verification.number, qr } : null}
    />
  );
}
