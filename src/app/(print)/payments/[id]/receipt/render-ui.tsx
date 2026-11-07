'use client';

import { useParams } from 'next/navigation';
import { ReceiptController } from './ReceiptController';

/** Client boundary: reads the route id only. */
export function RenderUi() {
  const params = useParams<{ id: string }>();
  return <ReceiptController paymentId={Number(params.id)} />;
}
