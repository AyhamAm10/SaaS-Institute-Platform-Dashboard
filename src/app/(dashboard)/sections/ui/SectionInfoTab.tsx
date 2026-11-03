'use client';

import { Group, SimpleGrid, Stack, Text } from '@mantine/core';
import {
  IconBook,
  IconCalendar,
  IconCalendarTime,
  IconCoin,
  IconSchool,
  IconUsers,
} from '@tabler/icons-react';
import { AppDrawer, InfoTile, StatusBadge } from '@/src/components/controllers';
import { formatNumber } from '@/src/core/format';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { sectionDetailsLabels as labels } from '../static-data/sections.data';

/**
 * SectionInfoTab
 *
 * Basic section data and enrollment / plan metrics.
 * ZERO useState — reads useSectionsMirror.
 */
export function SectionInfoTab() {
  const details = useSectionsMirror('detailsData');
  const sectionSubjects = useSectionsMirror('sectionSubjectsData');

  if (!details) return null;

  return (
    <Stack gap="md">
      <AppDrawer.Section
        title={details.name}
        action={
          <StatusBadge tone="success" size="sm">
            {details.academicBranch?.name ?? details.grade}
          </StatusBadge>
        }
      >
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <Group gap="xs">
            <IconCalendar size={15} color="var(--app-text-muted)" />
            <Text size="xs" c="var(--app-text-muted)">
              {labels.academicYear}:
            </Text>
            <Text size="xs" fw={500}>
              {details.academicYear?.name ?? '—'}
            </Text>
          </Group>
          <Group gap="xs">
            <IconCoin size={15} color="var(--app-text-muted)" />
            <Text size="xs" c="var(--app-text-muted)">
              {labels.fee}:
            </Text>
            <Text size="xs" fw={500}>
              {formatNumber(details.feeAmount)} {labels.currency}
            </Text>
          </Group>
        </SimpleGrid>
      </AppDrawer.Section>

      <SimpleGrid cols={2} spacing="sm">
        <InfoTile
          tone="brand"
          icon={<IconUsers size={18} />}
          label={labels.students}
          value={details._count?.studentEnrollments ?? 0}
        />
        <InfoTile
          tone="ink"
          icon={<IconBook size={18} />}
          label={labels.subjects}
          value={sectionSubjects?.length ?? details._count?.sectionSubjects ?? 0}
        />
        <InfoTile
          tone="neutral"
          icon={<IconSchool size={18} />}
          label={labels.teachers}
          value={details._count?.sectionTeachers ?? 0}
        />
        <InfoTile
          tone="neutral"
          icon={<IconCalendarTime size={18} />}
          label={labels.timetables}
          value={details._count?.timetables ?? 0}
        />
      </SimpleGrid>
    </Stack>
  );
}
