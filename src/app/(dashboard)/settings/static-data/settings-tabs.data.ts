import { ComponentType } from 'react';
import {
  IconBuildingSkyscraper,
  IconCalendar,
  IconCalendarOff,
  IconDatabase,
  IconHistory,
  IconListDetails,
  IconUserCog,
} from '@tabler/icons-react';
import { PERMISSIONS, Permission } from '@/src/core/auth';

export type SettingsTabKey =
  | 'institute'
  | 'schedule'
  | 'closures'
  | 'accounts'
  | 'audit'
  | 'student-fields'
  | 'reference-data';

export interface SettingsTabItem {
  key: SettingsTabKey;
  label: string;
  icon: ComponentType<{ size?: number | string; stroke?: number; className?: string }>;
  permission: Permission;
}

export const SETTINGS_TABS: SettingsTabItem[] = [
  {
    key: 'institute',
    label: 'المعهد',
    icon: IconBuildingSkyscraper,
    permission: PERMISSIONS.settingsView,
  },
  {
    key: 'schedule',
    label: 'أوقات الدوام والجدول',
    icon: IconCalendar,
    permission: PERMISSIONS.settingsView,
  },
  {
    key: 'closures',
    label: 'العطل',
    icon: IconCalendarOff,
    permission: PERMISSIONS.settingsView,
  },
  {
    key: 'accounts',
    label: 'إدارة الحسابات',
    icon: IconUserCog,
    permission: PERMISSIONS.staffView,
  },
  {
    key: 'audit',
    label: 'سجل التدقيق',
    icon: IconHistory,
    permission: PERMISSIONS.staffView,
  },
  {
    key: 'student-fields',
    label: 'حقول الطلاب المخصصة',
    icon: IconListDetails,
    permission: PERMISSIONS.settingsView,
  },
  {
    key: 'reference-data',
    label: 'الجداول المرجعية',
    icon: IconDatabase,
    permission: PERMISSIONS.settingsView,
  },
];

