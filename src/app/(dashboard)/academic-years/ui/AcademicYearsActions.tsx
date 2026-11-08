'use client';

import { IconPlus } from '@tabler/icons-react';
import { useAcademicYearsMirror } from '../store/useAcademicYearsMirror';
import { AppButton } from '@/src/components/controllers/button';

/**
 * AcademicYearsActions
 *
 * Header action buttons for the Academic Years page.
 * Pure presentation — reads actions from the mirror.
 */
export function AcademicYearsActions() {
  const openCreate = useAcademicYearsMirror('openCreate');

  return (
    <AppButton leftSection={<IconPlus size={16} />} onClick={openCreate}>
      إضافة سنة دراسية
    </AppButton>
  );
}
