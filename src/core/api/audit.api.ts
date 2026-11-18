import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from './client';

/** Audit viewer (سجل التدقيق): who changed or deleted what, admins only. Read-only. */

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface AuditFieldChange {
  field: string;
  before: string;
  after: string;
}

export interface AuditEntry {
  id: number;
  createdAt: string;
  userId: number | null;
  userName: string | null;
  /** Model name written by the audited repositories (e.g. `student`). */
  entity: string;
  entityId: number;
  action: AuditAction;
  /** A name / title found in the record, to recognise it. */
  label: string | null;
  changes: AuditFieldChange[];
}

export interface AuditQuery {
  page?: number;
  limit?: number;
  /** Local dates `YYYY-MM-DD`, inclusive. */
  from?: string;
  to?: string;
  entity?: string;
  action?: AuditAction;
  userId?: number;
}

export interface PaginatedAudit {
  data: AuditEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAuditLogQuery(params: AuditQuery) {
  return useQuery({
    queryKey: ['audit-log', params] as const,
    queryFn: async () => (await apiClient.get<PaginatedAudit>('/audit-log', { params })).data,
    placeholderData: keepPreviousData,
  });
}
