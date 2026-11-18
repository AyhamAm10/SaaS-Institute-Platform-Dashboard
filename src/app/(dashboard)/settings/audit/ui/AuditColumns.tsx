import Link from 'next/link';
import { Stack, Text } from '@mantine/core';
import { StatusBadge } from '@/src/components/controllers';
import type { DataModuleColumn } from '@/src/components/controllers/data-module';
import type { AuditEntry } from '@/src/core/api';
import {
  AUDIT_ACTION_META,
  AUDIT_ENTITY_LABELS,
  AUDIT_FIELD_LABELS,
  auditLabels as labels,
} from '../static-data/audit.data';
import { entityHref, formatWhen } from '../utils/audit.utils';

export function getAuditColumns(timeZone?: string): DataModuleColumn<AuditEntry>[] {
  return [
    {
      key: 'createdAt',
      title: labels.colTime,
      render: (e) => (
        <Text size="xs" style={{ whiteSpace: 'nowrap' }}>
          {formatWhen(e.createdAt, timeZone)}
        </Text>
      ),
    },
    { key: 'user', title: labels.colUser, render: (e) => <Text size="sm">{e.userName ?? labels.system}</Text> },
    {
      key: 'action',
      title: labels.colAction,
      render: (e) => (
        <StatusBadge tone={AUDIT_ACTION_META[e.action].tone} variant="dot" size="xs">
          {AUDIT_ACTION_META[e.action].label}
        </StatusBadge>
      ),
    },
    {
      key: 'record',
      title: labels.colRecord,
      render: (e) => {
        const href = e.action === 'DELETE' ? null : entityHref(e.entity, e.entityId);
        const name = `${AUDIT_ENTITY_LABELS[e.entity] ?? e.entity} #${e.entityId}`;
        return (
          <Stack gap={0}>
            {href ? (
              <Text component={Link} href={href} size="sm" fw={500} c="inherit">
                {name}
              </Text>
            ) : (
              <Text size="sm" fw={500}>
                {name}
              </Text>
            )}
            {e.label && (
              <Text size="xs" c="var(--app-text-muted)">
                {e.label}
              </Text>
            )}
          </Stack>
        );
      },
    },
    {
      key: 'changes',
      title: labels.colChanges,
      render: (e) =>
        e.changes.length === 0 ? (
          <Text size="xs" c="var(--app-text-muted)">
            {e.action === 'DELETE' ? labels.deletedRecord : labels.noChanges}
          </Text>
        ) : (
          <Stack gap={2}>
            {e.changes.map((c) => (
              <Text key={c.field} size="xs">
                {AUDIT_FIELD_LABELS[c.field] ?? c.field}: {c.before} ← {c.after}
              </Text>
            ))}
          </Stack>
        ),
    },
  ];
}
