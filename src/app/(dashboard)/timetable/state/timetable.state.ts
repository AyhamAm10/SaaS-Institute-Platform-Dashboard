import {
  GenerateTimetableResult,
  ScheduleConfig,
  Section,
  Subject,
  Teacher,
  Room,
  Timetable,
  TimetableConflict,
  TimetableEntry,
} from '@/src/core/api';

export interface TimetableEntryFormState {
  id?: number;
  subjectId: number | null;
  teacherId: number | null;
  roomId: number | null;
  dayOfWeek: number;
  periodNumber: number;
  startTime: string;
  endTime: string;
  isLocked: boolean;
}

export interface TimetableState {
  // ── Selected Context ──
  academicYearId: number | null;
  sectionId: number | null;

  // ── Query-derived Data ──
  timetable: Timetable | null;
  scheduleConfig: ScheduleConfig | null;
  sections: Section[];
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  conflicts: TimetableConflict[];

  isLoading: boolean;
  isFetching: boolean;
  isGenerating: boolean;

  // ── Entry Modal (Manual Slot Editor) ──
  entryModalOpened: boolean;
  entryForm: TimetableEntryFormState;
  entryFormError: string | null;
  isSavingEntry: boolean;

  // ── Generate Modal (Automated CSP Scheduler) ──
  generateModalOpened: boolean;
  generateIncremental: boolean;
  generateLockExisting: boolean;
  generateResult: GenerateTimetableResult | null;
  generateError: string | null;

  // ── Delete Confirmation ──
  deleteEntryId: number | null;
  isDeletingEntry: boolean;

  // ── Actions: Context Selection ──
  setAcademicYearId: (yearId: number | null) => void;
  setSectionId: (sectionId: number | null) => void;

  // ── Actions: Entry Modal ──
  openCreateEntryModal: (slot: {
    dayOfWeek: number;
    periodNumber: number;
    startTime: string;
    endTime: string;
  }) => void;
  openEditEntryModal: (entry: TimetableEntry) => void;
  closeEntryModal: () => void;
  setEntryFormField: <K extends keyof TimetableEntryFormState>(
    field: K,
    value: TimetableEntryFormState[K],
  ) => void;
  setEntryFormError: (error: string | null) => void;
  setIsSavingEntry: (saving: boolean) => void;

  // ── Actions: Generate Modal ──
  openGenerateModal: () => void;
  closeGenerateModal: () => void;
  setGenerateIncremental: (incremental: boolean) => void;
  setGenerateLockExisting: (lockExisting: boolean) => void;
  setGenerateResult: (result: GenerateTimetableResult | null) => void;
  setGenerateError: (error: string | null) => void;
  setIsGenerating: (generating: boolean) => void;

  // ── Actions: Delete ──
  setDeleteEntryId: (id: number | null) => void;
  setIsDeletingEntry: (deleting: boolean) => void;

  // ── Actions: Sync Query Data ──
  syncTimetableData: (payload: {
    timetable: Timetable | null;
    scheduleConfig: ScheduleConfig | null;
    sections: Section[];
    teachers: Teacher[];
    rooms: Room[];
    isLoading: boolean;
    isFetching: boolean;
  }) => void;
}
