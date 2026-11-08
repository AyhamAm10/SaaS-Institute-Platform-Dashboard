'use client';

import { StatusBadge } from '@/src/components/controllers/badge';

export interface AcademicYearStatusBadgeProps {
  isCurrent: boolean;
}

export function AcademicYearStatusBadge({ isCurrent }: AcademicYearStatusBadgeProps) {
  if (isCurrent) {
    return (
      <StatusBadge tone="success" size="sm">
        السنة الحالية النشطة
      </StatusBadge>
    );
  }

  return (
    <StatusBadge tone="neutral" size="sm">
      غير نشطة
    </StatusBadge>
  );
}
