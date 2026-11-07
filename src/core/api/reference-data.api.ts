import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { PaginatedResponse } from './types';

// ---------------------------------------------------------------------------
// Types & Models
// ---------------------------------------------------------------------------

/** Semantic color of a student status (maps to StatusBadge tones). */
export type StatusTone = 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO' | 'NEUTRAL' | 'BRAND';

export interface LookupItem {
  id: number;
  name: string;
}

export type City = LookupItem;
export type KnowWay = LookupItem;
export type ExamType = LookupItem;

export interface School extends LookupItem {
  cityId?: number | null;
}

export interface Bus extends LookupItem {
  branchId: number;
  plateNumber?: string | null;
  driverName?: string | null;
  driverPhone?: string | null;
  capacity?: number | null;
  isActive: boolean;
}

export interface StudentStatus extends LookupItem {
  tone: StatusTone;
  isDefault: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface LookupQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/** Create / update payload of any lookup (name + the table's extra fields). */
export type LookupPayload = { name?: string } & Record<string, string | number | boolean | null | undefined>;

// ---------------------------------------------------------------------------
// Resource factory (one implementation for every reference table)
// ---------------------------------------------------------------------------

/**
 * API functions, query keys and React Query hooks of one reference table,
 * e.g. `createLookupResource<City>('/cities')`.
 */
export function createLookupResource<T extends LookupItem>(path: string) {
  const keys = {
    all: ['reference-data', path] as const,
    list: (params: LookupQueryParams) => ['reference-data', path, 'list', params] as const,
  };

  const list = async (params: LookupQueryParams): Promise<PaginatedResponse<T>> =>
    (await apiClient.get<PaginatedResponse<T>>(path, { params })).data;
  const create = async (payload: LookupPayload): Promise<T> =>
    (await apiClient.post<T>(path, payload)).data;
  const update = async (id: number, payload: LookupPayload): Promise<T> =>
    (await apiClient.patch<T>(`${path}/${id}`, payload)).data;
  const remove = async (id: number): Promise<void> => {
    await apiClient.delete(`${path}/${id}`);
  };

  return {
    keys,
    useList: (params: LookupQueryParams, enabled = true) =>
      useQuery({
        queryKey: keys.list(params),
        queryFn: () => list(params),
        placeholderData: (previous) => previous,
        enabled,
      }),
    useCreate: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: create,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
      });
    },
    useUpdate: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: LookupPayload }) => update(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
      });
    },
    useDelete: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: remove,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.all }),
      });
    },
  };
}

export type LookupResource<T extends LookupItem = LookupItem> = ReturnType<
  typeof createLookupResource<T>
>;

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export const citiesResource = createLookupResource<City>('/cities');
export const schoolsResource = createLookupResource<School>('/schools');
export const knowWaysResource = createLookupResource<KnowWay>('/know-ways');
export const examTypesResource = createLookupResource<ExamType>('/exam-types');
/** Buses of the active branch (X-Branch-Id). */
export const busesResource = createLookupResource<Bus>('/buses');
export const studentStatusesResource = createLookupResource<StudentStatus>('/student-statuses');
