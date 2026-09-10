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
    label: 'لوحة التحكم',
    icon: IconDashboard,
    href: '/',
  },
  {
    key: 'academic-years',
    label: 'السنوات الدراسية',
    icon: IconCalendarEvent,
    href: '/academic-years',
  },
  {
    key: 'sections',
    label: 'الشُعب والفصول',
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
    key: 'schedule-settings',
    label: 'إعدادات الدوام',
    icon: IconClock,
    href: '/schedule-settings',
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


