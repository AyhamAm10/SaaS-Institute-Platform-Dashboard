import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface TeacherAssignment {
  id: number;
  teacherId: number;
  academicBranchId: number;
  subjectId: number;
  academicBranch?: {
    id: number;
    name: string;
  };
  subject?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface TeacherAvailability {
  id: number;
  teacherId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Teacher {
  id: number;
  userId: number;
  specialization?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    fullName: string;
    phone: string;
    role: string;
  };
  teacherBranches?: Array<{
    branchId: number;
    branch?: {
      id: number;
      name: string;
    };
  }>;
  assignments?: TeacherAssignment[];
  availabilities?: TeacherAvailability[];
  _count?: {
    assignments: number;
    timetableEntries: number;
  };
}

export interface PaginatedTeachers {
  data: Teacher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TeachersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  branchId?: number;
  academicBranchId?: number;
  subjectId?: number;
  isActive?: boolean;
}

export interface CreateTeacherPayload {
  fullName: string;
  phone: string;
  password?: string;
  branchIds: number[];
  specialization?: string;
  qualifications?: Array<{
    academicBranchId: number;
    subjectId: number;
  }>;
  availabilities?: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
}

export interface UpdateTeacherPayload {
  fullName?: string;
  phone?: string;
  password?: string;
  branchIds?: number[];
  specialization?: string;
  isActive?: boolean;
}

export interface AssignQualificationPayload {
  academicBranchId: number;
  subjectId: number;
}

export interface AvailabilityWindowPayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getTeachers(
  params?: TeachersQueryParams,
): Promise<PaginatedTeachers> {
  const { data } = await apiClient.get<PaginatedTeachers>('/teachers', {
    params,
  });
  return data;
}

export async function getTeacherById(id: number): Promise<Teacher> {
  const { data } = await apiClient.get<Teacher>(`/teachers/${id}`);
  return data;
}

export async function createTeacher(
  payload: CreateTeacherPayload,
): Promise<Teacher> {
  const { data } = await apiClient.post<Teacher>('/teachers', payload);
  return data;
}

export async function updateTeacher(
  id: number,
  payload: UpdateTeacherPayload,
): Promise<Teacher> {
  const { data } = await apiClient.patch<Teacher>(`/teachers/${id}`, payload);
  return data;
}

export async function deleteTeacher(id: number): Promise<void> {
  await apiClient.delete(`/teachers/${id}`);
}

export async function assignTeacherQualification(
  teacherId: number,
  payload: AssignQualificationPayload,
): Promise<TeacherAssignment> {
  const { data } = await apiClient.post<TeacherAssignment>(
    `/teachers/${teacherId}/qualifications`,
    payload,
  );
  return data;
}

export async function removeTeacherQualification(
  teacherId: number,
  assignmentId: number,
): Promise<void> {
  await apiClient.delete(`/teachers/${teacherId}/qualifications/${assignmentId}`);
}

export async function setTeacherAvailabilities(
  teacherId: number,
  windows: AvailabilityWindowPayload[],
): Promise<TeacherAvailability[]> {
  const { data } = await apiClient.put<TeacherAvailability[]>(
    `/teachers/${teacherId}/availability`,
    { windows },
  );
  return data;
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const teachersKeys = {
  all: ['teachers'] as const,
  lists: () => [...teachersKeys.all, 'list'] as const,
  list: (params?: TeachersQueryParams) => [...teachersKeys.lists(), params] as const,
  details: () => [...teachersKeys.all, 'detail'] as const,
  detail: (id: number) => [...teachersKeys.details(), id] as const,
};

export function useTeachersQuery(params?: TeachersQueryParams) {
  return useQuery({
    queryKey: teachersKeys.list(params),
    queryFn: () => getTeachers(params),
    placeholderData: (prev) => prev,
  });
}

export function useTeacherDetailsQuery(id: number) {
  return useQuery({
    queryKey: teachersKeys.detail(id),
    queryFn: () => getTeacherById(id),
    enabled: Boolean(id),
  });
}

export function useCreateTeacherMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersKeys.all });
    },
  });
}

export function useUpdateTeacherMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTeacherPayload }) =>
      updateTeacher(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teachersKeys.all });
      queryClient.invalidateQueries({ queryKey: teachersKeys.detail(variables.id) });
    },
  });
}

export function useDeleteTeacherMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teachersKeys.all });
    },
  });
}

export function useAssignTeacherQualificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teacherId,
      payload,
    }: {
      teacherId: number;
      payload: AssignQualificationPayload;
    }) => assignTeacherQualification(teacherId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teachersKeys.detail(variables.teacherId) });
      queryClient.invalidateQueries({ queryKey: teachersKeys.lists() });
    },
  });
}

export function useRemoveTeacherQualificationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teacherId,
      assignmentId,
    }: {
      teacherId: number;
      assignmentId: number;
    }) => removeTeacherQualification(teacherId, assignmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teachersKeys.detail(variables.teacherId) });
      queryClient.invalidateQueries({ queryKey: teachersKeys.lists() });
    },
  });
}

export function useSetTeacherAvailabilitiesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      teacherId,
      windows,
    }: {
      teacherId: number;
      windows: AvailabilityWindowPayload[];
    }) => setTeacherAvailabilities(teacherId, windows),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teachersKeys.detail(variables.teacherId) });
    },
  });
}
