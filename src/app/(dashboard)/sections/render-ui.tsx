'use client';

import { SectionsController } from './SectionsController';

/**
 * RenderUi for Sections Page
 *
 * Client Component boundary orchestrating the SectionsController.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic.
 */
export function RenderUi() {
  return <SectionsController />;
}
