'use client';

import { Box, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { StatusBadge } from '@/src/components/controllers/badge';
import { useTeachersMirror } from '../store/useTeachersMirror';

/** Teacher profile summary: identity, status and branches. */
export function TeacherOverviewTab() {
  const selectedTeacherDetails = useTeachersMirror('selectedTeacherDetails');
  if (!selectedTeacherDetails) return null;

  return (
    <Stack gap="md">
      <Paper p="md" radius="xl" withBorder>
        <SimpleGrid cols={2} spacing="md">
          <Box>
            <Text size="xs" c="dimmed">
              الاسم الكامل
            </Text>
            <Text size="sm" fw={500}>
              {selectedTeacherDetails.user.fullName}
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">
              رقم الهاتف
            </Text>
            <Text size="sm" fw={500} dir="ltr" ta="right">
              {selectedTeacherDetails.user.phone}
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">
              التخصص الأكاديمي
            </Text>
            <Text size="sm" fw={500}>
              {selectedTeacherDetails.specialization || 'غير محدد'}
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">
              حالة الحساب
            </Text>
            <StatusBadge tone={selectedTeacherDetails.isActive ? 'success' : 'danger'} variant="dot">
              {selectedTeacherDetails.isActive ? 'نشط' : 'غير نشط'}
            </StatusBadge>
          </Box>
        </SimpleGrid>
      </Paper>

      <Paper p="md" radius="xl" withBorder>
        <Text size="xs" c="dimmed" mb="xs">
          فروع المعهد المنتسب إليها
        </Text>
        <Group gap="xs">
          {selectedTeacherDetails.teacherBranches && selectedTeacherDetails.teacherBranches.length > 0 ? (
            selectedTeacherDetails.teacherBranches.map((tb) => (
              <StatusBadge tone="info" key={tb.branchId}>
                {tb.branch?.name || `فرع ${tb.branchId}`}
              </StatusBadge>
            ))
          ) : (
            <Text size="xs" c="dimmed">
              كافة الفروع
            </Text>
          )}
        </Group>
      </Paper>
    </Stack>
  );
}
