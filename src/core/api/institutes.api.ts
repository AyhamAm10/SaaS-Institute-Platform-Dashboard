import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { SafeUser } from './types';

export interface InstituteAdminUser {
  id: number;
  fullName: string;
  phone: string;
  role: string;
}

export interface InstituteAdminLink {
  user: InstituteAdminUser;
}

export interface InstituteCount {
  users: number;
  branches: number;
  sections: number;
  students: number;
}

export interface Institute {
  id: number;
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  instituteAdmins?: InstituteAdminLink[];
  _count?: InstituteCount;
}

export interface CreateInstitutePayload {
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  phone: string;
  address: string;
  adminFullName: string;
  adminPhone: string;
  adminPassword: string;
}

export interface InstituteWithAdminResponse {
  institute: Institute;
  admin: SafeUser;
}

export interface PaginatedInstitutes {
  data: Institute[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InstitutesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getInstitutes(
  params?: InstitutesQueryParams,
): Promise<PaginatedInstitutes> {
  const { data } = await apiClient.get<PaginatedInstitutes>('/institutes', {
    params,
  });
  return data;
}

export async function getInstituteById(id: number): Promise<Institute> {
  const { data } = await apiClient.get<Institute>(`/institutes/${id}`);
  return data;
}

export async function createInstitute(
  payload: CreateInstitutePayload,
): Promise<InstituteWithAdminResponse> {
  const { data } = await apiClient.post<InstituteWithAdminResponse>(
    '/institutes',
    payload,
  );
  return data;
}

// --------------------------------------------------------------------------
// React Query Keys
// --------------------------------------------------------------------------

export const INSTITUTES_QUERY_KEYS = {
  all: ['institutes'] as const,
  list: (params?: InstitutesQueryParams) =>
    ['institutes', 'list', params] as const,
  detail: (id: number) => ['institutes', 'detail', id] as const,
};

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export function useInstitutesQuery(params?: InstitutesQueryParams) {
  return useQuery({
    queryKey: INSTITUTES_QUERY_KEYS.list(params),
    queryFn: () => getInstitutes(params),
    staleTime: 30 * 1000,
  });
}

export function useInstituteDetailsQuery(id: number | null, enabled = true) {
  return useQuery({
    queryKey: id ? INSTITUTES_QUERY_KEYS.detail(id) : ['institutes', 'detail', 'null'],
    queryFn: () => (id ? getInstituteById(id) : Promise.reject('No ID provided')),
    enabled: Boolean(id) && enabled,
    staleTime: 60 * 1000,
  });
}

export function useCreateInstituteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInstitutePayload) => createInstitute(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTITUTES_QUERY_KEYS.all });
    },
  });
}
