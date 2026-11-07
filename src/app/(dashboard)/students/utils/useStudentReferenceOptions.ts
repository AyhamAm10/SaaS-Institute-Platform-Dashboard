'use client';

import { useMemo } from 'react';
import {
  busesResource,
  citiesResource,
  knowWaysResource,
  schoolsResource,
  studentStatusesResource,
} from '@/src/core/api';
import type { StudentReferenceOptions } from './student-references.utils';

const ALL = { limit: 100 };

/**
 * Loads the reference tables a student links to as select options.
 * For Controllers / QuerySync components only (role.md: data access stays
 * out of `ui/`). Buses are those of the active branch.
 */
export function useStudentReferenceOptions(enabled = true): StudentReferenceOptions {
  const statuses = studentStatusesResource.useList(ALL, enabled).data?.data;
  const knowWays = knowWaysResource.useList(ALL, enabled).data?.data;
  const cities = citiesResource.useList(ALL, enabled).data?.data;
  const schools = schoolsResource.useList(ALL, enabled).data?.data;
  const buses = busesResource.useList(ALL, enabled).data?.data;

  return useMemo(
    () => ({
      statuses: (statuses ?? [])
        .filter((s) => s.isActive)
        .map((s) => ({ value: String(s.id), label: s.isDefault ? `${s.name} (افتراضية)` : s.name })),
      knowWays: (knowWays ?? []).map((k) => ({ value: String(k.id), label: k.name })),
      cities: (cities ?? []).map((c) => ({ value: String(c.id), label: c.name })),
      schools: (schools ?? []).map((s) => ({
        value: String(s.id),
        label: s.name,
        cityId: s.cityId ?? null,
      })),
      buses: (buses ?? [])
        .filter((b) => b.isActive)
        .map((b) => ({ value: String(b.id), label: b.name })),
    }),
    [statuses, knowWays, cities, schools, buses],
  );
}
