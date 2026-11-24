import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';

/**
 * The follow-up portal of a guardian or a student: the read-only `/mobile/...` API (the same one the
 * parents app uses; every read is limited to the caller's own children). Dates are `YYYY-MM-DD`,
 * times `HH:mm`, instants ISO, money in its own currency (SYP and USD are never summed).
 */

export type PortalAttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type PortalCurrency = 'SYP' | 'USD';
export type PortalWeekday = 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

interface NamedRef {
  id: number;
  name: string;
}

export interface PortalChild {
  id: number;
  fullName: string;
  gender: 'MALE' | 'FEMALE';
  section: NamedRef | null;
  branch: NamedRef;
  statusName: string | null;
}

export interface PortalMe {
  role: 'FAMILY' | 'STUDENT';
  displayName: string;
  children: PortalChild[];
}

export interface PortalLesson {
  id: number;
  subject: string;
  startTime: string;
  endTime: string;
  room: string | null;
  teacher: string | null;
}

export interface PortalCounts {
  present: number;
  late: number;
  absent: number;
  excused: number;
}

export interface PortalCurrencyTotals {
  currency: PortalCurrency;
  total: number;
  paid: number;
  remaining: number;
  overdue: number;
}

export interface PortalExamRef {
  examId: number;
  subject: string;
  title: string;
  date: string;
}

export interface PortalOverview {
  student: { id: number; fullName: string; section: NamedRef | null; branch: NamedRef };
  today: {
    date: string;
    isWorkingDay: boolean;
    attendance: { status: PortalAttendanceStatus | null; checkInAt: string | null; checkOutAt: string | null };
    lessons: PortalLesson[];
  };
  attendance30d: PortalCounts & { ratePercent: number | null };
  marks: {
    averagePercent: number | null;
    latest: (PortalExamRef & { score: number; max: number; percent: number })[];
    upcoming: PortalExamRef[];
  };
  /** null for a STUDENT account. */
  finance: null | {
    currencies: PortalCurrencyTotals[];
    nextDue: { amount: number; currency: PortalCurrency; dueDate: string } | null;
  };
}

export interface PortalAttendanceMonth {
  month: string;
  days: {
    date: string;
    status: PortalAttendanceStatus;
    checkInAt: string | null;
    checkOutAt: string | null;
    note: string | null;
  }[];
  counts: PortalCounts;
  ratePercent: number | null;
}

export interface PortalTimetable {
  days: {
    weekday: PortalWeekday;
    slots: { startTime: string; endTime: string; subject: string; teacher: string | null; room: string | null }[];
  }[];
}

export interface PortalResults {
  averagePercent: number | null;
  subjects: {
    subjectId: number;
    subject: string;
    averagePercent: number | null;
    results: {
      examId: number;
      title: string;
      date: string;
      score: number | null;
      max: number;
      percent: number | null;
      status: string;
    }[];
  }[];
  upcoming: PortalExamRef[];
}

export interface PortalFinance {
  totals: PortalCurrencyTotals[];
  contracts: {
    id: number;
    yearName: string;
    currency: PortalCurrency;
    total: number;
    discount: number;
    paid: number;
    remaining: number;
    installments: {
      id: number;
      number: number;
      dueDate: string;
      amount: number;
      paid: number;
      remaining: number;
      status: 'PAID' | 'PARTIAL' | 'DUE' | 'OVERDUE' | 'CANCELLED';
    }[];
  }[];
  payments: {
    id: number;
    receiptNumber: string;
    date: string;
    amount: number;
    currency: PortalCurrency;
    method: string;
    status: 'ACTIVE' | 'CANCELLED';
  }[];
}

export interface PortalNote {
  id: number;
  body: string;
  createdAt: string;
  author: string | null;
}

export const portalKeys = {
  all: ['portal'] as const,
  me: () => [...portalKeys.all, 'me'] as const,
  of: (childId: number, part: string, extra?: string) => [...portalKeys.all, childId, part, extra ?? ''] as const,
};

const get = async <T>(path: string) => (await apiClient.get<T>(`/mobile${path}`)).data;

export const usePortalMeQuery = () => useQuery({ queryKey: portalKeys.me(), queryFn: () => get<PortalMe>('/me') });

/** One part of one child's follow-up; `enabled` keeps a tab's request from firing before it is opened. */
function usePortalPart<T>(childId: number | null, part: string, path: string, enabled = true, extra?: string) {
  return useQuery({
    queryKey: portalKeys.of(childId ?? 0, part, extra),
    queryFn: () => get<T>(`/students/${childId}${path}`),
    enabled: enabled && childId !== null,
  });
}

export const usePortalOverviewQuery = (childId: number | null) =>
  usePortalPart<PortalOverview>(childId, 'overview', '/overview');
/** `month` = `YYYY-MM`; empty = the current month of the institute. */
export const usePortalAttendanceQuery = (childId: number | null, month: string) =>
  usePortalPart<PortalAttendanceMonth>(childId, 'attendance', month ? `/attendance?month=${month}` : '/attendance', true, month);
export const usePortalTimetableQuery = (childId: number | null) =>
  usePortalPart<PortalTimetable>(childId, 'timetable', '/timetable');
export const usePortalResultsQuery = (childId: number | null) => usePortalPart<PortalResults>(childId, 'results', '/results');
export const usePortalFinanceQuery = (childId: number | null) => usePortalPart<PortalFinance>(childId, 'finance', '/finance');
export const usePortalNotesQuery = (childId: number | null) => usePortalPart<PortalNote[]>(childId, 'notes', '/notes');
