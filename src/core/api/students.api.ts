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
}

/** Reference-data links of a student; `null` clears a link (except the status). */
export interface StudentReferenceIds {
  cityId?: number | null;
  schoolId?: number | null;
  busId?: number | null;
  knowWayId?: number | null;
  statusId?: number | null;
}

interface NamedRef {
  id: number;
  name: string;
}

export interface Student extends StudentReferenceIds {
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
}

export interface CreateFamilyPayload {
  familyName: string;
  fatherName?: string;
  motherName?: string;
  phone?: string;
}

export interface CreateStudentPayload extends StudentReferenceIds {
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

export interface UpdateStudentPayload extends StudentReferenceIds {
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
  lessonAttendance: number;
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
