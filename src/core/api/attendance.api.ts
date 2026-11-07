import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

/** Daily attendance (E8): check-in / check-out per student per local day. */

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED';
export type AttendanceMethod = 'MANUAL' | 'BULK';

export interface AttendanceRecord {
  id: number;
  studentId: number;
  date: string;
  checkInAt: string | null;
  checkOutAt: string | null;
  status: AttendanceStatus;
  checkInMethod: AttendanceMethod | null;
  checkOutMethod: AttendanceMethod | null;
  note: string | null;
}

export interface AttendanceCounts {
  present: number;
  late: number;
  absent: number;
  excused: number;
  notRecorded: number;
}

export interface DailyAttendanceRow {
  student: { id: number; fullName: string; familyName: string | null };
  record: AttendanceRecord | null;
}

export interface DailyAttendance {
  date: string;
  isWorkingDay: boolean;
  counts: AttendanceCounts;
  rows: DailyAttendanceRow[];
}

export interface BulkAttendanceResult {
  done: number[];
  skipped: { studentId: number; reason: string }[];
}

export interface StudentAttendanceHistory {
  from: string;
  to: string;
  counts: Omit<AttendanceCounts, 'notRecorded'>;
  records: AttendanceRecord[];
}

export interface UpdateAttendancePayload {
  checkInAt?: string | null;
  checkOutAt?: string | null;
  status?: AttendanceStatus;
  note?: string | null;
}

// ── API functions ───────────────────────────────────────────────────────────

export async function getDailyAttendance(sectionId: number, date?: string) {
  const { data } = await apiClient.get<DailyAttendance>('/attendance/daily', {
    params: { sectionId, date },
  });
  return data;
}

export async function getStudentAttendance(studentId: number, from?: string, to?: string) {
  const { data } = await apiClient.get<StudentAttendanceHistory>(`/students/${studentId}/attendance`, {
    params: { from, to },
  });
  return data;
}

const post = async <T>(url: string, body: object) => (await apiClient.post<T>(url, body)).data;

export const checkIn = (studentId: number) => post<AttendanceRecord>('/attendance/check-in', { studentId });
export const checkOut = (studentId: number) => post<AttendanceRecord>('/attendance/check-out', { studentId });
export const bulkAttendance = (sectionId: number, action: 'check-in' | 'check-out') =>
  post<BulkAttendanceResult>('/attendance/bulk', { sectionId, action });
export const excuseStudent = (studentId: number, date: string, note?: string) =>
  post<AttendanceRecord>('/attendance/excuse', { studentId, date, note });

export async function updateAttendance(id: number, payload: UpdateAttendancePayload) {
  const { data } = await apiClient.patch<AttendanceRecord>(`/attendance/${id}`, payload);
  return data;
}

// ── React Query hooks ───────────────────────────────────────────────────────

export const attendanceKeys = {
  all: ['attendance'] as const,
  daily: (sectionId: number, date?: string) => [...attendanceKeys.all, 'daily', sectionId, date] as const,
  student: (studentId: number, from?: string, to?: string) =>
    [...attendanceKeys.all, 'student', studentId, from, to] as const,
};

export function useDailyAttendanceQuery(sectionId: number | null, date?: string) {
  return useQuery({
    queryKey: attendanceKeys.daily(sectionId ?? 0, date),
    queryFn: () => getDailyAttendance(sectionId!, date),
    enabled: Boolean(sectionId),
    placeholderData: keepPreviousData,
  });
}

export function useStudentAttendanceQuery(studentId: number, from?: string, to?: string) {
  return useQuery({
    queryKey: attendanceKeys.student(studentId, from, to),
    queryFn: () => getStudentAttendance(studentId, from, to),
    enabled: studentId > 0,
  });
}

function useAttendanceMutation<TVars, TData>(fn: (vars: TVars) => Promise<TData>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: attendanceKeys.all }),
  });
}

export const useCheckInMutation = () => useAttendanceMutation((studentId: number) => checkIn(studentId));
export const useCheckOutMutation = () => useAttendanceMutation((studentId: number) => checkOut(studentId));
export const useBulkAttendanceMutation = () =>
  useAttendanceMutation(({ sectionId, action }: { sectionId: number; action: 'check-in' | 'check-out' }) =>
    bulkAttendance(sectionId, action),
  );
export const useExcuseMutation = () =>
  useAttendanceMutation(({ studentId, date, note }: { studentId: number; date: string; note?: string }) =>
    excuseStudent(studentId, date, note),
  );
export const useUpdateAttendanceMutation = () =>
  useAttendanceMutation(({ id, payload }: { id: number; payload: UpdateAttendancePayload }) =>
    updateAttendance(id, payload),
  );
