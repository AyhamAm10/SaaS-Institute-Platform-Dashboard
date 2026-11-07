'use client';

import { useParams } from 'next/navigation';
import { VerifyController } from './VerifyController';

/** Client boundary: reads the route token only. */
export function RenderUi() {
  const { token } = useParams<{ token: string }>();
  return <VerifyController token={decodeURIComponent(token)} />;
}
