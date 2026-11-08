import { ComponentType } from 'react';
import {
  IconBuildingSkyscraper,
  IconCalendar,
  IconDatabase,
  IconDeviceMobile,
  IconListDetails,
  IconUserCheck,
  IconUsers,
} from '@tabler/icons-react';
import { PERMISSIONS, Permission } from '@/src/core/auth';

export type SettingsTabKey =
  | 'institute'
  | 'schedule'
  | 'staff'
  | 'teachers'
  | 'mobile'
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
    key: 'staff',
    label: 'الموظفون والصلاحيات',
    icon: IconUsers,
    permission: PERMISSIONS.staffView,
  },
  {
    key: 'teachers',
    label: 'حسابات المعلمين',
    icon: IconUserCheck,
    permission: PERMISSIONS.academicManage,
  },
  {
    key: 'mobile',
    label: 'حسابات التطبيق',
    icon: IconDeviceMobile,
    permission: PERMISSIONS.studentsView,
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

