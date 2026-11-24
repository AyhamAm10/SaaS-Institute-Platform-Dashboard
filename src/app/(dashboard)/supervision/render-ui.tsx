'use client';

import { SupervisionController } from './SupervisionController';

/** Client boundary only: ZERO state, ZERO effects, ZERO business logic. */
export function RenderUi() {
  return <SupervisionController />;
}
