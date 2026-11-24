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
  /** Reading one's own exam supervisions (the supervisor role has only this). */
  supervisionView: 'supervision.view',
  /** The follow-up portal of guardians and students (their only permission). */
  portalView: 'portal.view',
  /** Deleting students and families (not given to the data-entry role). */
  recordsDelete: 'records.delete',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Roles that may sign in to the web dashboard (guardians and students only reach the portal page). */
export const DASHBOARD_ROLES: readonly string[] = [
  UserRole.SUPER_ADMIN,
  UserRole.INSTITUTE_ADMIN,
  UserRole.REGISTRAR,
  UserRole.DATA_ENTRY,
  UserRole.ACCOUNTANT,
  UserRole.SUPERVISOR,
  UserRole.TEACHER,
  UserRole.FAMILY,
  UserRole.STUDENT,
];

/**
 * Roles with no branch / academic year to choose: the platform admin works across institutes, and
 * a supervisor, a guardian and a student read only their own data (no headers needed).
 */
const NO_CONTEXT_ROLES: readonly string[] = [UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FAMILY, UserRole.STUDENT];

/** Whether the role works inside a branch and an academic year (the header pickers and the lookups). */
export function needsOperationalContext(role: string | undefined | null): boolean {
  return !role || !NO_CONTEXT_ROLES.includes(role);
}

export function canUseDashboard(user: UserProfile | null | undefined): boolean {
  return Boolean(user?.role && DASHBOARD_ROLES.includes(user.role));
}

export function hasPermission(user: UserProfile | null | undefined, permission: Permission): boolean {
  return Boolean(user?.permissions?.includes(permission));
}

/** Arabic label of a role (staff screen, header). */
export const ROLE_LABELS: Record<string, string> = {
  [UserRole.SUPER_ADMIN]: 'مدير المنصة',
  [UserRole.INSTITUTE_ADMIN]: 'مدير عام',
  [UserRole.REGISTRAR]: 'إداري',
  [UserRole.DATA_ENTRY]: 'مدخل بيانات',
  [UserRole.ACCOUNTANT]: 'محاسب',
  [UserRole.SUPERVISOR]: 'مشرفة',
  [UserRole.FAMILY]: 'ولي أمر',
  [UserRole.STUDENT]: 'طالب',
  [UserRole.TEACHER]: 'مدرّس',
};
