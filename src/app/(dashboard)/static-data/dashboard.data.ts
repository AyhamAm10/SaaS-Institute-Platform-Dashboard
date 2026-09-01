import {
  IconCoin,
  IconSchool,
  IconUserCheck,
  IconUsers,
} from '@tabler/icons-react';
import { ComponentType } from 'react';

export interface StatCardItem {
  title: string;
  value: string;
  diff: string;
  icon: ComponentType<{ size?: number | string; stroke?: number; className?: string }>;
  color: string;
}

export interface RecentEnrollmentItem {
  id: number;
  name: string;
  grade: string;
  date: string;
  status: 'مسجل' | 'بانتظار السداد';
}

export const statCardsData: StatCardItem[] = [
  {
    title: 'إجمالي الطلاب المقيدين',
    value: '1,420 طالب',
    diff: '+12%',
    icon: IconUsers,
    color: 'primary',
  },
  {
    title: 'الكادر التدريسي والتعليمي',
    value: '68 معلماً',
    diff: '+4%',
    icon: IconUserCheck,
    color: 'teal',
  },
  {
    title: 'الشُعب والقاعات النشطة',
    value: '32 شُعبة',
    diff: 'إشغال 100%',
    icon: IconSchool,
    color: 'indigo',
  },
  {
    title: 'التحصيل المالي لهذا الشهر',
    value: '84,250 $',
    diff: '+18.4%',
    icon: IconCoin,
    color: 'green',
  },
];

export const recentEnrollmentsData: RecentEnrollmentItem[] = [
  { id: 1, name: 'زيد بن عبد الله الحربي', grade: 'الصف العاشر - شُعبة (أ)', date: '2026-09-01', status: 'مسجل' },
  { id: 2, name: 'سارة بنت منصور العلي', grade: 'الصف الحادي عشر - شُعبة (ب)', date: '2026-08-31', status: 'مسجل' },
  { id: 3, name: 'عمر بن خالد الدوسري', grade: 'الصف التاسع - شُعبة (أ)', date: '2026-08-30', status: 'بانتظار السداد' },
  { id: 4, name: 'ليلى بنت محمود القحطاني', grade: 'الصف الثاني عشر - شُعبة (ج)', date: '2026-08-29', status: 'مسجل' },
  { id: 5, name: 'حمزة بن محمد العتيبي', grade: 'الصف العاشر - شُعبة (ب)', date: '2026-08-28', status: 'مسجل' },
];
