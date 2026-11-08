'use client';

import { Alert, CopyButton, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconCopy, IconDice, IconInfoCircle, IconKey } from '@tabler/icons-react';
import { AppButton, AppIconButton, AppInput, AppModal } from '@/src/components/controllers';
import { generateSecurePassword } from '@/src/core/auth';
import { inputText } from '@/src/core/format';
import { useTeachersTabMirror } from '../store/useTeachersTabMirror';

interface TeachersTabPasswordModalProps {
  onSubmit: () => void;
}

export function TeachersTabPasswordModal({ onSubmit }: TeachersTabPasswordModalProps) {
  const opened = useTeachersTabMirror('passwordModalOpened');
  const selectedTeacher = useTeachersTabMirror('selectedTeacher');
  const newPassword = useTeachersTabMirror('newPassword');
  const passwordError = useTeachersTabMirror('passwordError');
  const isSubmitting = useTeachersTabMirror('isPasswordSubmitting');
  const setNewPassword = useTeachersTabMirror('setNewPassword');
  const close = useTeachersTabMirror('closePasswordModal');

  if (!opened || !selectedTeacher) return null;

  const handleGenerate = () => {
    const pwd = generateSecurePassword(10);
    setNewPassword(pwd);
  };

  return (
    <AppModal opened onClose={close} size="md">
      <AppModal.Header>
        <AppModal.Icon icon={<IconKey size={22} />} color="primary" />
        <AppModal.Title>تغيير كلمة مرور المعلم</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <Stack gap="md">
          {passwordError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {passwordError}
            </Alert>
          )}

          <Text size="sm">
            أنت تقوم بتغيير كلمة المرور للمعلم <strong>{selectedTeacher.user.fullName}</strong>.
          </Text>

          <Alert icon={<IconInfoCircle size={16} />} color="blue" variant="light" radius="md">
            <Text size="xs">سيتم تسجيل خروج المستخدم من كل أجهزته فور تعيين كلمة المرور الجديدة.</Text>
          </Alert>

          <Stack gap="xs">
            <AppInput
              type="text"
              label="كلمة المرور الجديدة"
              placeholder="أدخل كلمة المرور أو انقر على توليد"
              value={newPassword}
              onChange={(e: unknown) => setNewPassword(inputText(e))}
              required
            />
            <Group justify="space-between">
              <AppButton
                variant="ghost"
                size="xs"
                leftSection={<IconDice size={14} />}
                onClick={handleGenerate}
              >
                توليد كلمة مرور عشوائية
              </AppButton>

              {newPassword && (
                <CopyButton value={newPassword} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'تم النسخ' : 'نسخ كلمة المرور'} withArrow position="right">
                      <AppIconButton
                        size="sm"
                        label={copied ? 'تم النسخ' : 'نسخ كلمة المرور'}
                        variant={copied ? 'brand' : 'default'}
                        onClick={copy}
                      >
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </AppIconButton>
                    </Tooltip>
                  )}
                </CopyButton>
              )}
            </Group>
          </Stack>
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>إلغاء</AppModal.Cancel>
          <AppButton onClick={onSubmit} loading={isSubmitting}>
            تأكيد وتغيير
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
