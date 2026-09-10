import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export type ConflictSeverity = 'HARD' | 'SOFT';

export enum ConflictType {
  TEACHER_DOUBLE_BOOKING = 'TEACHER_DOUBLE_BOOKING',
  SECTION_DOUBLE_BOOKING = 'SECTION_DOUBLE_BOOKING',
  ROOM_DOUBLE_BOOKING = 'ROOM_DOUBLE_BOOKING',
  TEACHER_UNAVAILABLE = 'TEACHER_UNAVAILABLE',
  ROOM_UNAVAILABLE = 'ROOM_UNAVAILABLE',
  TEACHER_NOT_QUALIFIED = 'TEACHER_NOT_QUALIFIED',
  SCHEDULE_CONFIG_VIOLATION = 'SCHEDULE_CONFIG_VIOLATION',
  WEEKLY_PERIODS_MISMATCH = 'WEEKLY_PERIODS_MISMATCH',
}

export interface TimetableConflict {
  type: ConflictType | string;
  severity: ConflictSeverity;
  message: string;
  details?: Record<string, any>;
}

export interface TimetableEntry {
  id: number;
  timetableId: number;
  subjectId: number;
  teacherId: number;
  roomId?: number | null;
  dayOfWeek: number;
  periodNumber?: number | null;
  startTime: string;
  endTime: string;
  isLocked: boolean;
  createdAt?: string;
  updatedAt?: string;
  subject?: {
    id: number;
    name: string;
    code: string;
  };
  teacher?: {
    id: number;
    specialization?: string | null;
    user: {
      id: number;
      fullName: string;
      phone: string;
    };
  };
  room?: {
    id: number;
    name: string;
    type: string;
    capacity: number;
  } | null;
}

export interface Timetable {
  id: number;
  academicYearId: number;
  sectionId: number;
  name: string;
  entries: TimetableEntry[];
  conflicts: TimetableConflict[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveTimetableEntryPayload {
  id?: number;
  subjectId: number;
  teacherId: number;
  roomId?: number | null;
  dayOfWeek: number;
  periodNumber?: number;
  startTime: string;
  endTime: string;
  isLocked?: boolean;
}

export interface GenerateTimetablePayload {
  sectionIds?: number[];
  incremental?: boolean;
  lockExisting?: boolean;
}

export interface GenerateTimetableResult {
  success: boolean;
  totalGenerated: number;
  totalConflicts: number;
  conflicts: TimetableConflict[];
  unassignedRequirements: Array<{
    sectionId: number;
    subjectId: number;
    periodsRemaining: number;
    reason: string;
  }>;
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getTimetable(
  academicYearId: number,
  sectionId: number,
): Promise<Timetable> {
  const { data } = await apiClient.get<Timetable>(
    `/academic-years/${academicYearId}/sections/${sectionId}/timetable`,
  );
  return data;
}

export async function saveTimetableEntry(
  academicYearId: number,
  sectionId: number,
  payload: SaveTimetableEntryPayload,
): Promise<TimetableEntry> {
  const { data } = await apiClient.post<TimetableEntry>(
    `/academic-years/${academicYearId}/sections/${sectionId}/timetable/entries`,
    payload,
  );
  return data;
}

export async function deleteTimetableEntry(
  academicYearId: number,
  sectionId: number,
  entryId: number,
): Promise<void> {
  await apiClient.delete(
    `/academic-years/${academicYearId}/sections/${sectionId}/timetable/entries/${entryId}`,
  );
}

export async function generateTimetable(
  academicYearId: number,
  payload: GenerateTimetablePayload,
): Promise<GenerateTimetableResult> {
  const { data } = await apiClient.post<GenerateTimetableResult>(
    `/academic-years/${academicYearId}/timetable/generate`,
    payload,
  );
  return data;
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const timetablesKeys = {
  all: ['timetables'] as const,
  bySection: (yearId: number, sectionId: number) =>
    [...timetablesKeys.all, yearId, sectionId] as const,
};

export function useTimetableQuery(academicYearId: number, sectionId: number) {
  return useQuery({
    queryKey: timetablesKeys.bySection(academicYearId, sectionId),
    queryFn: () => getTimetable(academicYearId, sectionId),
    enabled: Boolean(academicYearId && sectionId),
  });
}

export function useSaveTimetableEntryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      academicYearId,
      sectionId,
      payload,
    }: {
      academicYearId: number;
      sectionId: number;
      payload: SaveTimetableEntryPayload;
    }) => saveTimetableEntry(academicYearId, sectionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: timetablesKeys.bySection(
          variables.academicYearId,
          variables.sectionId,
        ),
      });
    },
  });
}

export function useDeleteTimetableEntryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      academicYearId,
      sectionId,
      entryId,
    }: {
      academicYearId: number;
      sectionId: number;
      entryId: number;
    }) => deleteTimetableEntry(academicYearId, sectionId, entryId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: timetablesKeys.bySection(
          variables.academicYearId,
          variables.sectionId,
        ),
      });
    },
  });
}

export function useGenerateTimetableMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      academicYearId,
      payload,
    }: {
      academicYearId: number;
      payload: GenerateTimetablePayload;
    }) => generateTimetable(academicYearId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetablesKeys.all });
    },
  });
}
