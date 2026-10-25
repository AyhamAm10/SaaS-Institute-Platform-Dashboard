'use client';

import { TeacherRegistrationController } from './TeacherRegistrationController';

/**
 * RenderUi for Teacher Registration Page
 *
 * Client Component boundary orchestrating TeacherRegistrationController.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic per Section 9 & 12 of role.md.
 */
export function RenderUi() {
  return <TeacherRegistrationController />;
}
