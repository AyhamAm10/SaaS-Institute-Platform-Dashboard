'use client';

import { Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconKey, IconUserOff } from '@tabler/icons-react';
import { MobileAccountItem } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { StatusBadge } from '@/src/components/controllers/badge';
import { AppIconButton } from '@/src/components/controllers/button';
import { MOBILE_ROLE_LABELS, RELATIONSHIP_LABELS } from '../static-data/mobile-accounts.data';

export function getMobileAccountsColumns(
  onOpenPasswordModal: (account: MobileAccountItem) => void,
  onOpenDeactivateModal: (account: MobileAccountItem) => void,
  canManage: boolean,
): DataModuleColumn<MobileAccountItem>[] {
  return [
    {
      key: 'fullName',
      title: 'الاسم الكامل',
      sortable: true,
      exportValue: (i) => i.fullName,
      exportKind: 'text',
      render: (i) => (
        <Text fw={500} size="sm">
          {i.fullName}
        </Text>
      ),
    },
    {
      key: 'phone',
      title: 'رقم الهاتف',
      exportValue: (i) => i.phone,
      exportKind: 'phone',
      render: (i) => (
        <Text size="sm" dir="ltr" style={{ textAlign: 'right' }}>
          {i.phone}
        </Text>
      ),
    },
    {
      key: 'role',
      title: 'نوع الحساب',
      exportValue: (i) => MOBILE_ROLE_LABELS[i.role] || i.role,
      exportKind: 'badge',
      render: (i) => (
        <StatusBadge tone={i.role === 'FAMILY' ? 'brand' : 'info'}>
          {MOBILE_ROLE_LABELS[i.role] || i.role}
        </StatusBadge>
      ),
    },
    {
      key: 'related',
      title: 'الارتباط',
      exportValue: (i) =>
        i.role === 'FAMILY'
          ? `${i.familyName || ''} (${i.relationship ? RELATIONSHIP_LABELS[i.relationship] || i.relationship : ''})`
          : i.studentName || '—',
      exportKind: 'text',
      render: (i) => {
        if (i.role === 'FAMILY') {
          return (
            <Stack gap={2}>
              <Text size="xs" fw={500}>
                {i.familyName || 'عائلة غير محددة'}
              </Text>
              {i.relationship && (
                <Text size="xs" c="dimmed">
                  صلة القرابة: {RELATIONSHIP_LABELS[i.relationship] || i.relationship}
                </Text>
              )}
            </Stack>
          );
        }
        return (
          <Text size="xs" fw={500}>
            {i.studentName || 'طالب غير محدد'}
          </Text>
        );
      },
    },
    {
      key: 'status',
      title: 'الحالة',
      exportValue: (i) => (i.status === 'ACTIVE' ? 'نشط' : 'معطّل'),
      exportKind: 'badge',
      render: (i) => (
        <StatusBadge tone={i.status === 'ACTIVE' ? 'success' : 'danger'}>
          {i.status === 'ACTIVE' ? 'نشط' : 'معطّل'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (i) =>
        canManage ? (
          <Group gap="xs">
            <Tooltip label="تغيير كلمة المرور" withArrow>
              <AppIconButton
                size="sm"
                label="تغيير كلمة المرور"
                variant="ghost"
                onClick={() => onOpenPasswordModal(i)}
              >
                <IconKey size={16} />
              </AppIconButton>
            </Tooltip>
            {i.status === 'ACTIVE' && (
              <Tooltip label="تعطيل الحساب" withArrow>
                <AppIconButton
                  size="sm"
                  label="تعطيل الحساب"
                  variant="danger"
                  onClick={() => onOpenDeactivateModal(i)}
                >
                  <IconUserOff size={16} />
                </AppIconButton>
              </Tooltip>
            )}
          </Group>
        ) : null,
    },
  ];
}
