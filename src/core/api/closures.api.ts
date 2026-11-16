import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

/** Closures / holidays (عطل): days without attendance for the institute, a branch or some sections. */

export type ClosureScope = 'INSTITUTE' | 'BRANCH' | 'SECTION';

export interface Closure {
  id: number;
  scope: ClosureScope;
  branchId: number | null;
  branchName: string | null;
  /** Local dates `YYYY-MM-DD`, inclusive. */
  fromDate: string;
  toDate: string;
  reason: string;
  sections: { id: number; name: string }[];
}

export interface ClosurePayload {
  scope: ClosureScope;
  branchId?: number;
  sectionIds?: number[];
  fromDate: string;
  toDate: string;
  reason: string;
}

export type UpdateClosurePayload = Partial<ClosurePayload>;

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getClosures(): Promise<Closure[]> {
  const { data } = await apiClient.get<Closure[]>('/closures');
  return data;
}

export async function createClosure(payload: ClosurePayload): Promise<Closure> {
  const { data } = await apiClient.post<Closure>('/closures', payload);
  return data;
}

export async function updateClosure(id: number, payload: UpdateClosurePayload): Promise<Closure> {
  const { data } = await apiClient.patch<Closure>(`/closures/${id}`, payload);
  return data;
}

export async function deleteClosure(id: number): Promise<void> {
  await apiClient.delete(`/closures/${id}`);
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const closuresKeys = {
  all: ['closures'] as const,
  list: () => [...closuresKeys.all, 'list'] as const,
};

export function useClosuresQuery() {
  return useQuery({ queryKey: closuresKeys.list(), queryFn: getClosures, placeholderData: [] });
}

/** A closure changes what attendance, the dashboard and reports show: refresh them too. */
function useInvalidateAfterChange() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: closuresKeys.all });
    queryClient.invalidateQueries({ queryKey: ['attendance'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };
}

export function useCreateClosureMutation() {
  const invalidate = useInvalidateAfterChange();
  return useMutation({ mutationFn: createClosure, onSuccess: invalidate });
}

export function useUpdateClosureMutation() {
  const invalidate = useInvalidateAfterChange();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateClosurePayload }) => updateClosure(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteClosureMutation() {
  const invalidate = useInvalidateAfterChange();
  return useMutation({ mutationFn: deleteClosure, onSuccess: invalidate });
}
