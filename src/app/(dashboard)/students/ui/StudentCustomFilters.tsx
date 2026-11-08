'use client';

import { AppSelect } from '@/src/components/controllers';
import { useStudentsMirror } from '../store/useStudentsMirror';

const BOOLEAN_SELECT_OPTIONS = [
  { value: 'true', label: 'نعم' },
  { value: 'false', label: 'لا' },
];

/**
 * StudentCustomFilters
 *
 * Renders active, filterable custom fields (SELECT & BOOLEAN) in the student list filter slot.
 * ZERO useState hooks.
 */
export function StudentCustomFilters() {
  const studentFields = useStudentsMirror('studentFields');
  const filters = useStudentsMirror('filters');
  const setCustomFilter = useStudentsMirror('setCustomFilter');

  const filterable = (studentFields || []).filter((f) => f.isActive && f.isFilterable);
  if (filterable.length === 0) return null;

  return (
    <>
      {filterable.map((field) => {
        if (field.type === 'SELECT') {
          const selectData = (field.options || []).map((opt) => ({ value: opt, label: opt }));
          const currentValue = (filters.customFilters[field.name] as string) || null;
          return (
            <AppSelect
              key={field.name}
              placeholder={field.label}
              data={selectData}
              value={currentValue}
              onChange={(val: string | null) => setCustomFilter(field.name, val || null)}
              clearable
              size="sm"
              w={150}
            />
          );
        }

        if (field.type === 'BOOLEAN') {
          const rawValue = filters.customFilters[field.name];
          const currentValue = rawValue === true ? 'true' : rawValue === false ? 'false' : null;
          return (
            <AppSelect
              key={field.name}
              placeholder={field.label}
              data={BOOLEAN_SELECT_OPTIONS}
              value={currentValue}
              onChange={(val: string | null) =>
                setCustomFilter(field.name, val === 'true' ? true : val === 'false' ? false : null)
              }
              clearable
              size="sm"
              w={130}
            />
          );
        }

        return null;
      })}
    </>
  );
}

