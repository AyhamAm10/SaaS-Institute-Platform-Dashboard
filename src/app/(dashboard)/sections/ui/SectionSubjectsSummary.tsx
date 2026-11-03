'use client';

import { SimpleGrid } from '@mantine/core';
import { IconBook, IconClock, IconUserQuestion } from '@tabler/icons-react';
import { InfoTile } from '@/src/components/controllers';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { sectionDetailsLabels } from '../static-data/sections.data';

/**
 * SectionSubjectsSummary
 *
 * At-a-glance totals of the section plan: subjects, weekly periods and
 * subjects still without a teacher. ZERO useState — reads useSectionsMirror.
 */
export function SectionSubjectsSummary() {
  const sectionSubjects = useSectionsMirror('sectionSubjectsData') ?? [];

  const totalPeriods = sectionSubjects.reduce((sum, s) => sum + (s.weeklyPeriods || 0), 0);
  const withoutTeacher = sectionSubjects.filter((s) => !s.teacher).length;

  return (
    <SimpleGrid cols={3} spacing="sm">
      <InfoTile
        tone="brand"
        icon={<IconBook size={18} />}
        label={sectionDetailsLabels.summarySubjects}
        value={sectionSubjects.length}
      />
      <InfoTile
        tone="ink"
        icon={<IconClock size={18} />}
        label={sectionDetailsLabels.summaryPeriods}
        value={totalPeriods}
      />
      <InfoTile
        tone={withoutTeacher > 0 ? 'danger' : 'success'}
        icon={<IconUserQuestion size={18} />}
        label={sectionDetailsLabels.summaryNoTeacher}
        value={withoutTeacher}
      />
    </SimpleGrid>
  );
}
