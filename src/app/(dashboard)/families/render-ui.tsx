'use client';

import { FamiliesController } from './FamiliesController';

/**
 * RenderUi for Families Page
 *
 * Client Component boundary orchestrating the FamiliesController.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic.
 */
export function RenderUi() {
  return <FamiliesController />;
}
