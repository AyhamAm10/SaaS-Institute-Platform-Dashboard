'use client';

import { ExamsController } from './ExamsController';

/** Client boundary only: ZERO state, ZERO effects, ZERO business logic. */
export function RenderUi() {
  return <ExamsController />;
}
