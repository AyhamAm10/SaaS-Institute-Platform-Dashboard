'use client';

import { Group, Text } from '@mantine/core';
import { IconKey } from '@tabler/icons-react';
import { Teacher } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { StatusBadge } from '@/src/components/controllers/badge';
import { AppButton } from '@/src/components/controllers/button';

export function getTeachersTabColumns(
  onOpenPasswordModal: (teacher: Teacher) => void,
  canManage: boolean,
): DataModuleColumn<Teacher>[] {
  return [
    {
      key: 'fullName',
      title: 'اسم المعلم',
      sortable: true,
      exportValue: (t) => t.user.fullName,
      exportKind: 'text',
      render: (t) => (
        <Text fw={500} size="sm">
          {t.user.fullName}
        </Text>
      ),
    },
    {
      key: 'phone',
      title: 'رقم الهاتف',
      exportValue: (t) => t.user.phone || null,
      exportKind: 'phone',
      render: (t) => (
        <Text size="sm" dir="ltr" style={{ textAlign: 'right' }}>
          {t.user.phone || '—'}
        </Text>
      ),
    },
    {
      key: 'status',
      title: 'الحالة',
      exportValue: (t) => (t.isActive ? 'نشط' : 'معطّل'),
      exportKind: 'badge',
      render: (t) => (
        <StatusBadge tone={t.isActive ? 'success' : 'danger'}>
          {t.isActive ? 'نشط' : 'معطّل'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (t) =>
        canManage ? (
          <Group gap="xs">
            <AppButton
              variant="outline"
              size="xs"
              leftSection={<IconKey size={14} />}
              onClick={() => onOpenPasswordModal(t)}
            >
              تغيير كلمة المرور
            </AppButton>
          </Group>
        ) : null,
    },
  ];
}
