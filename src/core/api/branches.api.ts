import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface Branch {
  id: number;
  instituteId: number;
  name: string;
  code?: string | null;
  address?: string | null;
  phone?: string | null;
  isActive?: boolean;
}

export interface CreateBranchDto {
  name: string;
  code: string;
  phone?: string;
  address?: string;
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {}

export async function getBranches(): Promise<Branch[]> {
  try {
    const { data } = await apiClient.get<Branch[]>('/branches');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function createBranch(dto: CreateBranchDto): Promise<Branch> {
  const { data } = await apiClient.post<Branch>('/branches', dto);
  return data;
}

export async function updateBranch(
  id: number,
  dto: UpdateBranchDto,
): Promise<Branch> {
  const { data } = await apiClient.patch<Branch>(`/branches/${id}`, dto);
  return data;
}

export async function deleteBranch(id: number): Promise<void> {
  await apiClient.delete(`/branches/${id}`);
}

export const branchesKeys = {
  all: ['branches'] as const,
  list: () => [...branchesKeys.all, 'list'] as const,
};

export function useBranchesQuery() {
  return useQuery({
    queryKey: branchesKeys.list(),
    queryFn: getBranches,
    placeholderData: [],
  });
}

export function useCreateBranchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
}

export function useUpdateBranchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBranchDto }) =>
      updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
}

export function useDeleteBranchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchesKeys.all });
    },
  });
}
