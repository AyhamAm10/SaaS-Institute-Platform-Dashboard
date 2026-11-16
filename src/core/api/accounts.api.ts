import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { PaginatedResponse } from './types';

/** The sub-tabs of the accounts screen. */
export type AccountType = 'staff' | 'teachers' | 'families' | 'students';

/** One login account (never the password). */
export interface AccountItem {
  id: number;
  fullName: string;
  phone: string;
  role: string;
  isActive: boolean;
  /** Still on the default password (new or reset account). */
  mustChangePassword: boolean;
  createdAt: string;
  /** Family name(s), student name or specialization, by type. */
  linkedTo: string | null;
}

export interface AccountsQueryParams {
  type: AccountType;
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
}

export interface AccountsSummary {
  missingFamilies: { withPhone: number; withoutPhone: number };
}

export interface FamilySyncResult {
  created: number;
  linked: number;
  phoneTaken: number;
  withoutPhone: number;
}

export interface EligibleStudentItem {
  id: number;
  fullName: string;
  familyId: number;
  familyName: string;
}

export interface CreateStudentAccountPayload {
  studentId: number;
  phone: string;
}

export const accountsKeys = {
  all: ['accounts'] as const,
  list: (params: AccountsQueryParams) => [...accountsKeys.all, 'list', params] as const,
  summary: () => [...accountsKeys.all, 'summary'] as const,
  eligibleStudents: (search?: string) => [...accountsKeys.all, 'eligible-students', { search }] as const,
};

export async function getAccounts(params: AccountsQueryParams): Promise<PaginatedResponse<AccountItem>> {
  const { data } = await apiClient.get<PaginatedResponse<AccountItem>>('/accounts', { params });
  return data;
}

export async function getAccountsSummary(): Promise<AccountsSummary> {
  const { data } = await apiClient.get<AccountsSummary>('/accounts/summary');
  return data;
}

/** Back to the default password; the person must choose a new one at the next sign-in. */
export async function resetAccountPassword(id: number): Promise<void> {
  await apiClient.post(`/accounts/${id}/reset-password`);
}

export async function setAccountActive(id: number, isActive: boolean): Promise<AccountItem> {
  const { data } = await apiClient.patch<AccountItem>(`/accounts/${id}/active`, { isActive });
  return data;
}

export async function syncFamilyAccounts(): Promise<FamilySyncResult> {
  const { data } = await apiClient.post<FamilySyncResult>('/accounts/families/sync');
  return data;
}

export async function getEligibleStudents(search?: string): Promise<EligibleStudentItem[]> {
  const { data } = await apiClient.get<EligibleStudentItem[]>('/accounts/eligible-students', { params: { search } });
  return data;
}

export async function createStudentAccount(payload: CreateStudentAccountPayload): Promise<AccountItem> {
  const { data } = await apiClient.post<AccountItem>('/accounts/students', payload);
  return data;
}

export function useAccountsQuery(params: AccountsQueryParams) {
  return useQuery({
    queryKey: accountsKeys.list(params),
    queryFn: () => getAccounts(params),
    placeholderData: (prev) => prev,
  });
}

export function useAccountsSummaryQuery(enabled = true) {
  return useQuery({ queryKey: accountsKeys.summary(), queryFn: getAccountsSummary, enabled });
}

export function useEligibleStudentsQuery(search?: string, enabled = true) {
  return useQuery({
    queryKey: accountsKeys.eligibleStudents(search),
    queryFn: () => getEligibleStudents(search),
    enabled,
  });
}

/** Mutations refresh every account list; staff / teacher lists also follow the switch. */
function useAccountsMutation<V, R>(mutationFn: (variables: V) => Promise<R>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
}

export function useResetAccountPasswordMutation() {
  return useAccountsMutation((id: number) => resetAccountPassword(id));
}

export function useSetAccountActiveMutation() {
  return useAccountsMutation(({ id, isActive }: { id: number; isActive: boolean }) => setAccountActive(id, isActive));
}

export function useSyncFamilyAccountsMutation() {
  return useAccountsMutation(syncFamilyAccounts);
}

export function useCreateStudentAccountMutation() {
  return useAccountsMutation(createStudentAccount);
}
