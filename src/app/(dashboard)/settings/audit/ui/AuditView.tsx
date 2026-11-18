import { useMemo } from 'react';
import { Group } from '@mantine/core';
import { IconHistory } from '@tabler/icons-react';
import { AppDatePicker, AppSelect } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import type { AuditAction, AuditEntry, PaginatedAudit } from '@/src/core/api';
import { AUDIT_ACTION_OPTIONS, AUDIT_ENTITY_OPTIONS, auditLabels as labels } from '../static-data/audit.data';
import { getAuditColumns } from './AuditColumns';

export interface AuditFilters {
  entity: string | null;
  action: AuditAction | null;
  from: string | null;
  to: string | null;
}

interface Props {
  result: PaginatedAudit | undefined;
  isLoading: boolean;
  filters: AuditFilters;
  timeZone?: string;
  onFilter: (patch: Partial<AuditFilters>) => void;
  onPage: (page: number) => void;
}

/** Audit table with its filters (record type, operation, period). Props only. */
export function AuditView({ result, isLoading, filters, timeZone, onFilter, onPage }: Props) {
  const columns = useMemo(() => getAuditColumns(timeZone), [timeZone]);
  return (
    <DataModuleController
      title={labels.title}
      description={labels.description}
      data={result?.data ?? []}
      columns={columns}
      total={result?.total ?? 0}
      page={result?.page ?? 1}
      limit={result?.limit ?? 20}
      totalPages={result?.totalPages ?? 1}
      isLoading={isLoading}
      emptyMessage={labels.empty}
      keyExtractor={(e: AuditEntry) => e.id}
      onPageChange={onPage}
    >
      <DataModuleController.Header>
        <DataModuleController.Title icon={<IconHistory size={20} />} badgeLabel="عملية" />
      </DataModuleController.Header>
      <DataModuleController.FilterBar>
        <DataModuleController.FilterSlot>
          <Group gap="xs" wrap="wrap">
            <AppSelect
              placeholder={labels.entityFilter}
              data={AUDIT_ENTITY_OPTIONS}
              value={filters.entity}
              onChange={(v: string | null) => onFilter({ entity: v })}
              clearable
              searchable
              size="sm"
              w={170}
            />
            <AppSelect
              placeholder={labels.actionFilter}
              data={AUDIT_ACTION_OPTIONS}
              value={filters.action}
              onChange={(v: string | null) => onFilter({ action: v as AuditAction | null })}
              clearable
              size="sm"
              w={140}
            />
            <AppDatePicker placeholder={labels.from} value={filters.from} onChange={(v) => onFilter({ from: v })} clearable size="sm" w={150} />
            <AppDatePicker placeholder={labels.to} value={filters.to} onChange={(v) => onFilter({ to: v })} clearable size="sm" w={150} />
          </Group>
        </DataModuleController.FilterSlot>
      </DataModuleController.FilterBar>
      <DataModuleController.Content>
        <DataModuleController.Table />
      </DataModuleController.Content>
      <DataModuleController.Footer />
    </DataModuleController>
  );
}
