import { AppSurface, DetailList } from '@/src/components/controllers';
import type { FamilyDetails } from '@/src/core/api';
import { formatNumber } from '@/src/core/format';
import { familyDetailLabels as labels } from '../static-data/family-detail.data';

/** The family's own data. Props only. */
export function FamilyInfoTab({ family }: { family: FamilyDetails }) {
  return (
    <AppSurface level={2} radius="lg" padding="md">
      <DetailList
        columns={2}
        items={[
          { label: labels.father, value: family.fatherName || '—' },
          { label: labels.mother, value: family.motherName || '—' },
          { label: labels.phone, value: family.phone || '—' },
          { label: labels.studentsCount, value: formatNumber(family.students.length) },
        ]}
      />
    </AppSurface>
  );
}
