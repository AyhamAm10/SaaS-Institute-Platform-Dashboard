'use client';

import { Box, Group, Paper, Stack, Text } from '@mantine/core';
import { IconGitBranch, IconTrash } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers';
import { StatusBadge } from '@/src/components/controllers/badge';
import { AppIconButton } from '@/src/components/controllers/button';
import { AcademicBranch } from '@/src/core/api';
import { useSectionsMirror } from '../store/useSectionsMirror';

interface AcademicBranchListProps {
  branches: AcademicBranch[];
  onDelete: (id: number, name: string) => Promise<void>;
}

/** Existing academic branches; a branch with sections cannot be deleted. */
export function AcademicBranchList({ branches, onDelete }: AcademicBranchListProps) {
  const setBranchError = useSectionsMirror('setBranchError');
  const branchSubmitting = useSectionsMirror('branchSubmitting');

  const handleDelete = async (branch: AcademicBranch) => {
    if (branch._count && branch._count.sections > 0) {
      setBranchError(`لا يمكن حذف الفرع "${branch.name}" لأنه مرتبط بشعب دراسية.`);
      return;
    }

    if (!window.confirm(`هل أنت متأكد من حذف الفرع الأكاديمي "${branch.name}"؟`)) {
      return;
    }

    await onDelete(branch.id, branch.name);
  };

  return (
    <AppDrawer.Section
      title={`الفروع الحالية (${branches.length})`}
      description="قائمة الفروع الأكاديمية المفعلة للمعهد"
    >
      <Stack gap="xs">
        {branches.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            لا توجد فروع أكاديمية مسجلة حاليا
          </Text>
        ) : (
          branches.map((b) => (
            <Paper
              key={b.id}
              withBorder
              p="sm"
              radius="md"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Group gap="sm">
                <IconGitBranch size={18} color="var(--app-success-text)" />
                <Box>
                  <Group gap={8} align="center">
                    <Text fw={500} size="sm">
                      {b.name}
                    </Text>
                    {b._count && b._count.sections > 0 && (
                      <StatusBadge tone="info" size="xs">
                        {b._count.sections} شعب
                      </StatusBadge>
                    )}
                  </Group>
                  {b.description && (
                    <Text size="xs" c="dimmed">
                      {b.description}
                    </Text>
                  )}
                </Box>
              </Group>

              <AppIconButton
                variant="danger"
                label="حذف الفرع"
                size="sm"
                disabled={Boolean(b._count && b._count.sections > 0)}
                loading={branchSubmitting}
                onClick={() => handleDelete(b)}
              >
                <IconTrash size={16} />
              </AppIconButton>
            </Paper>
          ))
        )}
      </Stack>
    </AppDrawer.Section>
  );
}
