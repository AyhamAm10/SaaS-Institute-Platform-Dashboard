'use client';

import { useAuth, PERMISSIONS, ROLE_LABELS } from '@/src/core/auth';
import { UserRole } from '@/src/core/api';
import { defaultNavigationConfig } from '@/src/components/controllers/sidebar/init/navigation';
import { filterNavigation } from '@/src/components/controllers/sidebar/utils/nav.utils';
import { InstitutesController } from '../institutes';
import { DashboardController } from './DashboardController';
import { DashboardWelcome } from './ui/DashboardWelcome';

/**
 * HomeController
 *
 * Home page of the role: institutes for the super admin, the statistics
 * dashboard for roles allowed to see it (dashboard.view), and a welcome
 * page with shortcuts for the others (e.g. teachers).
 */
export function HomeController() {
  const { user, can } = useAuth();

  if (user?.role === UserRole.SUPER_ADMIN) {
    return <InstitutesController />;
  }
  if (can(PERMISSIONS.dashboardView)) {
    return <DashboardController />;
  }
  return (
    <DashboardWelcome
      fullName={user?.fullName ?? ''}
      roleLabel={ROLE_LABELS[user?.role ?? ''] ?? ''}
      items={filterNavigation(defaultNavigationConfig, can)}
    />
  );
}
