'use client';

import { ReportsCenterController } from './ReportsCenterController';

/** Client boundary only: ZERO state, ZERO effects, ZERO business logic. */
export function RenderUi() {
  return <ReportsCenterController />;
}
