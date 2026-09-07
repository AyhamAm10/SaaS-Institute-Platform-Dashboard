'use client';

import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconGitBranch,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { AppDrawer, AppInput } from '@/src/components/controllers';
import { AcademicBranch } from '@/src/core/api';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { sectionFormLabels } from '../static-data/sections.data';

export interface AcademicBranchesDrawerProps {
  opened: boolean;
  onClose: () => void;
  branches: AcademicBranch[];
  onCreate: () => Promise<void>;
  onDelete: (id: number, name: string) => Promise<void>;
}

/**
 * AcademicBranchesDrawer
 *
 * Pure presentation layer component adhering strictly to role.md.
 * ZERO internal useState hooks.
 * Reads form state, loading flags, errors, and actions exclusively from useSectionsMirror.
 */
export function AcademicBranchesDrawer({
  opened,
  onClose,
  branches = [],
  onCreate,
  onDelete,
}: AcademicBranchesDrawerProps) {
  const branchForm = useSectionsMirror('branchForm');
  const setBranchFormField = useSectionsMirror('setBranchFormField');
  const branchError = useSectionsMirror('branchError');
  const setBranchError = useSectionsMirror('setBranchError');
  const branchSuccess = useSectionsMirror('branchSuccess');
  const setBranchSuccess = useSectionsMirror('setBranchSuccess');
  const branchSubmitting = useSectionsMirror('branchSubmitting');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate();
  };

  const handleDelete = async (branch: AcademicBranch) => {
    if (branch._count && branch._count.sections > 0) {
      setBranchError(`لا يمكن حذف الفرع "${branch.name}" لأنه مرتبط بشُعب دراسية.`);
      return;
    }

    if (!window.confirm(`هل أنت متأكد من حذف الفرع الأكاديمي "${branch.name}"؟`)) {
      return;
    }

    await onDelete(branch.id, branch.name);
  };

  return (
    <AppDrawer opened={opened} onClose={onClose} size="lg">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconGitBranch size={20} />} color="teal" />
        <AppDrawer.Title>{sectionFormLabels.branchesManagement}</AppDrawer.Title>
        <AppDrawer.Description>
          عرض وإدارة الفروع والمسارات الأكاديمية الخاصة بالمعهد (مثل العلمي، الأدبي، المهني)
        </AppDrawer.Description>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        <Stack gap="lg">
          {branchError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              radius="md"
              withCloseButton
              onClose={() => setBranchError(null)}
            >
              {branchError}
            </Alert>
          )}

          {branchSuccess && (
            <Alert
              icon={<IconCheck size={16} />}
              color="teal"
              variant="light"
              radius="md"
              withCloseButton
              onClose={() => setBranchSuccess(null)}
            >
              {branchSuccess}
            </Alert>
          )}

          {/* Form to add new branch */}
          <AppDrawer.Section
            title={sectionFormLabels.branchCreateTitle}
            description="أنشئ فرعاً أو مرحلة جديدة لمعهدك لتوزيع الشُعب عليها"
          >
            <form onSubmit={handleCreate}>
              <Stack gap="sm">
                <AppInput
                  type="text"
                  label={sectionFormLabels.branchName}
                  placeholder={sectionFormLabels.branchNamePlaceholder}
                  value={branchForm.name}
                  onChange={(e) =>
                    setBranchFormField(
                      'name',
                      typeof e === 'string' ? e : (e as any)?.target?.value ?? '',
                    )
                  }
                  required
                />

                <Group grow>
                  <AppInput
                    type="text"
                    label={sectionFormLabels.branchCode}
                    placeholder={sectionFormLabels.branchCodePlaceholder}
                    value={branchForm.code}
                    onChange={(e) =>
                      setBranchFormField(
                        'code',
                        typeof e === 'string' ? e : (e as any)?.target?.value ?? '',
                      )
                    }
                  />
                  <AppInput
                    type="text"
                    label={sectionFormLabels.branchDescription}
                    placeholder={sectionFormLabels.branchDescriptionPlaceholder}
                    value={branchForm.description}
                    onChange={(e) =>
                      setBranchFormField(
                        'description',
                        typeof e === 'string' ? e : (e as any)?.target?.value ?? '',
                      )
                    }
                  />
                </Group>

                <Group justify="flex-end" mt="xs">
                  <Button
                    type="submit"
                    color="teal"
                    radius="xl"
                    size="sm"
                    loading={branchSubmitting}
                    leftSection={<IconPlus size={16} />}
                  >
                    إضافة الفرع
                  </Button>
                </Group>
              </Stack>
            </form>
          </AppDrawer.Section>

          <Divider />

          {/* Existing branches list */}
          <AppDrawer.Section
            title={`الفروع الحالية (${branches.length})`}
            description="قائمة الفروع الأكاديمية المفعلة للمعهد"
          >
            <Stack gap="xs">
              {branches.length === 0 ? (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  لا توجد فروع أكاديمية مسجلة حالياً
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
                      <IconGitBranch size={18} color="teal" />
                      <div>
                        <Group gap={8} align="center">
                          <Text fw={600} size="sm">
                            {b.name}
                          </Text>
                          {b.code && (
                            <Badge size="xs" variant="outline" color="gray">
                              {b.code}
                            </Badge>
                          )}
                          {b._count && b._count.sections > 0 && (
                            <Badge size="xs" variant="light" color="blue">
                              {b._count.sections} شُعب
                            </Badge>
                          )}
                        </Group>
                        {b.description && (
                          <Text size="xs" c="dimmed">
                            {b.description}
                          </Text>
                        )}
                      </div>
                    </Group>

                    <Tooltip label="حذف الفرع">
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        radius="xl"
                        size="sm"
                        disabled={Boolean(b._count && b._count.sections > 0)}
                        loading={branchSubmitting}
                        onClick={() => handleDelete(b)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Paper>
                ))
              )}
            </Stack>
          </AppDrawer.Section>
        </Stack>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel onClick={onClose}>إغلاق</AppDrawer.Cancel>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
