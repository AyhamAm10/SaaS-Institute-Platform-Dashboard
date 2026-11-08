'use client';

import { SimpleGrid } from '@mantine/core';
import { AppSelect } from '@/src/components/controllers';
import { useWorkspaceMirror } from '../store/report-workspace.store';

const BOOLEAN_OPTIONS = [
  { value: 'true', label: 'نعم' },
  { value: 'false', label: 'لا' },
];

export interface ReportCustomFiltersFieldProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

/**
 * ReportCustomFiltersField
 *
 * Renders filterable custom field selectors for reports that accept customFilters (e.g. students-directory).
 * Serializes choices into a single JSON string.
 */
export function ReportCustomFiltersField({ value, onChange }: ReportCustomFiltersFieldProps) {
  const studentFields = useWorkspaceMirror('studentFields');
  const filterable = (studentFields || []).filter((f) => f.isActive && f.isFilterable);

  if (filterable.length === 0) return null;

  let parsed: Record<string, unknown> = {};
  try {
    if (value) parsed = JSON.parse(value);
  } catch {
    parsed = {};
  }

  const updateField = (key: string, val: unknown) => {
    const next = { ...parsed };
    if (val === null || val === undefined || val === '') {
      delete next[key];
    } else {
      next[key] = val;
    }
    onChange(Object.keys(next).length > 0 ? JSON.stringify(next) : null);
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
      {filterable.map((field) => {
        if (field.type === 'SELECT') {
          const selectData = (field.options || []).map((opt) => ({ value: opt, label: opt }));
          const currentVal = (parsed[field.name] as string) || null;
          return (
            <AppSelect
              key={field.name}
              label={field.label}
              placeholder="الكل"
              data={selectData}
              value={currentVal}
              onChange={(val: string | null) => updateField(field.name, val || null)}
              clearable
            />
          );
        }

        if (field.type === 'BOOLEAN') {
          const raw = parsed[field.name];
          const currentVal = raw === true ? 'true' : raw === false ? 'false' : null;
          return (
            <AppSelect
              key={field.name}
              label={field.label}
              placeholder="الكل"
              data={BOOLEAN_OPTIONS}
              value={currentVal}
              onChange={(val: string | null) =>
                updateField(field.name, val === 'true' ? true : val === 'false' ? false : null)
              }
              clearable
            />
          );
        }

        return null;
      })}
    </SimpleGrid>
  );
}

