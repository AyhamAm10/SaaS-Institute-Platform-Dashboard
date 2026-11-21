import type { Student, StudentIdentityTexts, StudentReferenceIds } from '@/src/core/api';

/** Links to the settings lists (the select fields). */
export type StudentReferenceField =
  | 'statusId'
  | 'knowWayId'
  | 'cityId'
  | 'schoolId'
  | 'busId'
  | 'nationalityId'
  | 'religionId'
  | 'languageId';

/** Official identity typed by hand (the text fields). */
export type StudentIdentityField = keyof StudentIdentityTexts;

/** Reference links + identity texts, edited in the wizard and the edit drawer. */
export type StudentReferenceValues = Record<StudentReferenceField, number | null> &
  Record<StudentIdentityField, string>;

export type StudentReferenceKey = keyof StudentReferenceValues;

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
  nationalities: ReferenceOption[];
  religions: ReferenceOption[];
  languages: ReferenceOption[];
  /** "أوضاع الطلاب": filter of the list (the value is set per enrollment). */
  situations: ReferenceOption[];
}

export const STUDENT_IDENTITY_FIELDS: StudentIdentityField[] = [
  'nationalId',
  'birthPlace',
  'civilRegistry',
  'foreignName',
  'grandfatherName',
  'address',
];

export const EMPTY_STUDENT_REFERENCES: StudentReferenceValues = {
  statusId: null,
  knowWayId: null,
  cityId: null,
  schoolId: null,
  busId: null,
  nationalityId: null,
  religionId: null,
  languageId: null,
  nationalId: '',
  birthPlace: '',
  civilRegistry: '',
  foreignName: '',
  grandfatherName: '',
  address: '',
};

export const EMPTY_REFERENCE_OPTIONS: StudentReferenceOptions = {
  statuses: [],
  knowWays: [],
  cities: [],
  schools: [],
  buses: [],
  nationalities: [],
  religions: [],
  languages: [],
  situations: [],
};

export function studentReferencesFrom(student: Student): StudentReferenceValues {
  const texts = Object.fromEntries(STUDENT_IDENTITY_FIELDS.map((k) => [k, student[k] ?? ''])) as Record<
    StudentIdentityField,
    string
  >;
  return {
    statusId: student.statusId ?? null,
    knowWayId: student.knowWayId ?? null,
    cityId: student.cityId ?? null,
    schoolId: student.schoolId ?? null,
    busId: student.busId ?? null,
    nationalityId: student.nationalityId ?? null,
    religionId: student.religionId ?? null,
    languageId: student.languageId ?? null,
    ...texts,
  };
}

/**
 * API payload of the links and identity texts. `null` clears a link or a text; the
 * status cannot be cleared, so it is only sent when chosen (the server applies the default).
 */
export function toReferencePayload(values: StudentReferenceValues): StudentReferenceIds & StudentIdentityTexts {
  const { statusId, ...rest } = values;
  const texts = Object.fromEntries(STUDENT_IDENTITY_FIELDS.map((k) => [k, rest[k].trim() || null]));
  return { ...rest, ...texts, ...(statusId && { statusId }) };
}

/** Schools of the chosen city (all schools when no city is chosen). */
export function schoolsOfCity<T extends { cityId?: number | null }>(schools: T[], cityId: number | null): T[] {
  return cityId ? schools.filter((s) => s.cityId == null || s.cityId === cityId) : schools;
}
