import {
  IconDashboard,
  IconLayoutGrid,
  IconSchool,
  IconBook,
  IconUserCheck,
  IconBuildingCommunity,
  IconCalendarTime,
  IconSettings,
  IconUsers,
  IconCash,
  IconCalendarCheck,
  IconClipboardList,
  IconReportAnalytics,
} from '@tabler/icons-react';
import { ComponentType } from 'react';
import { PERMISSIONS, type Permission } from '@/src/core/auth/permissions';

export interface NavSubItem {
  key: string;
  label: string;
  href: string;
  badge?: string | number;
  /** Permission needed to see the entry and open the page (role.md §8.6). */
  permission?: Permission;
}

export interface NavItem {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number | string; stroke?: number; className?: string }>;
  href?: string;
  badge?: string | number;
  /** Permission needed to see a leaf entry (groups show when any sub-item is visible). */
  permission?: Permission;
  subItems?: NavSubItem[];
}

/**
 * Authoritative Navigation Schema (Arabic) for SaaS Institute Admin Dashboard
 */
export const defaultNavigationConfig: NavItem[] = [
  {
    key: 'dashboard',
    label: 'لوحة التحكم الإحصائية',
    icon: IconDashboard,
    href: '/',
    permission: PERMISSIONS.dashboardView,
  },
  {
    key: 'students',
    label: 'الطلاب والعائلات',
    icon: IconUsers,
    subItems: [
      {
        key: 'students-list',
        label: 'سجل الطلاب',
        href: '/students',
        permission: PERMISSIONS.studentsView,
      },
      {
        key: 'families',
        label: 'العائلات وأولياء الأمور',
        href: '/families',
        permission: PERMISSIONS.studentsView,
      },
    ],
  },
  {
    key: 'attendance',
    label: 'الحضور والانصراف',
    icon: IconCalendarCheck,
    href: '/attendance',
    permission: PERMISSIONS.attendanceView,
  },
  {
    key: 'exams',
    label: 'المذاكرات والعلامات',
    icon: IconClipboardList,
    href: '/exams',
    permission: PERMISSIONS.examsView,
  },
  {
    key: 'finance',
    label: 'المالية والأقساط',
    icon: IconCash,
    subItems: [
      { key: 'payments', label: 'الدفعات والإيصالات', href: '/payments', permission: PERMISSIONS.feesView },
      { key: 'overdue-installments', label: 'الأقساط المتأخرة', href: '/overdue-installments', permission: PERMISSIONS.feesView },
    ],
  },
  {
    // Every dashboard reader; the catalog itself is filtered by permission (D3)
    key: 'reports',
    label: 'التقارير والطباعة',
    icon: IconReportAnalytics,
    href: '/reports',
  },
  {
    key: 'sections',
    label: 'الشعب والفصول',
    icon: IconLayoutGrid,
    href: '/sections',
    permission: PERMISSIONS.academicView,
  },
  {
    key: 'subjects',
    label: 'المواد الدراسية',
    icon: IconBook,
    href: '/subjects',
    permission: PERMISSIONS.academicView,
  },
  {
    key: 'teachers',
    label: 'الكادر التدريسي',
    icon: IconUserCheck,
    href: '/teachers',
    permission: PERMISSIONS.academicView,
  },
  {
    key: 'rooms',
    label: 'القاعات والمختبرات',
    icon: IconBuildingCommunity,
    href: '/rooms',
    permission: PERMISSIONS.academicView,
  },
  {
    key: 'timetable',
    label: 'الجدول الأسبوعي',
    icon: IconCalendarTime,
    href: '/timetable',
    permission: PERMISSIONS.academicView,
  },
  {
    key: 'settings',
    label: 'الإعدادات والتأسيس',
    icon: IconSettings,
    subItems: [
      {
        key: 'branches',
        label: 'الفروع الجغرافية',
        href: '/branches',
        permission: PERMISSIONS.academicManage,
      },
      {
        key: 'academic-years',
        label: 'السنوات الدراسية',
        href: '/academic-years',
        permission: PERMISSIONS.academicManage,
      },
      {
        key: 'schedule-settings',
        label: 'إعدادات الدوام',
        href: '/schedule-settings',
        permission: PERMISSIONS.settingsManage,
      },
      {
        key: 'student-fields',
        label: 'الحقول المخصصة للطلاب',
        href: '/settings/student-fields',
        permission: PERMISSIONS.settingsManage,
      },
      {
        key: 'reference-data',
        label: 'الجداول المرجعية',
        href: '/settings/reference-data',
        permission: PERMISSIONS.settingsManage,
      },
      {
        key: 'staff',
        label: 'الموظفون والصلاحيات',
        href: '/settings/staff',
        permission: PERMISSIONS.staffView,
      },
    ],
  },
];

/**
 * Authoritative Navigation Schema (Arabic) for Platform Super Admin
 */
export const superAdminNavigationConfig: NavItem[] = [
  {
    key: 'dashboard',
    label: 'لوحة التحكم المركزية',
    icon: IconDashboard,
    href: '/',
  },
  {
    key: 'institutes',
    label: 'المعاهد التعليمية',
    icon: IconSchool,
    href: '/institutes',
  },
];


