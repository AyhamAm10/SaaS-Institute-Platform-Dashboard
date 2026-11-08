'use client';

import { Group, Text } from '@mantine/core';
import { IconEdit, IconListDetails } from '@tabler/icons-react';
import { StudentField } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { AppIconButton } from '@/src/components/controllers/button';
import { IconTile } from '@/src/components/controllers/info-tile';
import { StatusBadge } from '@/src/components/controllers/badge';

const TYPE_NAMES: Record<StudentField['type'], string> = {
  TEXT: 'نصي',
  NUMBER: 'رقمي',
  DATE: 'تاريخ',
  SELECT: 'قائمة منسدلة',
  BOOLEAN: 'نعم / لا',
};

function getFieldTypeBadge(type: StudentField['type']) {
  switch (type) {
    case 'TEXT':
      return (
        <StatusBadge tone="info" size="sm">
          نصي
        </StatusBadge>
      );
    case 'NUMBER':
      return (
        <StatusBadge tone="success" size="sm">
          رقمي
        </StatusBadge>
      );
    case 'DATE':
      return (
        <StatusBadge tone="info" size="sm">
          تاريخ
        </StatusBadge>
      );
    case 'SELECT':
      return (
        <StatusBadge tone="warning" size="sm">
          قائمة منسدلة
        </StatusBadge>
      );
    case 'BOOLEAN':
      return (
        <StatusBadge tone="neutral" size="sm">
          نعم / لا
        </StatusBadge>
      );
  }
}

export function getStudentFieldsColumns(
  onEdit: (field: StudentField) => void,
  access = { canManage: true },
): DataModuleColumn<StudentField>[] {
  const cols: DataModuleColumn<StudentField>[] = [
    {
      key: 'label',
      title: 'تسمية الحقل',
      sortable: true,
      exportValue: (field) => field.label,
      exportKind: 'text',
      render: (field) => (
        <Group gap="sm" wrap="nowrap">
          <IconTile tone="neutral" size={36}>
            <IconListDetails size={18} />
          </IconTile>
          <Text fw={500} size="sm">
            {field.label}
          </Text>
        </Group>
      ),
    },
    {
      key: 'type',
      title: 'نوع الحقل',
      exportValue: (field) => TYPE_NAMES[field.type] ?? field.type,
      exportKind: 'text',
      render: (field) => getFieldTypeBadge(field.type),
    },
    {
      key: 'isRequired',
      title: 'إلزامية الحقل',
      exportValue: (field) => (field.isRequired ? 'إجباري' : 'اختياري'),
      exportKind: 'text',
      render: (field) => (
        <StatusBadge
          tone={field.isRequired ? 'danger' : 'neutral'}
          variant={field.isRequired ? 'solid' : 'soft'}
          size="sm"
        >
          {field.isRequired ? 'إجباري' : 'اختياري'}
        </StatusBadge>
      ),
    },
    {
      key: 'displayInReport',
      title: 'الظهور في البطاقة والتقارير',
      exportValue: (field) => (field.displayInReport ? 'يظهر بالتقرير' : 'داخلي فقط'),
      exportKind: 'text',
      render: (field) => (
        <StatusBadge tone={field.displayInReport ? 'success' : 'neutral'} size="sm">
          {field.displayInReport ? 'يظهر بالتقرير' : 'داخلي فقط'}
        </StatusBadge>
      ),
    },
    {
      key: 'isFilterable',
      title: 'قابل للفلترة',
      exportValue: (field) => (field.isFilterable ? 'نعم' : 'لا'),
      exportKind: 'text',
      render: (field) => (
        <StatusBadge tone={field.isFilterable ? 'info' : 'neutral'} size="sm">
          {field.isFilterable ? 'نعم' : 'لا'}
        </StatusBadge>
      ),
    },
  ];

  if (access.canManage) {
    cols.push({
      key: 'actions',
      title: 'الإجراءات',
      align: 'center',
      render: (field) => (
        <AppIconButton variant="ghost" label="تعديل الحقل" size="sm" onClick={() => onEdit(field)}>
          <IconEdit size={16} />
        </AppIconButton>
      ),
    });
  }

  return cols;
}
