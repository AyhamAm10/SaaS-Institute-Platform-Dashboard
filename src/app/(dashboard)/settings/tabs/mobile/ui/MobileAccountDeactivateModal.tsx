'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconUserOff } from '@tabler/icons-react';
import { AppButton, AppModal } from '@/src/components/controllers';
import { useMobileAccountsMirror } from '../store/useMobileAccountsMirror';

interface MobileAccountDeactivateModalProps {
  onConfirm: () => void;
}

export function MobileAccountDeactivateModal({ onConfirm }: MobileAccountDeactivateModalProps) {
  const opened = useMobileAccountsMirror('deactivateModalOpened');
  const target = useMobileAccountsMirror('deactivateTarget');
  const isDeactivating = useMobileAccountsMirror('isDeactivating');
  const error = useMobileAccountsMirror('deactivateError');
  const close = useMobileAccountsMirror('closeDeactivateModal');

  if (!opened || !target) return null;

  return (
    <AppModal opened onClose={close} size="sm" variant="danger">
      <AppModal.Header>
        <AppModal.Icon icon={<IconUserOff size={22} />} color="red" />
        <AppModal.Title>تعطيل حساب التطبيق</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <Stack gap="sm">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}

          <Text size="sm">
            هل أنت متأكد من تعطيل حساب <strong>{target.fullName}</strong> ({target.phone})؟
          </Text>

          <Text size="xs" c="dimmed">
            سيتم حرمان المستخدم من تسجيل الدخول إلى تطبيق الجوال فوراً وإلغاء صلاحيات الوصول.
          </Text>
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>إلغاء</AppModal.Cancel>
          <AppButton variant="dangerSolid" onClick={onConfirm} loading={isDeactivating}>
            تأكيد التعطيل
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}

