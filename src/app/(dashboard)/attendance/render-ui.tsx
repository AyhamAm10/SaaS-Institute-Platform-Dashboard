'use client';

import { AttendanceController } from './AttendanceController';

/** Client boundary only: ZERO state, ZERO effects, ZERO business logic. */
export function RenderUi() {
  return <AttendanceController />;
}
