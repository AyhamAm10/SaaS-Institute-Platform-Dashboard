'use client';

import { Alert, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconAlertCircle, IconCalendar, IconCheck, IconDeviceFloppy } from '@tabler/icons-react';
import { AppButton } from '@/src/components/controllers/button';
import { useScheduleSettingsMirror } from '../store/useScheduleSettingsMirror';

interface ScheduleSettingsHeaderProps {
  onSave: () => void;
  canManage: boolean;
}

/** Page title, save action and the save result alerts. */
export function ScheduleSettingsHeader({ onSave, canManage }: ScheduleSettingsHeaderProps) {
  const generalError = useScheduleSettingsMirror('generalError');
  const generalSuccess = useScheduleSettingsMirror('generalSuccess');
  const isSubmitting = useScheduleSettingsMirror('isSubmitting');

  return (
    <>
      {/* Header */}
      <Paper p="lg" radius="xl" withBorder>
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="md">
            <ThemeIcon size={46} radius="xl" variant="light" color="navy">
              <IconCalendar size={24} />
            </ThemeIcon>
            <Stack gap={4}>
              <Title order={2} fw={500}>
                إعدادات الجدول والدوام المدرسي
              </Title>
              <Text c="dimmed" size="sm">
                ضبط أيام العمل، ساعات الدوام، مدد الحصص والاستراحات لإنشاء الحصص تلقائيا
              </Text>
            </Stack>
          </Group>
          {canManage && (
            <AppButton leftSection={<IconDeviceFloppy size={18} />} size="md" loading={isSubmitting} onClick={onSave}>
              حفظ التغييرات
            </AppButton>
          )}
        </Group>
      </Paper>

      {/* Alerts */}
      {generalError && (
        <Alert icon={<IconAlertCircle size={18} />} color="red" radius="xl" title="خطأ في الإعدادات">
          {generalError}
        </Alert>
      )}

      {generalSuccess && (
        <Alert icon={<IconCheck size={18} />} color="teal" radius="xl" title="تم الحفظ بنجاح">
          {generalSuccess}
        </Alert>
      )}
    </>
  );
}
