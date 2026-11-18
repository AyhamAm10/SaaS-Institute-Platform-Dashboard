'use client';

import { useState } from 'react';
import {
  getApiErrorMessage,
  useBulkAttendanceMutation,
  useDailyAttendanceQuery,
  useOverdueInstallmentsQuery,
  useTimetableQuery,
} from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { sectionDetailLabels as labels } from './static-data/section-detail.data';
import { SectionAttendanceTab } from './ui/SectionAttendanceTab';
import { SectionFinanceTab } from './ui/SectionFinanceTab';
import { SectionTimetableTab } from './ui/SectionTimetableTab';

/** Weekly timetable of the section in its academic year. */
export function SectionTimetableController({ sectionId, yearId }: { sectionId: number; yearId: number }) {
  const { data, isLoading } = useTimetableQuery(yearId, sectionId);
  return <SectionTimetableTab timetable={data ?? null} isLoading={isLoading} />;
}

/** Today's roster of the section (institute time zone) with bulk check-in / check-out. */
export function SectionAttendanceController({ sectionId }: { sectionId: number }) {
  const { data, isLoading } = useDailyAttendanceQuery(sectionId);
  const { can, user } = useAuth();
  const bulk = useBulkAttendanceMutation();
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const run = async (action: 'check-in' | 'check-out') => {
    setNotice(null);
    try {
      const result = await bulk.mutateAsync({ sectionId, action });
      setNotice({ tone: 'success', text: labels.bulkDone(result.done.length, result.skipped.length) });
    } catch (err: unknown) {
      setNotice({ tone: 'error', text: getApiErrorMessage(err, labels.assignError) });
    }
  };

  return (
    <SectionAttendanceTab
      daily={data ?? null}
      isLoading={isLoading}
      timeZone={user?.institute?.timezone ?? undefined}
      canManage={can(PERMISSIONS.attendanceManage)}
      isBusy={bulk.isPending}
      notice={notice}
      onBulk={run}
    />
  );
}

/** Overdue installments of the section's students. */
export function SectionFinanceController({ sectionId }: { sectionId: number }) {
  const { data, isLoading } = useOverdueInstallmentsQuery({ sectionId, limit: 50 });
  return <SectionFinanceTab rows={data?.data ?? []} isLoading={isLoading} />;
}
