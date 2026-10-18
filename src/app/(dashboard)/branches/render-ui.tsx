'use client';

import { BranchesController } from './BranchesController';

/**
 * RenderUi for Branches Page
 *
 * Client Component boundary orchestrating BranchesController.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic per Section 9 & 12 of role.md.
 */
export function RenderUi() {
  return <BranchesController />;
}
