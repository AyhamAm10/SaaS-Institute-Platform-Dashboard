import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface SectionBranchSummary {
  id: number;
  name: string;
  code?: string;
  address?: string;
}

export interface SectionAcademicYearSummary {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface Section {
  id: number;
  instituteId: number;
  branchId: number;
  academicYearId: number;
  name: string;
  grade: string;
  feeAmount: number;
  createdAt: string;
  updatedAt: string;
  branch?: SectionBranchSummary;
  academicYear?: SectionAcademicYearSummary;
}

export interface SectionDetailsCounts {
  studentEnrollments: number;
  sectionSubjects: number;
  sectionTeachers: number;
  timetables: number;
}

export interface SectionDetails extends Section {
  _count: SectionDetailsCounts;
}

export interface PaginatedSections {
  data: Section[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SectionsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  academicYearId?: number;
  branchId?: number;
  grade?: string;
}

export interface CreateSectionPayload {
  name: string;
  grade: string;
  branchId: number;
  academicYearId: number;
  feeAmount: number;
}

export interface UpdateSectionPayload {
  name?: string;
  grade?: string;
  feeAmount?: number;
}

export interface UpdateSectionFeePayload {
  feeAmount: number;
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getSections(
  params?: SectionsQueryParams,
): Promise<PaginatedSections> {
  const { data } = await apiClient.get<PaginatedSections>('/sections', {
    params,
  });
  return data;
}

export async function getSectionById(id: number): Promise<Section> {
  const { data } = await apiClient.get<Section>(`/sections/${id}`);
  return data;
}

export async function getSectionDetails(id: number): Promise<SectionDetails> {
  const { data } = await apiClient.get<SectionDetails>(`/sections/${id}/details`);
  return data;
}

export async function createSection(
  payload: CreateSectionPayload,
): Promise<Section> {
  const { data } = await apiClient.post<Section>('/sections', payload);
  return data;
}

export async function updateSection(
  id: number,
  payload: UpdateSectionPayload,
): Promise<Section> {
  const { data } = await apiClient.patch<Section>(`/sections/${id}`, payload);
  return data;
}

export async function updateSectionFee(
  id: number,
  payload: UpdateSectionFeePayload,
): Promise<Section> {
  const { data } = await apiClient.patch<Section>(`/sections/${id}/fee`, payload);
  return data;
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const sectionsKeys = {
  all: ['sections'] as const,
  lists: () => [...sectionsKeys.all, 'list'] as const,
  list: (params?: SectionsQueryParams) => [...sectionsKeys.lists(), params] as const,
  details: () => [...sectionsKeys.all, 'detail'] as const,
  detail: (id: number) => [...sectionsKeys.details(), id] as const,
};

export function useSectionsQuery(params?: SectionsQueryParams) {
  return useQuery({
    queryKey: sectionsKeys.list(params),
    queryFn: () => getSections(params),
    placeholderData: (prev) => prev,
  });
}

export function useSectionDetailsQuery(id: number) {
  return useQuery({
    queryKey: sectionsKeys.detail(id),
    queryFn: () => getSectionDetails(id),
    enabled: Boolean(id),
  });
}

export function useCreateSectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionsKeys.all });
    },
  });
}

export function useUpdateSectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSectionPayload }) =>
      updateSection(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionsKeys.all });
    },
  });
}

export function useUpdateSectionFeeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSectionFeePayload }) =>
      updateSectionFee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectionsKeys.all });
    },
  });
}
