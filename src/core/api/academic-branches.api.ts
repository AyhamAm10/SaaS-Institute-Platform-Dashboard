import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface AcademicBranch {
  id: number;
  instituteId: number;
  name: string;
  code?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    sections: number;
  };
}

export interface PaginatedAcademicBranches {
  data: AcademicBranch[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AcademicBranchesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateAcademicBranchPayload {
  name: string;
  code?: string;
  description?: string;
}

export interface UpdateAcademicBranchPayload {
  name?: string;
  code?: string;
  description?: string;
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getAcademicBranches(
  params?: AcademicBranchesQueryParams,
): Promise<PaginatedAcademicBranches> {
  const { data } = await apiClient.get<PaginatedAcademicBranches>('/academic-branches', {
    params,
  });
  return data;
}

export async function getAcademicBranchById(id: number): Promise<AcademicBranch> {
  const { data } = await apiClient.get<AcademicBranch>(`/academic-branches/${id}`);
  return data;
}

export async function createAcademicBranch(
  payload: CreateAcademicBranchPayload,
): Promise<AcademicBranch> {
  const { data } = await apiClient.post<AcademicBranch>('/academic-branches', payload);
  return data;
}

export async function updateAcademicBranch(
  id: number,
  payload: UpdateAcademicBranchPayload,
): Promise<AcademicBranch> {
  const { data } = await apiClient.patch<AcademicBranch>(`/academic-branches/${id}`, payload);
  return data;
}

export async function deleteAcademicBranch(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/academic-branches/${id}`);
  return data;
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const academicBranchKeys = {
  all: ['academic-branches'] as const,
  lists: () => [...academicBranchKeys.all, 'list'] as const,
  list: (params?: AcademicBranchesQueryParams) =>
    [...academicBranchKeys.lists(), params] as const,
  details: () => [...academicBranchKeys.all, 'detail'] as const,
  detail: (id: number) => [...academicBranchKeys.details(), id] as const,
};

export function useAcademicBranchesQuery(params?: AcademicBranchesQueryParams) {
  return useQuery({
    queryKey: academicBranchKeys.list(params),
    queryFn: () => getAcademicBranches(params),
  });
}

export function useAcademicBranchQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: academicBranchKeys.detail(id),
    queryFn: () => getAcademicBranchById(id),
    enabled: enabled && Boolean(id),
  });
}

export function useCreateAcademicBranchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAcademicBranchPayload) => createAcademicBranch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicBranchKeys.all });
    },
  });
}

export function useUpdateAcademicBranchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateAcademicBranchPayload;
    }) => updateAcademicBranch(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: academicBranchKeys.all });
      queryClient.invalidateQueries({
        queryKey: academicBranchKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteAcademicBranchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAcademicBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicBranchKeys.all });
    },
  });
}
