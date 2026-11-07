'use client';

import { PaymentsController } from './PaymentsController';

/** Client boundary only: ZERO state, ZERO effects, ZERO business logic. */
export function RenderUi() {
  return <PaymentsController />;
}
