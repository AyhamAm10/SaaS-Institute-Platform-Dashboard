import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { StatusTone } from './reference-data.api';
import { sectionsKeys } from './sections.api';
import { studentsKeys } from './students.api';

export type EnrollmentStatus = 'ACTIVE' | 'TRANSFERRED' | 'WITHDRAWN' | 'COMPLETED';

/** One student of a section roster (GET /sections/:id/students). */
export interface SectionRosterItem {
  enrollmentId: number;
  sectionId: number;
  status: EnrollmentStatus;
  statusReason: string | null;
  enrolledAt: string;
  student: {
    id: number;
    fullName: string;
    gender: string;
    familyName: string | null;
    phone: string | null;
    status: { id: number; name: string; tone: StatusTone } | null;
  };
  /** True when no subset was chosen: the student takes every section subject. */
  takesAllSubjects: boolean;
  subjects: { id: number; name: string }[];
}

export interface BulkEnrollResult {
  enrolled: { studentId: number; enrollmentId: number }[];
  rejected: { studentId: number; reason: string }[];
}

export interface ChangeEnrollmentStatusPayload {
  status: Exclude<EnrollmentStatus, 'TRANSFERRED'>;
  reason?: string;
}

// ── API functions ───────────────────────────────────────────────────────────

export async function getSectionRoster(sectionId: number): Promise<SectionRosterItem[]> {
  const { data } = await apiClient.get<SectionRosterItem[]>(`/sections/${sectionId}/students`);
  return data;
}

export async function enrollStudents(
  sectionId: number,
  studentIds: number[],
): Promise<BulkEnrollResult> {
  const { data } = await apiClient.post<BulkEnrollResult>(`/sections/${sectionId}/enrollments`, {
    studentIds,
  });
  return data;
}

export async function transferEnrollment(
  id: number,
  sectionId: number,
): Promise<SectionRosterItem> {
  const { data } = await apiClient.patch<SectionRosterItem>(`/enrollments/${id}/transfer`, {
    sectionId,
  });
  return data;
}

export async function changeEnrollmentStatus(
  id: number,
  payload: ChangeEnrollmentStatusPayload,
): Promise<SectionRosterItem> {
  const { data } = await apiClient.patch<SectionRosterItem>(`/enrollments/${id}/status`, payload);
  return data;
}

/** Empty `subjectIds` = the student takes every section subject. */
export async function setEnrollmentSubjects(
  id: number,
  subjectIds: number[],
): Promise<SectionRosterItem> {
  const { data } = await apiClient.put<SectionRosterItem>(`/enrollments/${id}/subjects`, {
    subjectIds,
  });
  return data;
}

// ── React Query hooks ───────────────────────────────────────────────────────

export const enrollmentsKeys = {
  roster: (sectionId: number) => [...sectionsKeys.detail(sectionId), 'students'] as const,
};

export function useSectionRosterQuery(sectionId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: enrollmentsKeys.roster(sectionId),
    queryFn: () => getSectionRoster(sectionId),
    enabled: Boolean(sectionId) && (options?.enabled ?? true),
  });
}

/**
 * Any enrollment change touches section counts, rosters (a transfer moves a
 * student between two sections) and the students list (section column).
 */
function useInvalidateEnrollments() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: sectionsKeys.all });
    queryClient.invalidateQueries({ queryKey: studentsKeys.lists() });
  };
}

export function useEnrollStudentsMutation() {
  const invalidate = useInvalidateEnrollments();
  return useMutation({
    mutationFn: ({ sectionId, studentIds }: { sectionId: number; studentIds: number[] }) =>
      enrollStudents(sectionId, studentIds),
    onSuccess: invalidate,
  });
}

export function useTransferEnrollmentMutation() {
  const invalidate = useInvalidateEnrollments();
  return useMutation({
    mutationFn: ({ id, sectionId }: { id: number; sectionId: number }) =>
      transferEnrollment(id, sectionId),
    onSuccess: invalidate,
  });
}

export function useChangeEnrollmentStatusMutation() {
  const invalidate = useInvalidateEnrollments();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ChangeEnrollmentStatusPayload }) =>
      changeEnrollmentStatus(id, payload),
    onSuccess: invalidate,
  });
}

export function useSetEnrollmentSubjectsMutation() {
  const invalidate = useInvalidateEnrollments();
  return useMutation({
    mutationFn: ({ id, subjectIds }: { id: number; subjectIds: number[] }) =>
      setEnrollmentSubjects(id, subjectIds),
    onSuccess: invalidate,
  });
}
