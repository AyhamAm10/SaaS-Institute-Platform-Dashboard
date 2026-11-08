'use client';

import { Alert, Card, Divider, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconAlertCircle, IconCalendarTime, IconClock } from '@tabler/icons-react';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';
import { StatusBadge } from '@/src/components/controllers/badge';
import { weekDayName } from '@/src/core/format';
import { Step4AccountCard, Step4QualificationsCard } from './Step4ReviewCards';

export function Step4Review() {
  const availabilities = useTeacherRegistrationMirror('availabilities');
  const stepErrors = useTeacherRegistrationMirror('stepErrors');

  const error = stepErrors[3];

  return (
    <Stack gap="lg">
      <Stack gap={2}>
        <Text size="md" fw={500}>
          الخطوة الرابعة: مراجعة وتأكيد بيانات المعلم
        </Text>
        <Text size="xs" c="dimmed">
          يرجى مراجعة كافة البيانات والمواد المعتمدة وأوقات الدوام قبل الحفظ النهائي
        </Text>
      </Stack>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" radius="xl" variant="light">
          {error}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Step4AccountCard />
        <Step4QualificationsCard />
      </SimpleGrid>

      {/* Schedule / Availability Card */}
      <Card radius="xl" withBorder p="lg">
        <Stack gap="sm">
          <Group gap="xs">
            <ThemeIcon size="md" radius="xl" color="teal" variant="light">
              <IconCalendarTime size={16} />
            </ThemeIcon>
            <Text fw={500} size="sm">
              أوقات الدوام والتفرغ الأسبوعي للجدول ({availabilities.length})
            </Text>
          </Group>

          <Divider />

          {availabilities.length === 0 ? (
            <Text size="xs" c="dimmed">
              متاح طوال أوقات الدوام الرسمي المعتمد للمعهد (سيتم الجدولة في أي وقت متاح للشعبة).
            </Text>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
              {availabilities.map((avail, idx) => (
                <Group
                  key={`${avail.dayOfWeek}-${avail.startTime}-${idx}`}
                  gap="xs"
                  p="xs"
                  style={{ background: 'var(--app-subtle)', borderRadius: '8px' }}
                >
                  <IconClock size={14} color="var(--app-brand-accent)" />
                  <Text size="xs" fw={500}>
                    {weekDayName(avail.dayOfWeek)}
                  </Text>
                  <StatusBadge tone="neutral" variant="outline" size="xs">
                    {avail.startTime} - {avail.endTime}
                  </StatusBadge>
                </Group>
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
