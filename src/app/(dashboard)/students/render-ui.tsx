'use client';

import { StudentsController } from './StudentsController';

/**
 * RenderUi for Students Page
 *
 * Client Component boundary orchestrating StudentsController.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic per Section 9 & 12 of role.md.
 */
export function RenderUi() {
  return <StudentsController />;
}
