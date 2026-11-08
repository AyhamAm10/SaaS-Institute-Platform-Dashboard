'use client';

import { Center, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBook, IconBriefcase, IconTrash } from '@tabler/icons-react';
import { StatusBadge } from '@/src/components/controllers/badge';
import { AppIconButton } from '@/src/components/controllers/button';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';

/** The qualifications added so far. */
export function Step2QualificationList() {
  const qualifications = useTeacherRegistrationMirror('qualifications');
  const removeQualification = useTeacherRegistrationMirror('removeQualification');

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500} c="primary.8">
          المواد المعتمدة المضافة ({qualifications.length})
        </Text>
        {qualifications.length > 0 && <StatusBadge tone="success">تم إدراج {qualifications.length} مادة</StatusBadge>}
      </Group>

      {qualifications.length === 0 ? (
        <Paper p="xl" radius="xl" withBorder style={{ borderStyle: 'dashed' }}>
          <Center>
            <Stack align="center" gap="xs">
              <ThemeIcon color="gray" variant="light" size="xl" radius="xl">
                <IconBook size={22} />
              </ThemeIcon>
              <Text size="sm" fw={500} c="dimmed">
                لم يتم إضافة أي مواد لهذا المعلم بعد
              </Text>
              <Text size="xs" c="dimmed" ta="center">
                اختر الفرع الأكاديمي والمادة من الأعلى واضغط &quot;إضافة المؤهل&quot;. (يمكنك أيضاً المتابعة وإضافتها
                لاحقاً من ملف المعلم).
              </Text>
            </Stack>
          </Center>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          {qualifications.map((q, idx) => (
            <Paper key={`${q.academicBranchId}-${q.subjectId}`} p="md" radius="xl" withBorder>
              <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <ThemeIcon color="indigo" variant="light" radius="xl" size="lg">
                    <IconBriefcase size={18} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>
                      {q.subjectName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      الفرع: {q.academicBranchName}
                    </Text>
                  </Stack>
                </Group>

                <AppIconButton variant="danger" label="إزالة المؤهل" onClick={() => removeQualification(idx)}>
                  <IconTrash size={16} />
                </AppIconButton>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
