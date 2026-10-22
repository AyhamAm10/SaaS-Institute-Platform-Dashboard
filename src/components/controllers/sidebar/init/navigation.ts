import {
  IconDashboard,
  IconCalendarEvent,
  IconLayoutGrid,
  IconSchool,
  IconBook,
  IconUserCheck,
  IconBuildingCommunity,
  IconCalendarTime,
  IconClock,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { ComponentType } from 'react';

export interface NavSubItem {
  key: string;
  label: string;
  href: string;
  badge?: string | number;
}

export interface NavItem {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number | string; stroke?: number; className?: string }>;
  href?: string;
  badge?: string | number;
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
  },
  {
    key: 'students',
    label: 'الطلاب والعائلات',
    icon: IconUsers,
    href: '/students',
  },
  {
    key: 'sections',
    label: 'الشعب والفصول',
    icon: IconLayoutGrid,
    href: '/sections',
  },
  {
    key: 'subjects',
    label: 'المواد الدراسية',
    icon: IconBook,
    href: '/subjects',
  },
  {
    key: 'teachers',
    label: 'الكادر التدريسي',
    icon: IconUserCheck,
    href: '/teachers',
  },
  {
    key: 'rooms',
    label: 'القاعات والمختبرات',
    icon: IconBuildingCommunity,
    href: '/rooms',
  },
  {
    key: 'timetable',
    label: 'الجدول الأسبوعي',
    icon: IconCalendarTime,
    href: '/timetable',
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
      },
      {
        key: 'academic-years',
        label: 'السنوات الدراسية',
        href: '/academic-years',
      },
      {
        key: 'schedule-settings',
        label: 'إعدادات الدوام',
        href: '/schedule-settings',
      },
      {
        key: 'student-fields',
        label: 'الحقول المخصصة للطلاب',
        href: '/settings/student-fields',
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


