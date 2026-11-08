'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconKey } from '@tabler/icons-react';
import { AppButton, AppInput, AppModal } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { useTeachersMirror } from '../store/useTeachersMirror';

export interface TeacherPasswordModalProps {
  onSubmit: () => Promise<void>;
}

export function TeacherPasswordModal({ onSubmit }: TeacherPasswordModalProps) {
  const opened = useTeachersMirror('passwordModalOpened');
  const target = useTeachersMirror('passwordTarget');
  const newPassword = useTeachersMirror('newPassword');
  const error = useTeachersMirror('passwordModalError');
  const isSubmitting = useTeachersMirror('isPasswordSubmitting');
  const setNewPassword = useTeachersMirror('setNewPassword');
  const close = useTeachersMirror('closePasswordModal');

  if (!opened || !target) return null;

  return (
    <AppModal opened onClose={close} size="sm">
      <AppModal.Header>
        <AppModal.Icon icon={<IconKey size={22} />} color="primary" />
        <AppModal.Title>تغيير كلمة المرور</AppModal.Title>
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
            أدخل كلمة المرور الجديدة للمعلم <strong>{target.user.fullName}</strong>. سيتم تسجيل خروج المعلم من كافة
            جلساته الحالية فور تغييرها.
          </Text>
          <AppInput
            type="password"
            label="كلمة المرور الجديدة"
            description="8 محارف على الأقل"
            value={newPassword}
            onChange={(e: unknown) => setNewPassword(inputText(e))}
            required
          />
        </Stack>
      </AppModal.Content>
      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>إلغاء</AppModal.Cancel>
          <AppButton onClick={onSubmit} loading={isSubmitting}>
            حفظ
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
