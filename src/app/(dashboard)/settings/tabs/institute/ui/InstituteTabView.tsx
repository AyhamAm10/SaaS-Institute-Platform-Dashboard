'use client';

import { Alert, Box, Group, Paper, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconAlertTriangle, IconBuildingSkyscraper, IconCheck, IconDeviceFloppy } from '@tabler/icons-react';
import { AppButton, AppInput, AppSelect } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { useInstituteTabMirror } from '../store/useInstituteTabMirror';
import { COMMON_TIMEZONES } from '../static-data/timezones.data';

interface InstituteTabViewProps {
  onSave: () => void;
  canManage: boolean;
}

export function InstituteTabView({ onSave, canManage }: InstituteTabViewProps) {
  const form = useInstituteTabMirror('form');
  const initialTimezone = useInstituteTabMirror('initialTimezone');
  const isLoading = useInstituteTabMirror('isLoading');
  const isSubmitting = useInstituteTabMirror('isSubmitting');
  const generalError = useInstituteTabMirror('generalError');
  const generalSuccess = useInstituteTabMirror('generalSuccess');
  const fieldErrors = useInstituteTabMirror('fieldErrors');
  const setFormField = useInstituteTabMirror('setFormField');

  if (isLoading) {
    return (
      <Stack gap="lg" p="md">
        <Skeleton height={50} radius="xl" />
        <Skeleton height={250} radius="xl" />
      </Stack>
    );
  }

  const timezoneChanged = Boolean(form.timezone && initialTimezone && form.timezone !== initialTimezone);

  return (
    <Stack gap="xl">
      {generalError && (
        <Alert icon={<IconAlertCircle size={18} />} color="red" radius="xl" title="خطأ">
          {generalError}
        </Alert>
      )}

      {generalSuccess && (
        <Alert icon={<IconCheck size={18} />} color="teal" radius="xl" title="تم الحفظ بنجاح">
          {generalSuccess}
        </Alert>
      )}

      <Paper p="xl" radius="xl" withBorder>
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <Box style={{ display: 'inline-flex', color: 'var(--app-brand-accent)' }}>
                <IconBuildingSkyscraper size={22} />
              </Box>
              <Title order={3} fw={600} size="h4">
                بيانات المعهد الأساسية
              </Title>
            </Group>
            {canManage && (
              <AppButton
                leftSection={<IconDeviceFloppy size={18} />}
                size="md"
                loading={isSubmitting}
                onClick={onSave}
              >
                حفظ التغييرات
              </AppButton>
            )}
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <AppInput
              label="اسم المعهد"
              placeholder="مثال: معهد الأوائل التعليمي"
              value={form.name}
              onChange={(e: unknown) => setFormField('name', inputText(e))}
              error={fieldErrors.name}
              disabled={!canManage}
              required
            />
            <AppInput
              type="tel"
              label="رقم الهاتف"
              placeholder="مثال: 0912345678"
              value={form.phone}
              onChange={(e: unknown) => setFormField('phone', inputText(e))}
              error={fieldErrors.phone}
              disabled={!canManage}
              required
            />
          </SimpleGrid>

          <AppInput
            label="العنوان"
            placeholder="مثال: دمشق - المزة - جانب جامع الإخلاص"
            value={form.address}
            onChange={(e: unknown) => setFormField('address', inputText(e))}
            error={fieldErrors.address}
            disabled={!canManage}
          />

          <Stack gap="xs">
            <AppSelect
              label="المنطقة الزمنية (IANA)"
              description="تحدد توقيت النظام الرسمي وحساب سجلات الحضور والغياب"
              data={COMMON_TIMEZONES}
              value={form.timezone}
              onChange={(val: string | null) => setFormField('timezone', val || 'Asia/Damascus')}
              searchable
              disabled={!canManage}
              required
            />
            {timezoneChanged && (
              <Alert icon={<IconAlertTriangle size={18} />} color="yellow" radius="lg" variant="light">
                <Text size="xs" fw={500}>
                  تنبيه: تعديل المنطقة الزمنية يؤثر على حساب اليوم والحضور والاستحقاقات لكافة الفروع.
                </Text>
              </Alert>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
