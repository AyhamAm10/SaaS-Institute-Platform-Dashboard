import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import type { Currency } from './fees.api';

/**
 * Dashboard home numbers (phase 3 D1): GET /dashboard/overview.
 * Scoped by the branch / academic-year headers (apiClient adds them);
 * dates are local to the institute.
 */

export interface DashboardDayCounts {
  present: number;
  late: number;
  absent: number;
  excused: number;
  notRecorded: number;
}

export interface DashboardAttendanceDay {
  date: string;
  /** 0 = Sunday … 6 = Saturday. */
  dayOfWeek: number;
  attended: number;
  recorded: number;
  rate: number | null;
}

export interface DashboardFinanceRow {
  currency: Currency;
  collectedThisMonth: number;
  remaining: number;
  overdue: number;
  overdueInstallments: number;
}

export interface DashboardSectionRow {
  id: number;
  name: string;
  students: number;
  attendedToday: number;
  averagePercent: number | null;
}

export interface DashboardUpcomingExam {
  id: number;
  title: string;
  examDate: string;
  section: { id: number; name: string };
  subject: { id: number; name: string };
}

export interface DashboardOverview {
  today: string;
  isWorkingDay: boolean;
  academicYear: { id: number; name: string } | null;
  students: { active: number; unassigned: number; newThisMonth: number };
  teachers: number;
  sections: DashboardSectionRow[];
  attendance: {
    today: DashboardDayCounts & { rate: number | null };
    week: DashboardAttendanceDay[];
  };
  finance: {
    currencies: DashboardFinanceRow[];
    monthly: { month: string; currency: Currency; amount: number }[];
  };
  exams: { upcoming: DashboardUpcomingExam[]; averagePercent30d: number | null };
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const { data } = await apiClient.get<DashboardOverview>('/dashboard/overview');
  return data;
}

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
};

/** Refreshed every minute so today's attendance stays current. */
export function useDashboardOverviewQuery() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: getDashboardOverview,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
