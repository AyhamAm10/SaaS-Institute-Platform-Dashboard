'use client';

import { SubjectsController } from './SubjectsController';

/**
 * RenderUi for Subjects Page
 *
 * Client Component boundary orchestrating the SubjectsController.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic.
 */
export function RenderUi() {
  return <SubjectsController />;
}
