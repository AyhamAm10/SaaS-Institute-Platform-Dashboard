'use client';

import { OverdueController } from './OverdueController';

/** Client boundary only: ZERO state, ZERO effects, ZERO business logic. */
export function RenderUi() {
  return <OverdueController />;
}
