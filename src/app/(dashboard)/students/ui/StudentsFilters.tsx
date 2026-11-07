'use client';

import { Group } from '@mantine/core';
import { AppSelect } from '@/src/components/controllers';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { StudentListFilters } from '../state/students.state';
import { studentsLabels } from '../static-data/students.data';

const toValue = (id: number | null) => (id ? String(id) : null);

/**
 * StudentsFilters
 *
 * Status / bus / city filters of the students list (DataModuleController.FilterSlot).
 * ZERO useState hooks.
 */
export function StudentsFilters() {
  const filters = useStudentsMirror('filters');
  const options = useStudentsMirror('referenceOptions');
  const yearOptions = useStudentsMirror('yearOptions');
  const setFilter = useStudentsMirror('setFilter');

  const select = (field: keyof StudentListFilters) => (val: string | null) =>
    setFilter(field, val ? Number(val) : null);

  return (
    <Group gap="xs" wrap="wrap">
      <AppSelect
        placeholder={studentsLabels.filterStatus}
        data={options.statuses}
        value={toValue(filters.statusId)}
        onChange={select('statusId')}
        clearable
        size="sm"
        w={170}
      />
      <AppSelect
        placeholder={studentsLabels.filterBus}
        data={options.buses}
        value={toValue(filters.busId)}
        onChange={select('busId')}
        clearable
        size="sm"
        w={150}
      />
      <AppSelect
        placeholder={studentsLabels.filterCity}
        data={options.cities}
        value={toValue(filters.cityId)}
        onChange={select('cityId')}
        searchable
        clearable
        size="sm"
        w={150}
      />
      <AppSelect
        placeholder={studentsLabels.filterUnassigned}
        data={yearOptions}
        value={toValue(filters.unassignedYearId)}
        onChange={select('unassignedYearId')}
        clearable
        size="sm"
        w={210}
      />
    </Group>
  );
}
