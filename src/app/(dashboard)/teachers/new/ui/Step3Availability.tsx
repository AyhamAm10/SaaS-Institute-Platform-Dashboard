'use client';

import { Alert, Divider, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconInfoCircle, IconPlus } from '@tabler/icons-react';
import { AppInput, AppSelect } from '@/src/components/controllers';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';
import { inputText, WEEK_DAY_OPTIONS as DAYS_OF_WEEK } from '@/src/core/format';
import { AppButton } from '@/src/components/controllers/button';
import { Step3AvailabilityList } from './Step3AvailabilityList';

export function Step3Availability() {
  const stagedDayOfWeek = useTeacherRegistrationMirror('stagedDayOfWeek');
  const stagedStartTime = useTeacherRegistrationMirror('stagedStartTime');
  const stagedEndTime = useTeacherRegistrationMirror('stagedEndTime');
  const setStagedDayOfWeek = useTeacherRegistrationMirror('setStagedDayOfWeek');
  const setStagedStartTime = useTeacherRegistrationMirror('setStagedStartTime');
  const setStagedEndTime = useTeacherRegistrationMirror('setStagedEndTime');
  const addAvailability = useTeacherRegistrationMirror('addAvailability');
  const stepErrors = useTeacherRegistrationMirror('stepErrors');

  const error = stepErrors[2];

  return (
    <Stack gap="xl">
      <Stack gap={3}>
        <Text size="md" fw={500}>
          الخطوة الثالثة: أوقات الدوام والتفرغ الأسبوعي
        </Text>
        <Text size="xs" c="dimmed">
          حدد الأيام والساعات التي يتواجد فيها المعلم في المعهد لتسكين حصصه في الجدول دون تعارض
        </Text>
      </Stack>

      {/* Info Callout */}
      <Alert
        icon={<IconInfoCircle size={18} />}
        color="teal"
        radius="xl"
        variant="light"
        title="تسكين الحصص الأوتوماتيكي ومنع التضارب"
      >
        تضمن خوارزمية الجداول ألا يتم جدولة أي حصة للمعلم خارج هذه الفترات. في حال عدم إدخال أي فترات، سيعتبر المعلم
        متفرغاً ومتاحاً طوال أوقات الدوام الرسمي للمعهد.
      </Alert>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" radius="xl" variant="light">
          {error}
        </Alert>
      )}

      {/* Add Availability Bar */}
      <Paper p="lg" radius="xl" withBorder bg="var(--app-subtle)">
        <Stack gap="md">
          <Text size="sm" fw={500} c="primary.8">
            إضافة فترة دوام جديدة
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
            <AppSelect
              label="يوم الدوام"
              placeholder="اختر اليوم..."
              data={DAYS_OF_WEEK}
              value={stagedDayOfWeek}
              onChange={(val: string | null) => setStagedDayOfWeek(val || '0')}
            />

            <AppInput
              label="من الساعة"
              placeholder="08:00"
              value={stagedStartTime}
              onChange={(val) => setStagedStartTime(inputText(val))}
            />

            <AppInput
              label="إلى الساعة"
              placeholder="12:00"
              value={stagedEndTime}
              onChange={(val) => setStagedEndTime(inputText(val))}
            />

            <Stack justify="flex-end">
              <AppButton
                leftSection={<IconPlus size={16} />}
                onClick={addAvailability}
                disabled={!stagedStartTime || !stagedEndTime}
              >
                إضافة الفترة
              </AppButton>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Paper>

      <Divider my="xs" />
      <Step3AvailabilityList />
    </Stack>
  );
}
