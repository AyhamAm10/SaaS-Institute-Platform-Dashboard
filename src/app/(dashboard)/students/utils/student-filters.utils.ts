import type { StudentQueryParams } from '@/src/core/api';
import type { StudentListFilters } from '../state/students.state';

/** The list filters as API query parameters (empty ones left out). */
export function filtersToQuery(filters: StudentListFilters): StudentQueryParams {
  const customFilters =
    Object.keys(filters.customFilters || {}).length > 0 ? JSON.stringify(filters.customFilters) : undefined;
  return {
    statusId: filters.statusId ?? undefined,
    busId: filters.busId ?? undefined,
    cityId: filters.cityId ?? undefined,
    schoolId: filters.schoolId ?? undefined,
    knowWayId: filters.knowWayId ?? undefined,
    nationalityId: filters.nationalityId ?? undefined,
    religionId: filters.religionId ?? undefined,
    languageId: filters.languageId ?? undefined,
    situationId: filters.situationId ?? undefined,
    gender: filters.gender ?? undefined,
    examCandidate: filters.examCandidate ?? undefined,
    customFilters,
  };
}

/** Whether any filter is set (shows the "clear filters" button). */
export function hasActiveFilters(filters: StudentListFilters): boolean {
  const { customFilters, ...rest } = filters;
  return Object.values(rest).some((v) => v != null) || Object.keys(customFilters || {}).length > 0;
}
