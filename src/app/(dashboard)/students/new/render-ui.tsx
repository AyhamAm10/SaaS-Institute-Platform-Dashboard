'use client';

import { StudentRegistrationController } from './StudentRegistrationController';

/**
 * RenderUi for Student Registration Page
 *
 * Client Component boundary orchestrating StudentRegistrationController.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic per Section 9 & 12 of role.md.
 */
export function RenderUi() {
  return <StudentRegistrationController />;
}
