import { SimpleGrid } from '@mantine/core';
import { IconBook, IconCalendarWeek, IconUsers, IconUserStar } from '@tabler/icons-react';
import { InfoTile } from '@/src/components/controllers';
import type { SectionDetails } from '@/src/core/api';
import { formatNumber } from '@/src/core/format';
import { sectionDetailLabels as labels } from '../static-data/section-detail.data';

/** Counters strip under the section header. Props only. */
export function SectionSummary({ section }: { section: SectionDetails }) {
  const c = section._count;
  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
      <InfoTile label={labels.students} value={formatNumber(c.studentEnrollments)} icon={<IconUsers size={18} />} />
      <InfoTile label={labels.subjects} value={formatNumber(c.sectionSubjects)} icon={<IconBook size={18} />} />
      <InfoTile label={labels.teachers} value={formatNumber(c.sectionTeachers)} icon={<IconUserStar size={18} />} />
      <InfoTile
        label={labels.timetables}
        value={formatNumber(c.timetables)}
        icon={<IconCalendarWeek size={18} />}
      />
    </SimpleGrid>
  );
}
