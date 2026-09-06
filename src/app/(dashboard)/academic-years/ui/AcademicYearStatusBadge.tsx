'use client';

import { Badge } from '@mantine/core';

export interface AcademicYearStatusBadgeProps {
  isCurrent: boolean;
}

export function AcademicYearStatusBadge({ isCurrent }: AcademicYearStatusBadgeProps) {
  if (isCurrent) {
    return (
      <Badge
        color="teal"
        variant="light"
        radius="xl"
        size="sm"
        fw={600}
      >
        السنة الحالية النشطة
      </Badge>
    );
  }

  return (
    <Badge
      color="gray"
      variant="light"
      radius="xl"
      size="sm"
      fw={500}
    >
      غير نشطة
    </Badge>
  );
}
