import {
  IconDashboard,
  IconSchool,
  IconUsers,
  IconReceipt2,
  IconSettings,
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
    key: 'academic',
    label: 'الشؤون الأكاديمية',
    icon: IconSchool,
    subItems: [
      { key: 'academic-years', label: 'السنوات الدراسية', href: '/academic/years' },
      { key: 'classes', label: 'الصفوف التعليمية', href: '/academic/classes' },
      { key: 'sections', label: 'الشُعب والفصول', href: '/academic/sections' },
      { key: 'subjects', label: 'المناهج والمقررات', href: '/academic/subjects' },
    ],
  },
  {
    key: 'people',
    label: 'الكوادر والطلاب',
    icon: IconUsers,
    subItems: [
      { key: 'students', label: 'سجلات الطلاب', href: '/people/students' },
      { key: 'parents', label: 'أولياء الأمور', href: '/people/parents' },
      { key: 'teachers', label: 'الكادر التدريسي', href: '/people/teachers' },
    ],
  },
  {
    key: 'accounting',
    label: 'الإدارة المالية',
    icon: IconReceipt2,
    subItems: [
      { key: 'accounting-overview', label: 'نظرة مالية عامة', href: '/accounting/overview' },
      { key: 'invoices', label: 'فواتير الرسوم', href: '/accounting/invoices' },
      { key: 'payments', label: 'سندات الدفع والتحصيل', href: '/accounting/payments' },
    ],
  },
  {
    key: 'settings',
    label: 'إعدادات النظام',
    icon: IconSettings,
    subItems: [
      { key: 'institute-settings', label: 'بيانات المعهد والفرع', href: '/settings/institute' },
      { key: 'users-roles', label: 'المستخدمين والأدوار', href: '/settings/roles' },
    ],
  },
];
