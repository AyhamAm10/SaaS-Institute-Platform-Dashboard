'use client';

import { useAuth } from '@/src/core/auth';
import { useStudentAttendanceQuery } from '@/src/core/api';
import { StudentAttendanceTab } from './ui/StudentAttendanceTab';

/** Attendance tab: last 30 days (server default range), times in the institute zone. */
export function StudentAttendanceController({ studentId }: { studentId: number }) {
  const { data, isLoading } = useStudentAttendanceQuery(studentId);
  const timeZone = useAuth().user?.institute?.timezone ?? undefined;
  return <StudentAttendanceTab history={data ?? null} isLoading={isLoading} timeZone={timeZone} />;
}
