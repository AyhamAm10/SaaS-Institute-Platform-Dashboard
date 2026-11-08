import type { DashboardOverview } from '@/src/core/api';
import type { AttendanceRecord, AttendanceStatus, DailyAttendance, DailyAttendanceRow } from '@/src/core/api';

export interface SectionOption {
  value: string;
  label: string;
}

/** Correction form of one record (times as local `HH:mm`). */
export interface EditForm {
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  note: string;
}

export interface Notice {
  tone: 'success' | 'warning' | 'error';
  text: string;
}

/**
 * AttendanceState
 *
 * Daily attendance page: chosen section and date, the day roster with its
 * counters, per-student / bulk actions, and the excuse and edit modals.
 */
export interface AttendanceState {
  /** Home numbers (GET /dashboard/overview) for the KPI cards and charts. */
  overview: DashboardOverview | null;
  syncOverview: (overview: DashboardOverview | null) => void;
  /** Institute IANA time zone (times are shown / edited in it). */
  timeZone: string | undefined;
  sectionId: string | null;
  date: string;
  sectionOptions: SectionOption[];
  day: DailyAttendance | null;
  isLoading: boolean;

  busyStudentId: number | null;
  bulkBusy: 'check-in' | 'check-out' | null;
  notice: Notice | null;

  excuseRow: DailyAttendanceRow | null;
  excuseNote: string;
  editRecord: AttendanceRecord | null;
  editForm: EditForm;
  modalError: string | null;
  isSubmitting: boolean;

  setTimeZone: (timeZone: string | undefined) => void;
  setSectionId: (id: string | null) => void;
  setDate: (date: string) => void;
  setBusyStudentId: (id: number | null) => void;
  setBulkBusy: (action: 'check-in' | 'check-out' | null) => void;
  setNotice: (notice: Notice | null) => void;
  openExcuse: (row: DailyAttendanceRow) => void;
  setExcuseNote: (note: string) => void;
  openEdit: (record: AttendanceRecord) => void;
  setEditField: <K extends keyof EditForm>(key: K, value: EditForm[K]) => void;
  closeModals: () => void;
  setModalError: (error: string | null) => void;
  setIsSubmitting: (value: boolean) => void;
  syncDay: (day: DailyAttendance | null, isLoading: boolean) => void;
  syncSectionOptions: (options: SectionOption[]) => void;
}
