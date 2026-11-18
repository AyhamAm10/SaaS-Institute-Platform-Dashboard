import { AppSurface, DetailList } from '@/src/components/controllers';
import type { SectionDetails } from '@/src/core/api';
import { formatMoney } from '@/src/core/format';
import { sectionDetailLabels as labels } from '../static-data/section-detail.data';

/** The section's own data. Props only. */
export function SectionOverviewTab({ section }: { section: SectionDetails }) {
  return (
    <AppSurface level={2} radius="lg" padding="md">
      <DetailList
        columns={2}
        items={[
          { label: labels.branch, value: section.branch?.name ?? '—' },
          { label: labels.year, value: section.academicYear?.name ?? '—' },
          { label: labels.academicBranch, value: section.academicBranch?.name ?? '—' },
          { label: labels.grade, value: section.grade || '—' },
          { label: labels.fee, value: formatMoney(section.feeAmount, section.feeCurrency ?? 'SYP') },
        ]}
      />
    </AppSurface>
  );
}
