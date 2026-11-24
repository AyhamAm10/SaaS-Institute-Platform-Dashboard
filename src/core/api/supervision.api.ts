import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import { type Exam, examsKeys, useExamsMutation } from './exams.api';

/** One supervision of the signed-in supervisor (GET /supervision/my). */
export interface MySupervision {
  examId: number;
  title: string;
  /** YYYY-MM-DD */
  examDate: string;
  section: { id: number; name: string };
  subject: { id: number; name: string };
  branch: { id: number; name: string };
  /** The other supervisors of the same exam. */
  colleagues: { id: number; fullName: string }[];
}

export interface SupervisorOption {
  id: number;
  fullName: string;
}

// ── API functions ───────────────────────────────────────────────────────────

/** Makes `userIds` exactly the supervisors of the exam (an empty list clears them). */
export const setExamSupervisors = async (id: number, userIds: number[]) =>
  (await apiClient.put<Exam>(`/exams/${id}/supervisors`, { userIds })).data;
export const fetchSupervisorOptions = async () => (await apiClient.get<SupervisorOption[]>('/exams/supervisors')).data;
export const fetchMySupervisions = async () =>
  (await apiClient.get<{ today: string; items: MySupervision[] }>('/supervision/my')).data;

// ── React Query hooks ───────────────────────────────────────────────────────

export const useSetExamSupervisorsMutation = () =>
  useExamsMutation(({ id, userIds }: { id: number; userIds: number[] }) => setExamSupervisors(id, userIds));

/** Active supervisors to choose from (loaded only while the exam form is open). */
export function useSupervisorOptionsQuery(enabled: boolean) {
  return useQuery({ queryKey: [...examsKeys.all, 'supervisors'], queryFn: fetchSupervisorOptions, enabled });
}

/** The signed-in supervisor's own supervisions (today and later). */
export function useMySupervisionsQuery() {
  return useQuery({ queryKey: [...examsKeys.all, 'my-supervisions'], queryFn: fetchMySupervisions });
}
