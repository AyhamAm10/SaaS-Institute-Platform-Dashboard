'use client';

import { HomeController } from './dashboard/HomeController';

/** Client boundary only: ZERO state, ZERO effects, ZERO business logic. */
export function RenderUi() {
  return <HomeController />;
}
