'use client';

import { useMemo } from 'react';
import { Text, UnstyledButton } from '@mantine/core';
import { IconBook, IconPlus } from '@tabler/icons-react';
import { formatMoney } from '@/src/core/format';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { Section } from '@/src/core/api';
import { SectionsActionsCell } from './SectionsActionsCell';
import { StatusBadge } from '@/src/components/controllers/badge';

export function useSectionsColumns(
  onEdit: (section: Section) => void,
  onOpenFee: (section: Section) => void,
  onOpenDetails: (section: Section, tab?: string) => void,
  access = { canManage: true },
): DataModuleColumn<Section>[] {
  return useMemo(() => {
    const cols: DataModuleColumn<Section>[] = [
      {
        key: 'name',
        title: 'اسم الشعبة',
        sortable: true,
        exportValue: (s) => s.name,
        exportKind: 'text',
        render: (row: Section) => (
          <Text fw={500} size="sm" style={{ cursor: 'pointer' }} onClick={() => onOpenDetails(row, 'subjects')}>
            {row.name}
          </Text>
        ),
      },
      {
        key: 'academicBranch',
        title: 'الفرع الأكاديمي',
        exportValue: (s) => s.academicBranch?.name ?? s.grade ?? '—',
        exportKind: 'text',
        render: (row: Section) => (
          <StatusBadge tone="success" size="sm">
            {row.academicBranch?.name ?? row.grade}
          </StatusBadge>
        ),
      },
      {
        key: 'academicYear',
        title: 'السنة الدراسية',
        exportValue: (s) => s.academicYear?.name ?? '—',
        exportKind: 'text',
        render: (row: Section) => (
          <Text size="sm" c="dimmed">
            {row.academicYear?.name ?? '—'}
          </Text>
        ),
      },
      {
        key: 'subjects',
        title: 'المواد المقررة',
        exportValue: (s) => s._count?.sectionSubjects ?? 0,
        exportKind: 'number',
        render: (row: Section) => {
          const count = row._count?.sectionSubjects ?? 0;
          return count > 0 ? (
            <UnstyledButton onClick={() => onOpenDetails(row, 'subjects')}>
              <StatusBadge tone="info" icon={<IconBook size={13} />} size="sm">
                {count} مواد مسندة
              </StatusBadge>
            </UnstyledButton>
          ) : access.canManage ? (
            <UnstyledButton onClick={() => onOpenDetails(row, 'subjects')}>
              <StatusBadge tone="warning" variant="outline" icon={<IconPlus size={13} />} size="sm">
                + إسناد المواد
              </StatusBadge>
            </UnstyledButton>
          ) : (
            <Text size="xs" c="dimmed">
              لا توجد مواد
            </Text>
          );
        },
      },
      {
        key: 'feeAmount',
        title: 'الرسوم الدراسية',
        exportValue: (s) => ({
          amount: Number(s.feeAmount ?? 0),
          currency: (s.feeCurrency as 'SYP' | 'USD') ?? 'SYP',
        }),
        exportKind: 'money',
        render: (row: Section) => (
          <Text fw={500} size="sm" c="teal">
            {formatMoney(row.feeAmount, (row.feeCurrency as 'SYP' | 'USD') ?? 'SYP')}
          </Text>
        ),
      },
      {
        key: 'actions',
        title: 'الإجراءات',
        align: 'center',
        render: (row: Section) => (
          <SectionsActionsCell
            row={row}
            canManage={access.canManage}
            onEdit={onEdit}
            onOpenFee={onOpenFee}
            onOpenDetails={onOpenDetails}
          />
        ),
      },
    ];

    return cols;
  }, [onEdit, onOpenFee, onOpenDetails, access.canManage]);
}
