import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { PaginatedResponse } from './types';

/** Roles an institute admin can give a staff account (D2, role.md §8.6). */
export type StaffRole = 'INSTITUTE_ADMIN' | 'REGISTRAR' | 'ACCOUNTANT';

export interface StaffMember {
  id: number;
  fullName: string;
  phone: string;
  role: StaffRole;
  createdAt: string;
}

export interface StaffQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: StaffRole;
}

export interface CreateStaffPayload {
  fullName: string;
  phone: string;
  role: StaffRole;
  password: string;
}

export interface UpdateStaffPayload {
  fullName?: string;
  role?: StaffRole;
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getStaff(params?: StaffQueryParams): Promise<PaginatedResponse<StaffMember>> {
  const { data } = await apiClient.get<PaginatedResponse<StaffMember>>('/staff', { params });
  return data;
}

export async function createStaff(payload: CreateStaffPayload): Promise<StaffMember> {
  const { data } = await apiClient.post<StaffMember>('/staff', payload);
  return data;
}

export async function updateStaff(id: number, payload: UpdateStaffPayload): Promise<StaffMember> {
  const { data } = await apiClient.patch<StaffMember>(`/staff/${id}`, payload);
  return data;
}

/** New password; the member's sessions are revoked by the server. */
export async function resetStaffPassword(id: number, password: string): Promise<void> {
  await apiClient.post(`/staff/${id}/reset-password`, { password });
}

/** Deactivate (soft delete); history and audit are kept. */
export async function deactivateStaff(id: number): Promise<void> {
  await apiClient.delete(`/staff/${id}`);
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const staffKeys = {
  all: ['staff'] as const,
  list: (params?: StaffQueryParams) => [...staffKeys.all, 'list', params] as const,
};

export function useStaffQuery(params?: StaffQueryParams) {
  return useQuery({
    queryKey: staffKeys.list(params),
    queryFn: () => getStaff(params),
    placeholderData: (prev) => prev,
  });
}

function useStaffMutation<V, R>(mutationFn: (variables: V) => Promise<R>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: staffKeys.all }),
  });
}

export function useCreateStaffMutation() {
  return useStaffMutation(createStaff);
}

export function useUpdateStaffMutation() {
  return useStaffMutation(({ id, payload }: { id: number; payload: UpdateStaffPayload }) => updateStaff(id, payload));
}

export function useResetStaffPasswordMutation() {
  return useStaffMutation(({ id, password }: { id: number; password: string }) => resetStaffPassword(id, password));
}

export function useDeactivateStaffMutation() {
  return useStaffMutation((id: number) => deactivateStaff(id));
}
