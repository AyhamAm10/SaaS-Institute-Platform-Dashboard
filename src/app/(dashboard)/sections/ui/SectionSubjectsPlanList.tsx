'use client';

import { Center, Group, Loader, Stack, Text } from '@mantine/core';
import { IconBook, IconTrash, IconUser } from '@tabler/icons-react';
import {
  AppDrawer,
  AppEmptyState,
  AppIconButton,
  AppSurface,
  IconTile,
  StatusBadge,
} from '@/src/components/controllers';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { sectionDetailsLabels as labels } from '../static-data/sections.data';
import { formatWeeklyPeriods } from '../utils/section-subjects.utils';

export interface SectionSubjectsPlanListProps {
  onRemove?: (subjectId: number) => Promise<void>;
}

/**
 * SectionSubjectsPlanList
 *
 * The section's curriculum: one row per subject with its teacher and weekly
 * periods. ZERO useState — reads useSectionsMirror.
 */
export function SectionSubjectsPlanList({ onRemove }: SectionSubjectsPlanListProps) {
  const sectionSubjects = useSectionsMirror('sectionSubjectsData') ?? [];
  const isLoading = useSectionsMirror('isLoadingSectionSubjects');
  const isRemovingSubjectId = useSectionsMirror('isRemovingSubjectId');

  return (
    <AppDrawer.Section
      title={labels.planTitle}
      description={labels.planDescription}
      action={<StatusBadge size="xs">{sectionSubjects.length}</StatusBadge>}
    >
      {isLoading ? (
        <Center py="lg">
          <Loader size="sm" color="primary" />
        </Center>
      ) : sectionSubjects.length === 0 ? (
        <AppEmptyState
          compact
          icon={<IconBook size={22} stroke={1.5} />}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
        />
      ) : (
        <Stack gap="xs">
          {sectionSubjects.map((item) => (
            <AppSurface key={item.id} level={2} radius="md" padding="sm">
              <Group justify="space-between" wrap="nowrap" gap="sm">
                <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                  <IconTile tone="brand" size={38}>
                    <IconBook size={18} />
                  </IconTile>
                  <Stack gap={2} style={{ minWidth: 0 }}>
                    <Text size="sm" fw={500} truncate>
                      {item.subject?.name}
                    </Text>
                    {item.teacher?.user?.fullName ? (
                      <Group gap={4} wrap="nowrap">
                        <IconUser size={12} color="var(--app-text-muted)" />
                        <Text size="xs" c="var(--app-text-muted)" truncate>
                          {item.teacher.user.fullName}
                        </Text>
                      </Group>
                    ) : (
                      <StatusBadge tone="warning" variant="dot" size="xs">
                        {labels.noTeacher}
                      </StatusBadge>
                    )}
                  </Stack>
                </Group>

                <Group gap="xs" wrap="nowrap">
                  <StatusBadge tone="ink" size="sm">
                    {formatWeeklyPeriods(item.weeklyPeriods || 1)}
                  </StatusBadge>
                  {onRemove && (
                    <AppIconButton
                      variant="danger"
                      size="sm"
                      label={labels.removeSubject}
                      onClick={() => onRemove(item.subjectId)}
                      loading={isRemovingSubjectId === item.subjectId}
                    >
                      <IconTrash size={15} />
                    </AppIconButton>
                  )}
                </Group>
              </Group>
            </AppSurface>
          ))}
        </Stack>
      )}
    </AppDrawer.Section>
  );
}
