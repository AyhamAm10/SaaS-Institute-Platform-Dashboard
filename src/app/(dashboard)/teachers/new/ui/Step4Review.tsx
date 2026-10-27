'use client';

import {
  Alert,
  Badge,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconBriefcase,
  IconCalendarTime,
  IconCheck,
  IconClock,
  IconUser,
} from '@tabler/icons-react';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';

const dayNameMap: Record<number, string> = {
  0: 'الأحد',
  1: 'الإثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

export function Step4Review() {
  const fullName = useTeacherRegistrationMirror('fullName');
  const phone = useTeacherRegistrationMirror('phone');
  const specialization = useTeacherRegistrationMirror('specialization');
  const isActive = useTeacherRegistrationMirror('isActive');
  const qualifications = useTeacherRegistrationMirror('qualifications');
  const availabilities = useTeacherRegistrationMirror('availabilities');
  const stepErrors = useTeacherRegistrationMirror('stepErrors');

  const error = stepErrors[3];

  return (
    <Stack gap="lg">
      <Stack gap={2}>
        <Text size="md" fw={700}>
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
        {/* Basic Info Card */}
        <Card radius="xl" withBorder p="lg">
          <Stack gap="sm">
            <Group gap="xs">
              <ThemeIcon size="md" radius="xl" color="primary" variant="light">
                <IconUser size={16} />
              </ThemeIcon>
              <Text fw={700} size="sm">
                بيانات المعلم والحساب
              </Text>
            </Group>

            <Divider />

            <SimpleGrid cols={2} spacing="xs">
              <div>
                <Text size="xs" c="dimmed">
                  الاسم الكامل:
                </Text>
                <Text size="xs" fw={700}>
                  {fullName || '—'}
                </Text>
              </div>

              <div>
                <Text size="xs" c="dimmed">
                  رقم الهاتف:
                </Text>
                <Text size="xs" fw={700} dir="ltr" ta="right">
                  {phone || '—'}
                </Text>
              </div>

              <div>
                <Text size="xs" c="dimmed">
                  المسمى الأكاديمي:
                </Text>
                <Text size="xs" fw={700}>
                  {specialization || 'غير محدد'}
                </Text>
              </div>

              <div>
                <Text size="xs" c="dimmed">
                  حالة الحساب:
                </Text>
                <Badge variant="dot" color={isActive ? 'teal' : 'red'} size="xs" radius="sm">
                  {isActive ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Qualifications Card */}
        <Card radius="xl" withBorder p="lg">
          <Stack gap="sm">
            <Group gap="xs">
              <ThemeIcon size="md" radius="xl" color="indigo" variant="light">
                <IconBriefcase size={16} />
              </ThemeIcon>
              <Text fw={700} size="sm">
                المواد والمؤهلات الأكاديمية ({qualifications.length})
              </Text>
            </Group>

            <Divider />

            {qualifications.length === 0 ? (
              <Text size="xs" c="dimmed">
                لم يتم إدراج مواد معتمدة (يمكن إضافتها لاحقاً من ملف المعلم).
              </Text>
            ) : (
              <Stack gap={6} mah={180} style={{ overflowY: 'auto' }}>
                {qualifications.map((q) => (
                  <Group
                    key={`${q.academicBranchId}-${q.subjectId}`}
                    justify="space-between"
                    p="xs"
                    style={{ background: 'var(--app-subtle)', borderRadius: '8px' }}
                  >
                    <Text size="xs" fw={700}>
                      {q.subjectName}
                    </Text>
                    <Badge size="xs" color="primary" variant="light" radius="sm">
                      {q.academicBranchName}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            )}
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Schedule / Availability Card */}
      <Card radius="xl" withBorder p="lg">
        <Stack gap="sm">
          <Group gap="xs">
            <ThemeIcon size="md" radius="xl" color="teal" variant="light">
              <IconCalendarTime size={16} />
            </ThemeIcon>
            <Text fw={700} size="sm">
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
                  <Text size="xs" fw={700}>
                    {dayNameMap[avail.dayOfWeek]}
                  </Text>
                  <Badge size="xs" variant="outline" color="gray">
                    {avail.startTime} - {avail.endTime}
                  </Badge>
                </Group>
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
