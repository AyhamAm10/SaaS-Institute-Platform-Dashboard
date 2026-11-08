import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { PaginatedResponse } from './types';
import {
  CreateGuardianAccountPayload,
  CreateStudentAccountPayload,
  EligibleStudentItem,
  MobileAccountItem,
  MobileAccountQueryParams,
} from './mobile-accounts.types';

export * from './mobile-accounts.types';

export const mobileAccountsKeys = {
  all: ['mobile-accounts'] as const,
  lists: () => [...mobileAccountsKeys.all, 'list'] as const,
  list: (params: MobileAccountQueryParams) => [...mobileAccountsKeys.lists(), params] as const,
  eligibleStudents: (search?: string) => [...mobileAccountsKeys.all, 'eligible-students', { search }] as const,
};

export async function getMobileAccounts(
  params: MobileAccountQueryParams,
): Promise<PaginatedResponse<MobileAccountItem>> {
  const { data } = await apiClient.get<PaginatedResponse<MobileAccountItem>>('/mobile-accounts', { params });
  return data;
}

export async function getEligibleStudents(search?: string): Promise<EligibleStudentItem[]> {
  const { data } = await apiClient.get<EligibleStudentItem[]>('/mobile-accounts/eligible-students', {
    params: { search },
  });
  return data;
}

export async function createGuardianAccount(payload: CreateGuardianAccountPayload): Promise<MobileAccountItem> {
  const { data } = await apiClient.post<MobileAccountItem>('/mobile-accounts/guardians', payload);
  return data;
}

export async function createStudentAccount(payload: CreateStudentAccountPayload): Promise<MobileAccountItem> {
  const { data } = await apiClient.post<MobileAccountItem>('/mobile-accounts/students', payload);
  return data;
}

export async function resetMobilePassword(userId: number, password: string): Promise<{ updated: boolean }> {
  const { data } = await apiClient.post<{ updated: boolean }>(`/mobile-accounts/${userId}/reset-password`, {
    password,
  });
  return data;
}

export async function deactivateMobileAccount(userId: number): Promise<{ deactivated: boolean }> {
  const { data } = await apiClient.delete<{ deactivated: boolean }>(`/mobile-accounts/${userId}`);
  return data;
}

export function useMobileAccountsQuery(params: MobileAccountQueryParams) {
  return useQuery({
    queryKey: mobileAccountsKeys.list(params),
    queryFn: () => getMobileAccounts(params),
  });
}

export function useEligibleStudentsQuery(search?: string, enabled = true) {
  return useQuery({
    queryKey: mobileAccountsKeys.eligibleStudents(search),
    queryFn: () => getEligibleStudents(search),
    enabled,
  });
}

export function useCreateGuardianAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGuardianAccountPayload) => createGuardianAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mobileAccountsKeys.lists() });
    },
  });
}

export function useCreateStudentAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStudentAccountPayload) => createStudentAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mobileAccountsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mobileAccountsKeys.eligibleStudents() });
    },
  });
}

export function useResetMobilePasswordMutation() {
  return useMutation({
    mutationFn: ({ userId, password }: { userId: number; password: string }) =>
      resetMobilePassword(userId, password),
  });
}

export function useDeactivateMobileAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deactivateMobileAccount(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mobileAccountsKeys.lists() });
    },
  });
}
