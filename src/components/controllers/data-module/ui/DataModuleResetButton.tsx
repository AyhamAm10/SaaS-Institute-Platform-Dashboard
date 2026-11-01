'use client';

import { IconFilterOff } from '@tabler/icons-react';
import { AppButton } from '../../button';
import { useDataModuleMirror } from '../store/useDataModuleMirror';

export interface DataModuleResetButtonProps {
  label?: string;
}

export function DataModuleResetButton({ label = 'إعادة ضبط' }: DataModuleResetButtonProps) {
  const resetFilters = useDataModuleMirror('resetFilters');
  const search = useDataModuleMirror('search');
  const filters = useDataModuleMirror('filters');

  const hasActiveFilters = Boolean(
    search || (filters && Object.values(filters).some((v) => v !== undefined && v !== '' && v !== null)),
  );

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <AppButton variant="ghost" size="xs" leftSection={<IconFilterOff size={14} />} onClick={resetFilters}>
      {label}
    </AppButton>
  );
}
