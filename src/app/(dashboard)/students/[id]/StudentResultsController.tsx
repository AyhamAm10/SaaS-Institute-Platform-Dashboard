'use client';

import { useStudentResultsQuery } from '@/src/core/api';
import { StudentResultsTab } from './ui/StudentResultsTab';

/** Results tab: every mark and the average percentage per subject. */
export function StudentResultsController({ studentId }: { studentId: number }) {
  const { data, isLoading } = useStudentResultsQuery(studentId);
  return <StudentResultsTab results={data ?? null} isLoading={isLoading} />;
}
