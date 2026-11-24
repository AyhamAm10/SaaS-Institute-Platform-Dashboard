import type {
  PortalAttendanceMonth,
  PortalFinance,
  PortalMe,
  PortalNote,
  PortalOverview,
  PortalResults,
  PortalTimetable,
} from '@/src/core/api';

/** What each tab loads (one slot per part of the child's follow-up). */
export interface PortalSlots {
  overview: PortalOverview;
  attendance: PortalAttendanceMonth;
  timetable: PortalTimetable;
  results: PortalResults;
  finance: PortalFinance;
  notes: PortalNote[];
}

export type PortalSlotKey = keyof PortalSlots;

export interface PortalSlot<T> {
  data: T | null;
  isLoading: boolean;
}

/**
 * The follow-up portal: the signed-in guardian or student, the chosen child, and the part of his
 * follow-up each opened tab has loaded. Filled by the query-sync components (never by the UI).
 */
export interface PortalState {
  me: PortalMe | null;
  meLoading: boolean;
  /** IANA zone of the institute: every time of the day is shown in it. */
  timeZone: string;
  childId: number | null;
  /** `YYYY-MM` of the attendance tab; empty = the institute's current month. */
  month: string;
  slots: { [K in PortalSlotKey]: PortalSlot<PortalSlots[K]> };

  syncMe: (me: PortalMe | null, isLoading: boolean, timeZone: string) => void;
  selectChild: (childId: number) => void;
  setMonth: (month: string) => void;
  syncSlot: <K extends PortalSlotKey>(key: K, data: PortalSlots[K] | null, isLoading: boolean) => void;
}
