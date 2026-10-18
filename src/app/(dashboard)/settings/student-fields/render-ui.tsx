'use client';

import { StudentFieldsController } from './StudentFieldsController';

/**
 * RenderUi for Student Custom Fields Settings Page
 *
 * Client Component boundary orchestrating StudentFieldsController.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic per Section 9 & 12 of role.md.
 */
export function RenderUi() {
  return <StudentFieldsController />;
}
