import type { Student, StudentReferenceIds } from '@/src/core/api';

export type StudentReferenceField = 'statusId' | 'knowWayId' | 'cityId' | 'schoolId' | 'busId';

/** Reference-data links edited in the wizard and the edit drawer. */
export type StudentReferenceValues = Record<StudentReferenceField, number | null>;

export interface ReferenceOption {
  value: string;
  label: string;
}

export interface SchoolOption extends ReferenceOption {
  cityId: number | null;
}

/** Select options of every reference table a student links to. */
export interface StudentReferenceOptions {
  statuses: ReferenceOption[];
  knowWays: ReferenceOption[];
  cities: ReferenceOption[];
  schools: SchoolOption[];
  buses: ReferenceOption[];
}

export const EMPTY_STUDENT_REFERENCES: StudentReferenceValues = {
  statusId: null,
  knowWayId: null,
  cityId: null,
  schoolId: null,
  busId: null,
};

export const EMPTY_REFERENCE_OPTIONS: StudentReferenceOptions = {
  statuses: [],
  knowWays: [],
  cities: [],
  schools: [],
  buses: [],
};

export function studentReferencesFrom(student: Student): StudentReferenceValues {
  return {
    statusId: student.statusId ?? null,
    knowWayId: student.knowWayId ?? null,
    cityId: student.cityId ?? null,
    schoolId: student.schoolId ?? null,
    busId: student.busId ?? null,
  };
}

/**
 * API payload of the links. `null` clears a link; the status cannot be
 * cleared, so it is only sent when chosen (the server applies the default).
 */
export function toReferencePayload(values: StudentReferenceValues): StudentReferenceIds {
  const { statusId, ...links } = values;
  return { ...links, ...(statusId && { statusId }) };
}

/** Schools of the chosen city (all schools when no city is chosen). */
export function schoolsOfCity(schools: SchoolOption[], cityId: number | null): SchoolOption[] {
  return cityId ? schools.filter((s) => s.cityId === null || s.cityId === cityId) : schools;
}
