'use client';

import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useAcademicYearsMirror } from '../store/useAcademicYearsMirror';

/**
 * AcademicYearsActions
 *
 * Header action buttons for the Academic Years page.
 * Pure presentation — reads actions from the mirror.
 */
export function AcademicYearsActions() {
  const openCreate = useAcademicYearsMirror('openCreate');

  return (
    <Button
      color="primary"
      radius="xl"
      leftSection={<IconPlus size={16} />}
      onClick={openCreate}
    >
      إضافة سنة دراسية
    </Button>
  );
}
