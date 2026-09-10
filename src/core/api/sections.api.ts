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

export interface SectionAcademicBranchSummary {
  id: number;
  name: string;
  code?: string | null;
}

export interface Section {
  id: number;
  instituteId: number;
  branchId: number;
  academicYearId: number;
  academicBranchId: number;
  name: string;
  grade: string;
  feeAmount: number;
  createdAt: string;
  updatedAt: string;
  branch?: SectionBranchSummary;
  academicYear?: SectionAcademicYearSummary;
  academicBranch?: SectionAcademicBranchSummary;
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
  academicBranchId?: number;
  branchId?: number;
  grade?: string;
}

export interface CreateSectionPayload {
  name: string;
  academicBranchId: number;
  branchId: number;
  academicYearId: number;
  feeAmount: number;
  grade?: string;
}

export interface UpdateSectionPayload {
  name?: string;
  academicBranchId?: number;
  grade?: string;
  feeAmount?: number;
}

export interface UpdateSectionFeePayload {
  feeAmount: number;
}

export interface SectionSubjectItem {
  id: number;
  instituteId: number;
  sectionId: number;
  subjectId: number;
  teacherId?: number | null;
  weeklyPeriods: number;
  createdAt: string;
  subject: {
    id: number;
    instituteId: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
  };
  teacher?: {
    id: number;
    user: {
      id: number;
      fullName: string;
    };
  } | null;
}

export interface AssignSubjectPayload {
  subjectId: number;
  weeklyPeriods?: number;
  teacherId?: number | null;
}

export interface UpdateSectionSubjectPayload {
  weeklyPeriods?: number;
  teacherId?: number | null;
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

export async function getSectionSubjects(
  sectionId: number,
): Promise<SectionSubjectItem[]> {
  const { data } = await apiClient.get<SectionSubjectItem[]>(
    `/sections/${sectionId}/subjects`,
  );
  return data;
}

export async function assignSubjectToSection(
  sectionId: number,
  payload: AssignSubjectPayload,
): Promise<SectionSubjectItem> {
  const { data } = await apiClient.post<SectionSubjectItem>(
    `/sections/${sectionId}/subjects`,
    payload,
  );
  return data;
}

export async function removeSubjectFromSection(
  sectionId: number,
  subjectId: number,
): Promise<{ success: boolean }> {
  const { data } = await apiClient.delete<{ success: boolean }>(
    `/sections/${sectionId}/subjects/${subjectId}`,
  );
  return data;
}

export async function updateSectionSubject(
  sectionId: number,
  subjectId: number,
  payload: UpdateSectionSubjectPayload,
): Promise<SectionSubjectItem> {
  const { data } = await apiClient.patch<SectionSubjectItem>(
    `/sections/${sectionId}/subjects/${subjectId}`,
    payload,
  );
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
  sectionSubjects: (sectionId: number) =>
    [...sectionsKeys.detail(sectionId), 'subjects'] as const,
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

export function useSectionSubjectsQuery(sectionId: number) {
  return useQuery({
    queryKey: sectionsKeys.sectionSubjects(sectionId),
    queryFn: () => getSectionSubjects(sectionId),
    enabled: Boolean(sectionId),
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

export function useAssignSubjectToSectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sectionId,
      payload,
    }: {
      sectionId: number;
      payload: AssignSubjectPayload;
    }) => assignSubjectToSection(sectionId, payload),
    onSuccess: (_, { sectionId }) => {
      queryClient.invalidateQueries({
        queryKey: sectionsKeys.sectionSubjects(sectionId),
      });
      queryClient.invalidateQueries({
        queryKey: sectionsKeys.detail(sectionId),
      });
    },
  });
}

export function useUpdateSectionSubjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sectionId,
      subjectId,
      payload,
    }: {
      sectionId: number;
      subjectId: number;
      payload: UpdateSectionSubjectPayload;
    }) => updateSectionSubject(sectionId, subjectId, payload),
    onSuccess: (_, { sectionId }) => {
      queryClient.invalidateQueries({
        queryKey: sectionsKeys.sectionSubjects(sectionId),
      });
      queryClient.invalidateQueries({
        queryKey: sectionsKeys.detail(sectionId),
      });
    },
  });
}

export function useRemoveSubjectFromSectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sectionId,
      subjectId,
    }: {
      sectionId: number;
      subjectId: number;
    }) => removeSubjectFromSection(sectionId, subjectId),
    onSuccess: (_, { sectionId }) => {
      queryClient.invalidateQueries({
        queryKey: sectionsKeys.sectionSubjects(sectionId),
      });
      queryClient.invalidateQueries({
        queryKey: sectionsKeys.detail(sectionId),
      });
    },
  });
}
