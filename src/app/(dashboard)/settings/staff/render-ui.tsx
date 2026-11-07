'use client';

import { StaffController } from './StaffController';

/** Client boundary only: ZERO state, ZERO effects, ZERO business logic. */
export function RenderUi() {
  return <StaffController />;
}
