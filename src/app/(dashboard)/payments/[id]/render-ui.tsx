'use client';

import { useParams } from 'next/navigation';
import { PaymentDetailController } from './PaymentDetailController';

/** Client boundary: reads the route id only. */
export function RenderUi() {
  const params = useParams<{ id: string }>();
  return <PaymentDetailController key={params.id} paymentId={Number(params.id)} />;
}
