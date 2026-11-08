'use client';

import { Group } from '@mantine/core';
import { IconFilterOff } from '@tabler/icons-react';
import { AppButton, AppSelect } from '@/src/components/controllers';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { studentsLabels } from '../static-data/students.data';
import { schoolsOfCity } from '../utils/student-references.utils';
import { StudentCustomFilters } from './StudentCustomFilters';
import type { StudentListFilters } from '../state/students.state';

const toValue = (id: number | null) => (id ? String(id) : null);

/**
 * StudentsFilters
 *
 * Status, bus, city, school, knowWay and custom fields filters.
 * ZERO useState hooks.
 */
export function StudentsFilters() {
  const filters = useStudentsMirror('filters');
  const options = useStudentsMirror('referenceOptions');
  const setFilter = useStudentsMirror('setFilter');
  const clearFilters = useStudentsMirror('clearFilters');

  const select = (field: keyof StudentListFilters) => (val: string | null) =>
    setFilter(field, (val ? Number(val) : null) as never);

  const availableSchools = schoolsOfCity(options.schools, filters.cityId);
  const hasActiveFilters =
    filters.statusId != null ||
    filters.busId != null ||
    filters.cityId != null ||
    filters.schoolId != null ||
    filters.knowWayId != null ||
    Object.keys(filters.customFilters || {}).length > 0;

  return (
    <Group gap="xs" wrap="wrap">
      <AppSelect
        placeholder={studentsLabels.filterStatus}
        data={options.statuses}
        value={toValue(filters.statusId)}
        onChange={select('statusId')}
        clearable
        size="sm"
        w={150}
      />
      <AppSelect
        placeholder={studentsLabels.filterBus}
        data={options.buses}
        value={toValue(filters.busId)}
        onChange={select('busId')}
        clearable
        size="sm"
        w={140}
      />
      <AppSelect
        placeholder={studentsLabels.filterCity}
        data={options.cities}
        value={toValue(filters.cityId)}
        onChange={select('cityId')}
        searchable
        clearable
        size="sm"
        w={140}
      />
      <AppSelect
        placeholder={studentsLabels.filterSchool}
        data={availableSchools}
        value={toValue(filters.schoolId)}
        onChange={select('schoolId')}
        searchable
        clearable
        size="sm"
        w={160}
      />
      <AppSelect
        placeholder={studentsLabels.filterKnowWay}
        data={options.knowWays}
        value={toValue(filters.knowWayId)}
        onChange={select('knowWayId')}
        searchable
        clearable
        size="sm"
        w={150}
      />
      <StudentCustomFilters />
      {hasActiveFilters && (
        <AppButton
          variant="ghost"
          size="sm"
          leftSection={<IconFilterOff size={16} stroke={1.5} />}
          onClick={clearFilters}
        >
          {studentsLabels.clearFilters}
        </AppButton>
      )}
    </Group>
  );
}
