'use client';

import { SuperAdminGuard } from '@/src/core/auth';
import { InstitutesController } from './InstitutesController';

/**
 * RenderUi for Institutes Page
 *
 * Client Component boundary orchestrating the InstitutesController
 * guarded by SuperAdminGuard.
 * Contains ZERO useState, ZERO useEffect, and ZERO business logic.
 */
export function RenderUi() {
  return (
    <SuperAdminGuard>
      <InstitutesController />
    </SuperAdminGuard>
  );
}
