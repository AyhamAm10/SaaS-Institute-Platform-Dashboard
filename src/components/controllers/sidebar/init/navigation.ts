import {
  IconDashboard,
  IconCalendarEvent,
  IconLayoutGrid,
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
];

