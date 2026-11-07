import { UserProfile, UserRole } from '../api/types';

/**
 * Permission names (the API contract of role.md §8.6 on the server).
 * Only the names live here: WHICH role has which permission is decided by
 * the server and arrives in `user.permissions` (GET /auth/me).
 */
export const PERMISSIONS = {
  dashboardView: 'dashboard.view',
  studentsView: 'students.view',
  studentsManage: 'students.manage',
  attendanceView: 'attendance.view',
  attendanceManage: 'attendance.manage',
  feesView: 'fees.view',
  feesManage: 'fees.manage',
  examsView: 'exams.view',
  examsManage: 'exams.manage',
  marksEnter: 'marks.enter',
  academicView: 'academic.view',
  academicManage: 'academic.manage',
  settingsView: 'settings.view',
  settingsManage: 'settings.manage',
  staffView: 'staff.view',
  staffManage: 'staff.manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Roles allowed into the admin dashboard (families / students are not). */
export const DASHBOARD_ROLES: readonly string[] = [
  UserRole.SUPER_ADMIN,
  UserRole.INSTITUTE_ADMIN,
  UserRole.REGISTRAR,
  UserRole.ACCOUNTANT,
  UserRole.TEACHER,
];

export function canUseDashboard(user: UserProfile | null | undefined): boolean {
  return Boolean(user?.role && DASHBOARD_ROLES.includes(user.role));
}

export function hasPermission(user: UserProfile | null | undefined, permission: Permission): boolean {
  return Boolean(user?.permissions?.includes(permission));
}

/** Arabic label of a role (staff screen, header). */
export const ROLE_LABELS: Record<string, string> = {
  [UserRole.SUPER_ADMIN]: 'مدير المنصة',
  [UserRole.INSTITUTE_ADMIN]: 'مدير المعهد',
  [UserRole.REGISTRAR]: 'مسجّل',
  [UserRole.ACCOUNTANT]: 'محاسب',
  [UserRole.TEACHER]: 'مدرّس',
};
