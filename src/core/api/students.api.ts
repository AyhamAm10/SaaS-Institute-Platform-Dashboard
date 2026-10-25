import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { PaginatedResponse } from './types';

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

export interface Student {
  id: number;
  instituteId: number;
  branchId?: number | null;
  familyId: number;
  fullName: string;
  birthDate: string;
  gender: string;
  customFields?: Record<string, any>;
  createdAt: string;
  family?: Family;
  branch?: {
    id: number;
    name: string;
  } | null;
  studentEnrollments?: StudentEnrollmentItem[];
}

export interface CreateFamilyPayload {
  familyName: string;
  fatherName?: string;
  motherName?: string;
  phone?: string;
}

export interface CreateStudentPayload {
  fullName: string;
  birthDate: string;
  gender: string;
  branchId?: number;
  familyId?: number;
  newFamily?: CreateFamilyPayload;
  sectionId?: number;
  customFields?: Record<string, any>;
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  branchId?: number;
  sectionId?: number;
  familyId?: number;
}

// ---------------------------------------------------------------------------
// Query Keys
// ---------------------------------------------------------------------------

export const studentsKeys = {
  all: ['students'] as const,
  lists: () => [...studentsKeys.all, 'list'] as const,
  list: (params: StudentQueryParams) => [...studentsKeys.lists(), params] as const,
  detail: (id: number) => [...studentsKeys.all, 'detail', id] as const,
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

export function useFamiliesSearchQuery(search?: string) {
  return useQuery({
    queryKey: studentsKeys.families(search),
    queryFn: () => searchFamilies(search),
    staleTime: 30000,
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
