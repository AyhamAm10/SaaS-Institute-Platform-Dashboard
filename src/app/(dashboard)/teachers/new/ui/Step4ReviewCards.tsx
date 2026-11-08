'use client';

import { Box, Card, Divider, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBriefcase, IconUser } from '@tabler/icons-react';
import { StatusBadge } from '@/src/components/controllers/badge';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';

/** Review card: identity and account status. */
export function Step4AccountCard() {
  const fullName = useTeacherRegistrationMirror('fullName');
  const phone = useTeacherRegistrationMirror('phone');
  const specialization = useTeacherRegistrationMirror('specialization');
  const isActive = useTeacherRegistrationMirror('isActive');

  return (
    <Card radius="xl" withBorder p="lg">
      <Stack gap="sm">
        <Group gap="xs">
          <ThemeIcon size="md" radius="xl" color="primary" variant="light">
            <IconUser size={16} />
          </ThemeIcon>
          <Text fw={500} size="sm">
            بيانات المعلم والحساب
          </Text>
        </Group>

        <Divider />

        <SimpleGrid cols={2} spacing="xs">
          <Box>
            <Text size="xs" c="dimmed">
              الاسم الكامل:
            </Text>
            <Text size="xs" fw={500}>
              {fullName || '—'}
            </Text>
          </Box>

          <Box>
            <Text size="xs" c="dimmed">
              رقم الهاتف:
            </Text>
            <Text size="xs" fw={500} dir="ltr" ta="right">
              {phone || '—'}
            </Text>
          </Box>

          <Box>
            <Text size="xs" c="dimmed">
              المسمى الأكاديمي:
            </Text>
            <Text size="xs" fw={500}>
              {specialization || 'غير محدد'}
            </Text>
          </Box>

          <Box>
            <Text size="xs" c="dimmed">
              حالة الحساب:
            </Text>
            <StatusBadge tone={isActive ? 'success' : 'danger'} variant="dot" size="xs">
              {isActive ? 'نشط' : 'غير نشط'}
            </StatusBadge>
          </Box>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}

/** Review card: the added qualifications. */
export function Step4QualificationsCard() {
  const qualifications = useTeacherRegistrationMirror('qualifications');

  return (
    <Card radius="xl" withBorder p="lg">
      <Stack gap="sm">
        <Group gap="xs">
          <ThemeIcon size="md" radius="xl" color="indigo" variant="light">
            <IconBriefcase size={16} />
          </ThemeIcon>
          <Text fw={500} size="sm">
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
                <Text size="xs" fw={500}>
                  {q.subjectName}
                </Text>
                <StatusBadge tone="ink" size="xs">
                  {q.academicBranchName}
                </StatusBadge>
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
