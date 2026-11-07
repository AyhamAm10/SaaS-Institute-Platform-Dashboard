import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { PaginatedResponse } from './types';

/** Exams and marks (E9). Decimal marks arrive as strings: use Number(). */

export type ExamResultStatus = 'PENDING' | 'PASSED' | 'FAILED' | 'ABSENT';

export interface Exam {
  id: number;
  sectionId: number;
  subjectId: number;
  examTypeId: number | null;
  title: string;
  examDate: string;
  maxMark: string | number;
  passMark: string | number;
  section: { id: number; name: string; academicYearId: number };
  subject: { id: number; name: string };
  examType: { id: number; name: string } | null;
  _count: { results: number };
}

export interface ExamPayload {
  sectionId: number;
  subjectId: number;
  examTypeId?: number | null;
  title: string;
  examDate: string;
  maxMark: number;
  passMark: number;
}

export type UpdateExamPayload = Partial<Omit<ExamPayload, 'sectionId' | 'subjectId'>>;

export interface ExamsQuery {
  page?: number;
  limit?: number;
  sectionId?: number;
  subjectId?: number;
  examTypeId?: number;
  from?: string;
  to?: string;
  search?: string;
}

export interface ExamSheetRow {
  student: { id: number; fullName: string; familyName: string | null };
  /** False for a student who has a mark but no longer studies the subject here. */
  eligible: boolean;
  result: { id: number; mark: number | null; status: ExamResultStatus } | null;
}

export interface ExamStats {
  students: number;
  graded: number;
  passed: number;
  failed: number;
  absent: number;
  pending: number;
  average: number | null;
}

export interface ExamSheet {
  exam: Exam;
  rows: ExamSheetRow[];
  stats: ExamStats;
}

export interface ResultEntry {
  studentId: number;
  mark?: number | null;
  absent?: boolean;
}

export interface StudentResults {
  results: {
    id: number;
    mark: number | null;
    status: ExamResultStatus;
    exam: {
      id: number;
      title: string;
      examDate: string;
      maxMark: string | number;
      subject: { id: number; name: string };
      examType: { id: number; name: string } | null;
    };
  }[];
  subjects: { subjectId: number; subjectName: string; exams: number; averagePercent: number | null }[];
}

// ── API functions ───────────────────────────────────────────────────────────

export const getExams = async (params: ExamsQuery) =>
  (await apiClient.get<PaginatedResponse<Exam>>('/exams', { params })).data;
export const getExamSheet = async (id: number) =>
  (await apiClient.get<ExamSheet>(`/exams/${id}/results`)).data;
export const getStudentResults = async (studentId: number) =>
  (await apiClient.get<StudentResults>(`/students/${studentId}/results`)).data;
export const createExam = async (payload: ExamPayload) =>
  (await apiClient.post<Exam>('/exams', payload)).data;
export const updateExam = async (id: number, payload: UpdateExamPayload) =>
  (await apiClient.patch<Exam>(`/exams/${id}`, payload)).data;
export const deleteExam = async (id: number, force = false) =>
  (await apiClient.delete<{ deleted: true }>(`/exams/${id}`, { params: force ? { force: 'true' } : {} })).data;
export const saveExamResults = async (id: number, results: ResultEntry[]) =>
  (await apiClient.put<ExamSheet>(`/exams/${id}/results`, { results })).data;

// ── React Query hooks ───────────────────────────────────────────────────────

export const examsKeys = {
  all: ['exams'] as const,
  list: (params: ExamsQuery) => [...examsKeys.all, 'list', params] as const,
  sheet: (id: number) => [...examsKeys.all, 'sheet', id] as const,
  student: (studentId: number) => [...examsKeys.all, 'student', studentId] as const,
};

export function useExamsQuery(params: ExamsQuery) {
  return useQuery({
    queryKey: examsKeys.list(params),
    queryFn: () => getExams(params),
    placeholderData: keepPreviousData,
  });
}

export function useExamSheetQuery(id: number) {
  return useQuery({ queryKey: examsKeys.sheet(id), queryFn: () => getExamSheet(id), enabled: id > 0 });
}

export function useStudentResultsQuery(studentId: number) {
  return useQuery({
    queryKey: examsKeys.student(studentId),
    queryFn: () => getStudentResults(studentId),
    enabled: studentId > 0,
  });
}

function useExamsMutation<TVars, TData>(fn: (vars: TVars) => Promise<TData>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: examsKeys.all }),
  });
}

export const useCreateExamMutation = () => useExamsMutation((payload: ExamPayload) => createExam(payload));
export const useUpdateExamMutation = () =>
  useExamsMutation(({ id, payload }: { id: number; payload: UpdateExamPayload }) => updateExam(id, payload));
export const useDeleteExamMutation = () =>
  useExamsMutation(({ id, force }: { id: number; force?: boolean }) => deleteExam(id, force));
export const useSaveExamResultsMutation = () =>
  useExamsMutation(({ id, results }: { id: number; results: ResultEntry[] }) => saveExamResults(id, results));
