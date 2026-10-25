'use client';

import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCalendarTime,
  IconClock,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { AppInput, AppSelect } from '@/src/components/controllers';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';

const DAYS_OF_WEEK = [
  { value: '0', label: 'الأحد' },
  { value: '1', label: 'الإثنين' },
  { value: '2', label: 'الثلاثاء' },
  { value: '3', label: 'الأربعاء' },
  { value: '4', label: 'الخميس' },
  { value: '5', label: 'الجمعة' },
  { value: '6', label: 'السبت' },
];

const dayNameMap: Record<number, string> = {
  0: 'الأحد',
  1: 'الإثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

export function Step3Availability() {
  const availabilities = useTeacherRegistrationMirror('availabilities');
  const stagedDayOfWeek = useTeacherRegistrationMirror('stagedDayOfWeek');
  const stagedStartTime = useTeacherRegistrationMirror('stagedStartTime');
  const stagedEndTime = useTeacherRegistrationMirror('stagedEndTime');
  const setStagedDayOfWeek = useTeacherRegistrationMirror('setStagedDayOfWeek');
  const setStagedStartTime = useTeacherRegistrationMirror('setStagedStartTime');
  const setStagedEndTime = useTeacherRegistrationMirror('setStagedEndTime');
  const addAvailability = useTeacherRegistrationMirror('addAvailability');
  const removeAvailability = useTeacherRegistrationMirror('removeAvailability');
  const stepErrors = useTeacherRegistrationMirror('stepErrors');

  const error = stepErrors[2];

  return (
    <Stack gap="xl">
      <Stack gap={3}>
        <Text size="md" fw={700}>
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
        تضمن خوارزمية الجداول ألا يتم جدولة أي حصة للمعلم خارج هذه الفترات. في حال عدم إدخال أي
        فترات، سيعتبر المعلم متفرغاً ومتاحاً طوال أوقات الدوام الرسمي للمعهد.
      </Alert>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" radius="xl" variant="light">
          {error}
        </Alert>
      )}

      {/* Add Availability Bar */}
      <Paper p="lg" radius="xl" withBorder bg="var(--mantine-color-gray-0)">
        <Stack gap="md">
          <Text size="sm" fw={700} c="primary.8">
            إضافة فترة دوام جديدة
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md">
            <AppSelect
              label="يوم الدوام"
              placeholder="اختر اليوم..."
              data={DAYS_OF_WEEK}
              value={stagedDayOfWeek}
              onChange={(val: any) => setStagedDayOfWeek(val || '0')}
            />

            <AppInput
              label="من الساعة"
              placeholder="08:00"
              value={stagedStartTime}
              onChange={(val) =>
                setStagedStartTime(typeof val === 'string' ? val : val?.target?.value ?? '')
              }
            />

            <AppInput
              label="إلى الساعة"
              placeholder="12:00"
              value={stagedEndTime}
              onChange={(val) =>
                setStagedEndTime(typeof val === 'string' ? val : val?.target?.value ?? '')
              }
            />

            <Stack justify="flex-end">
              <Button
                leftSection={<IconPlus size={16} />}
                radius="xl"
                color="primary"
                onClick={addAvailability}
                disabled={!stagedStartTime || !stagedEndTime}
              >
                إضافة الفترة
              </Button>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Paper>

      <Divider my="xs" />

      {/* List of Added Intervals */}
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={700} c="primary.8">
            فترات الدوام المعتمدة ({availabilities.length})
          </Text>
          {availabilities.length > 0 && (
            <Badge variant="light" color="blue" radius="xl">
              تم تسجيل {availabilities.length} فترات تفرغ
            </Badge>
          )}
        </Group>

        {availabilities.length === 0 ? (
          <Paper p="xl" radius="xl" withBorder style={{ borderStyle: 'dashed' }}>
            <Center>
              <Stack align="center" gap="xs">
                <ThemeIcon color="gray" variant="light" size="xl" radius="xl">
                  <IconCalendarTime size={22} />
                </ThemeIcon>
                <Text size="sm" fw={600} c="dimmed">
                  لم يتم تحديد فترات مخصصة (متاح كامل أوقات الدوام الرسمي)
                </Text>
                <Text size="xs" c="dimmed" ta="center">
                  يمكنك إضافة فترات محددة للأيام وساعات التفرغ في الأعلى، أو المتابعة للخطوة
                  التالية.
                </Text>
              </Stack>
            </Center>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
            {availabilities.map((avail, idx) => (
              <Paper key={`${avail.dayOfWeek}-${avail.startTime}-${idx}`} p="md" radius="xl" withBorder>
                <Group justify="space-between" align="center" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon color="teal" variant="light" radius="xl" size="md">
                      <IconClock size={16} />
                    </ThemeIcon>
                    <Stack gap={2}>
                      <Text size="sm" fw={700}>
                        يوم {dayNameMap[avail.dayOfWeek] || `يوم ${avail.dayOfWeek}`}
                      </Text>
                      <Badge variant="outline" color="gray" size="sm" radius="md">
                        {avail.startTime} — {avail.endTime}
                      </Badge>
                    </Stack>
                  </Group>

                  <Tooltip label="إزالة الفترة" withArrow>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      radius="xl"
                      onClick={() => removeAvailability(idx)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Stack>
  );
}
