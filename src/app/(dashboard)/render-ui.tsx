'use client';

import { useAuth } from '@/src/core/auth';
import { UserRole } from '@/src/core/api';
import { InstitutesController } from './institutes';
import { DashboardController } from './dashboard';

/**
 * RenderUi for Dashboard Home Page
 *
 * Client Component boundary orchestrating the appropriate Controller by role.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic per Section 9 & 12 of role.md.
 */
export function RenderUi() {
  const { user } = useAuth();

  const isSuperAdmin =
    user?.role === UserRole.SUPER_ADMIN || user?.role === 'SUPER_ADMIN';

  if (isSuperAdmin) {
    return <InstitutesController />;
  }

  return <DashboardController />;
}
