import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface Subject {
  id: number;
  instituteId: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    sectionSubjects: number;
  };
}

export interface PaginatedSubjects {
  data: Subject[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubjectsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateSubjectPayload {
  name: string;
  code: string;
}

export interface UpdateSubjectPayload {
  name?: string;
  code?: string;
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getSubjects(
  params?: SubjectsQueryParams,
): Promise<PaginatedSubjects> {
  const { data } = await apiClient.get<PaginatedSubjects>('/subjects', {
    params,
  });
  return data;
}

export async function getSubjectById(id: number): Promise<Subject> {
  const { data } = await apiClient.get<Subject>(`/subjects/${id}`);
  return data;
}

export async function createSubject(
  payload: CreateSubjectPayload,
): Promise<Subject> {
  const { data } = await apiClient.post<Subject>('/subjects', payload);
  return data;
}

export async function updateSubject(
  id: number,
  payload: UpdateSubjectPayload,
): Promise<Subject> {
  const { data } = await apiClient.patch<Subject>(`/subjects/${id}`, payload);
  return data;
}

export async function deleteSubject(id: number): Promise<void> {
  await apiClient.delete(`/subjects/${id}`);
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const subjectsKeys = {
  all: ['subjects'] as const,
  lists: () => [...subjectsKeys.all, 'list'] as const,
  list: (params?: SubjectsQueryParams) => [...subjectsKeys.lists(), params] as const,
  details: () => [...subjectsKeys.all, 'detail'] as const,
  detail: (id: number) => [...subjectsKeys.details(), id] as const,
};

export function useSubjectsQuery(params?: SubjectsQueryParams) {
  return useQuery({
    queryKey: subjectsKeys.list(params),
    queryFn: () => getSubjects(params),
    placeholderData: (prev) => prev,
  });
}

export function useSubjectDetailsQuery(id: number) {
  return useQuery({
    queryKey: subjectsKeys.detail(id),
    queryFn: () => getSubjectById(id),
    enabled: Boolean(id),
  });
}

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
    },
  });
}

export function useUpdateSubjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSubjectPayload }) =>
      updateSubject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
    },
  });
}

export function useDeleteSubjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
    },
  });
}
