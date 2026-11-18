'use client';

import { useState } from 'react';
import { useAuditLogQuery } from '@/src/core/api';
import { useAuth } from '@/src/core/auth';
import { type AuditFilters, AuditView } from './ui/AuditView';

const EMPTY: AuditFilters = { entity: null, action: null, from: null, to: null };

/**
 * AuditController
 *
 * Audit viewer tab of the settings (admins only, `staff.view`): filtered,
 * paged list of the updates and deletes recorded by the audited repositories.
 * The query and the filters live here; the view only renders them.
 */
export function AuditController() {
  const [filters, setFilters] = useState<AuditFilters>(EMPTY);
  const [page, setPage] = useState(1);
  const timeZone = useAuth().user?.institute?.timezone ?? undefined;
  const { data, isLoading } = useAuditLogQuery({
    page,
    limit: 20,
    entity: filters.entity ?? undefined,
    action: filters.action ?? undefined,
    from: filters.from ?? undefined,
    to: filters.to ?? undefined,
  });

  return (
    <AuditView
      result={data}
      isLoading={isLoading}
      filters={filters}
      timeZone={timeZone}
      onFilter={(patch) => {
        setFilters((f) => ({ ...f, ...patch }));
        setPage(1);
      }}
      onPage={setPage}
    />
  );
}
