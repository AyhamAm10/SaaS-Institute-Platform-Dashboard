import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';

export interface Branch {
  id: number;
  instituteId: number;
  name: string;
  code?: string | null;
  address?: string | null;
  phone?: string | null;
}

export async function getBranches(): Promise<Branch[]> {
  try {
    const { data } = await apiClient.get<Branch[]>('/branches');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
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
