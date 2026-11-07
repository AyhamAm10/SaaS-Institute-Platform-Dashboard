'use client';

import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { ReferenceDataView } from './ui/ReferenceDataView';

/**
 * ReferenceDataController
 *
 * Page controller of the reference tables. It owns no state of its own:
 * each tab mounts an isolated LookupController (lazy, via AppTabs.Panel).
 */
export function ReferenceDataController() {
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.settingsManage);
  return <ReferenceDataView canManage={canManage} />;
}
