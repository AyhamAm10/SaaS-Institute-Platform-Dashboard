import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { PaginatedResponse } from './types';
import type { StatusTone } from './reference-data.api';

// ---------------------------------------------------------------------------
// Types & Models
// ---------------------------------------------------------------------------

export interface Family {
  id: number;
  instituteId: number;
  familyName: string;
  fatherName?: string | null;
  motherName?: string | null;
  phone?: string | null;
  fatherJob?: string | null;
  motherJob?: string | null;
  fatherPhone?: string | null;
  motherPhone?: string | null;
  _count?: {
    students?: number;
  };
}

export interface StudentField {
  id: number;
  instituteId: number;
  name: string;
  label: string;
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'BOOLEAN';
  options?: string[] | null;
  isRequired: boolean;
  displayInReport: boolean;
  isFilterable?: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface StudentEnrollmentItem {
  id: number;
  sectionId: number;
  academicYearId: number;
  status: string;
  section?: {
    id: number;
    name: string;
    grade?: string | null;
  };
  academicYear?: {
    id: number;
    name: string;
    isCurrent: boolean;
  };
  /** Yearly data (see EnrollmentDetails). */
  situation?: NamedRef | null;
  examLanguage?: NamedRef | null;
  isExamCandidate?: boolean;
  candidateNumber?: string | null;
  previousSchool?: string | null;
  transferredFrom?: string | null;
  certificateName?: string | null;
  certificateNumber?: string | null;
  certificateDate?: string | null;
  certificateSource?: string | null;
  certificateGrade?: string | null;
}

/** Reference-data links of a student; `null` clears a link (except the status). */
export interface StudentReferenceIds {
  cityId?: number | null;
  schoolId?: number | null;
  busId?: number | null;
  knowWayId?: number | null;
  statusId?: number | null;
  /** Official lists (settings). */
  nationalityId?: number | null;
  religionId?: number | null;
  languageId?: number | null;
}

/** Official identity texts of a student (all optional; empty = not set). */
export interface StudentIdentityTexts {
  nationalId?: string | null;
  birthPlace?: string | null;
  civilRegistry?: string | null;
  foreignName?: string | null;
  grandfatherName?: string | null;
  address?: string | null;
}

interface NamedRef {
  id: number;
  name: string;
}

export interface Student extends StudentReferenceIds, StudentIdentityTexts {
  id: number;
  instituteId: number;
  branchId?: number | null;
  familyId: number;
  fullName: string;
  birthDate: string;
  gender: string;
  customFields?: Record<string, unknown>;
  createdAt: string;
  family?: Family;
  branch?: {
    id: number;
    name: string;
  } | null;
  studentEnrollments?: StudentEnrollmentItem[];
  city?: NamedRef | null;
  school?: NamedRef | null;
  bus?: NamedRef | null;
  knowWay?: NamedRef | null;
  status?: (NamedRef & { tone: StatusTone }) | null;
  nationality?: NamedRef | null;
  religion?: NamedRef | null;
  language?: NamedRef | null;
}

export interface CreateFamilyPayload {
  familyName: string;
  fatherName?: string;
  motherName?: string;
  phone?: string;
  fatherJob?: string;
  motherJob?: string;
  fatherPhone?: string;
  motherPhone?: string;
}

export interface CreateStudentPayload extends StudentReferenceIds, StudentIdentityTexts {
  fullName: string;
  birthDate: string;
  gender: string;
  branchId?: number;
  familyId?: number;
  newFamily?: CreateFamilyPayload;
  sectionId?: number;
  customFields?: Record<string, unknown>;
}

export type UpdateFamilyPayload = Partial<CreateFamilyPayload>;

export interface UpdateStudentPayload extends StudentReferenceIds, StudentIdentityTexts {
  fullName?: string;
  birthDate?: string;
  gender?: string;
  branchId?: number;
  familyId?: number;
  customFields?: Record<string, unknown>;
}

/** Records attached to a student — shown before a (soft) delete. */
export interface StudentDeletionReport {
  studentId: number;
  enrollments: number;
  examResults: number;
  attendance: number;
  subscriptions: number;
  payments: number;
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sectionId?: number;
  familyId?: number;
  statusId?: number;
  busId?: number;
  cityId?: number;
  schoolId?: number;
  knowWayId?: number;
  nationalityId?: number;
  religionId?: number;
  languageId?: number;
  /** This year's enrollment: situation and official exam candidacy. */
  situationId?: number;
  examCandidate?: boolean;
  gender?: 'MALE' | 'FEMALE';
  customFilters?: string;
  /** Only students without an enrollment in the header (context) year. */
  unassigned?: boolean;
}

// ---------------------------------------------------------------------------
// Query Keys
// ---------------------------------------------------------------------------

export const studentsKeys = {
  all: ['students'] as const,
  lists: () => [...studentsKeys.all, 'list'] as const,
  list: (params: StudentQueryParams) => [...studentsKeys.lists(), params] as const,
  detail: (id: number) => [...studentsKeys.all, 'detail', id] as const,
  deletionReport: (id: number) => [...studentsKeys.all, 'deletion-report', id] as const,
  fields: (includeInactive?: boolean) => ['student-fields', { includeInactive }] as const,
  families: (search?: string) => ['families', { search }] as const,
};

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

export async function getStudents(
  params: StudentQueryParams = {},
): Promise<PaginatedResponse<Student>> {
  const { data } = await apiClient.get<PaginatedResponse<Student>>('/students', {
    params,
  });
  return data;
}

export async function getStudentById(id: number): Promise<Student> {
  const { data } = await apiClient.get<Student>(`/students/${id}`);
  return data;
}

export async function createStudent(payload: CreateStudentPayload): Promise<Student> {
  const { data } = await apiClient.post<Student>('/students', payload);
  return data;
}

export async function updateStudent(
  id: number,
  payload: UpdateStudentPayload,
): Promise<Student> {
  const { data } = await apiClient.patch<Student>(`/students/${id}`, payload);
  return data;
}

export async function deleteStudent(id: number): Promise<void> {
  await apiClient.delete(`/students/${id}`);
}

export async function getStudentDeletionReport(id: number): Promise<StudentDeletionReport> {
  const { data } = await apiClient.get<StudentDeletionReport>(
    `/students/${id}/deletion-report`,
  );
  return data;
}

export async function getStudentFields(includeInactive = false): Promise<StudentField[]> {
  const { data } = await apiClient.get<StudentField[]>('/student-fields', {
    params: { includeInactive: String(includeInactive) },
  });
  return Array.isArray(data) ? data : [];
}

export async function createStudentField(
  payload: Omit<StudentField, 'id' | 'instituteId' | 'isActive'>,
): Promise<StudentField> {
  const { data } = await apiClient.post<StudentField>('/student-fields', payload);
  return data;
}

export async function updateStudentField({
  id,
  payload,
}: {
  id: number;
  payload: Partial<StudentField>;
}): Promise<StudentField> {
  const { data } = await apiClient.put<StudentField>(`/student-fields/${id}`, payload);
  return data;
}

export async function deleteStudentField(id: number): Promise<StudentField> {
  const { data } = await apiClient.delete<StudentField>(`/student-fields/${id}`);
  return data;
}

export async function searchFamilies(search?: string): Promise<Family[]> {
  const { data } = await apiClient.get<Family[]>('/families', {
    params: search ? { search } : undefined,
  });
  return Array.isArray(data) ? data : [];
}

export async function createFamily(payload: CreateFamilyPayload): Promise<Family> {
  const { data } = await apiClient.post<Family>('/families', payload);
  return data;
}

export async function updateFamily(
  id: number,
  payload: UpdateFamilyPayload,
): Promise<Family> {
  const { data } = await apiClient.patch<Family>(`/families/${id}`, payload);
  return data;
}

export async function deleteFamily(id: number): Promise<void> {
  await apiClient.delete(`/families/${id}`);
}

// ---------------------------------------------------------------------------
// React Query Hooks
// ---------------------------------------------------------------------------

export function useStudentsQuery(params: StudentQueryParams = {}) {
  return useQuery({
    queryKey: studentsKeys.list(params),
    queryFn: () => getStudents(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useStudentDetailQuery(id: number) {
  return useQuery({
    queryKey: studentsKeys.detail(id),
    queryFn: () => getStudentById(id),
    enabled: Boolean(id),
  });
}

export function useCreateStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
  });
}

export function useUpdateStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateStudentPayload }) =>
      updateStudent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
  });
}

export function useDeleteStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: (_data, id) => {
      // The student is gone: drop its cached detail/report instead of refetching them (404)
      queryClient.removeQueries({ queryKey: studentsKeys.detail(id) });
      queryClient.removeQueries({ queryKey: studentsKeys.deletionReport(id) });
      queryClient.invalidateQueries({ queryKey: studentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
  });
}

export function useStudentDeletionReportQuery(id: number | null) {
  return useQuery({
    queryKey: studentsKeys.deletionReport(id ?? 0),
    queryFn: () => getStudentDeletionReport(id!),
    enabled: Boolean(id),
  });
}

export function useStudentFieldsQuery(includeInactive = false) {
  return useQuery({
    queryKey: studentsKeys.fields(includeInactive),
    queryFn: () => getStudentFields(includeInactive),
  });
}

export function useCreateStudentFieldMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudentField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-fields'] });
    },
  });
}

export function useUpdateStudentFieldMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-fields'] });
    },
  });
}

export function useDeleteStudentFieldMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudentField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-fields'] });
    },
  });
}

export function useFamiliesSearchQuery(search?: string, enabled = true) {
  return useQuery({
    queryKey: studentsKeys.families(search),
    queryFn: () => searchFamilies(search),
    staleTime: 30000,
    enabled,
  });
}

export function useCreateFamilyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFamily,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
  });
}

export function useUpdateFamilyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateFamilyPayload }) =>
      updateFamily(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
    },
  });
}

export function useDeleteFamilyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFamily(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
    },
  });
}

// ---------------------------------------------------------------------------
// Family detail (GET /families/:id: students and count)
// ---------------------------------------------------------------------------

export interface FamilyDetails extends Family {
  students: { id: number; fullName: string; gender: string; birthDate: string }[];
}

export function useFamilyQuery(id: number) {
  return useQuery({
    queryKey: ['families', 'detail', id] as const,
    queryFn: async () => (await apiClient.get<FamilyDetails>(`/families/${id}`)).data,
    enabled: id > 0,
  });
}
