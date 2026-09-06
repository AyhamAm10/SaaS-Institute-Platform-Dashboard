import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface AcademicYear {
  id: number;
  instituteId: number;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedAcademicYears {
  data: AcademicYear[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AcademicYearsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateAcademicYearPayload {
  name: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface UpdateAcademicYearPayload {
  name?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getAcademicYears(
  params?: AcademicYearsQueryParams,
): Promise<PaginatedAcademicYears> {
  const { data } = await apiClient.get<PaginatedAcademicYears>('/academic-years', {
    params,
  });
  return data;
}

export async function getAcademicYearById(id: number): Promise<AcademicYear> {
  const { data } = await apiClient.get<AcademicYear>(`/academic-years/${id}`);
  return data;
}

export async function createAcademicYear(
  payload: CreateAcademicYearPayload,
): Promise<AcademicYear> {
  const { data } = await apiClient.post<AcademicYear>('/academic-years', payload);
  return data;
}

export async function updateAcademicYear(
  id: number,
  payload: UpdateAcademicYearPayload,
): Promise<AcademicYear> {
  const { data } = await apiClient.patch<AcademicYear>(`/academic-years/${id}`, payload);
  return data;
}

export async function setCurrentAcademicYear(id: number): Promise<AcademicYear> {
  const { data } = await apiClient.patch<AcademicYear>(
    `/academic-years/${id}/set-current`,
    {},
  );
  return data;
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const academicYearsKeys = {
  all: ['academic-years'] as const,
  lists: () => [...academicYearsKeys.all, 'list'] as const,
  list: (params?: AcademicYearsQueryParams) =>
    [...academicYearsKeys.lists(), params] as const,
  details: () => [...academicYearsKeys.all, 'detail'] as const,
  detail: (id: number) => [...academicYearsKeys.details(), id] as const,
};

export function useAcademicYearsQuery(params?: AcademicYearsQueryParams) {
  return useQuery({
    queryKey: academicYearsKeys.list(params),
    queryFn: () => getAcademicYears(params),
    placeholderData: (prev) => prev,
  });
}

export function useAcademicYearQuery(id: number) {
  return useQuery({
    queryKey: academicYearsKeys.detail(id),
    queryFn: () => getAcademicYearById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAcademicYearMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAcademicYear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearsKeys.all });
    },
  });
}

export function useUpdateAcademicYearMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAcademicYearPayload }) =>
      updateAcademicYear(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearsKeys.all });
    },
  });
}

export function useSetCurrentAcademicYearMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => setCurrentAcademicYear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearsKeys.all });
    },
  });
}
