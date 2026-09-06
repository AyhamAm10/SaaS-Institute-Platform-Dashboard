'use client';

import { AcademicYearsController } from './AcademicYearsController';

/**
 * RenderUi for Academic Years Page
 *
 * Client Component boundary orchestrating the AcademicYearsController.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic.
 */
export function RenderUi() {
  return <AcademicYearsController />;
}
