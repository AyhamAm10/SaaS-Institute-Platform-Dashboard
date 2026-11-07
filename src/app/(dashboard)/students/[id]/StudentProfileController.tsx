'use client';

import { Student, useStudentDetailQuery } from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { type ProfileTab, StudentProfileView } from './ui/StudentProfileView';

/**
 * StudentProfileController
 *
 * Student profile page: identity header and tabs (finance, attendance,
 * results). Each tab hosts its own controller, mounted lazily by AppTabs,
 * so nothing loads until the tab is opened. Only the tabs the user's role
 * may view are offered (role.md §8.6).
 */
export function StudentProfileController({ studentId }: { studentId: number }) {
  const { data, isLoading } = useStudentDetailQuery(studentId);
  const { can } = useAuth();
  const tabs: ProfileTab[] = [];
  if (can(PERMISSIONS.feesView)) tabs.push('finance');
  if (can(PERMISSIONS.attendanceView)) tabs.push('attendance');
  if (can(PERMISSIONS.examsView)) tabs.push('results');

  return <StudentProfileView student={(data as Student | undefined) ?? null} isLoading={isLoading} tabs={tabs} />;
}
