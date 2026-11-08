import type { ComponentType } from 'react';
import {
  IconCalendarCheck,
  IconCash,
  IconChartPie,
  IconPrinter,
  IconSchool,
  IconUserSearch,
} from '@tabler/icons-react';
import type { BadgeTone } from '@/src/components/controllers/badge/init/badge.init';
import type { ReportCategory, ReportParamKind } from '@/src/core/api';

/** Labels of the reports center and workspace (D3). */
export const reportsLabels = {
  title: 'التقارير والطباعة',
  description: 'كل تقارير المعهد في مكان واحد: معاينة، طباعة PDF، وتصدير Excel',
  search: 'ابحث عن تقرير...',
  all: 'الكل',
  empty: 'لا توجد تقارير مطابقة',
  emptyHint: 'جرّب كلمة أخرى أو فئة مختلفة',
  noAccess: 'لا توجد تقارير متاحة لحسابك',
  verifiable: 'موثّق برمز QR',
  needs: 'يحتاج',
  open: 'فتح التقرير',

  back: 'كل التقارير',
  params: 'معايير التقرير',
  show: 'عرض التقرير',
  print: 'طباعة / PDF',
  excel: 'Excel',
  excelError: 'تعذّر تنزيل ملف Excel',
  loadError: 'تعذّر إنشاء التقرير',
  pickParams: 'اختر المعايير ثم اضغط «عرض التقرير»',
  notFound: 'التقرير غير موجود أو لا تملك صلاحية فتحه',
  studentSearch: 'اكتب اسم الطالب...',
} as const;

export interface CategoryMeta {
  label: string;
  description: string;
  icon: ComponentType<{ size?: number; stroke?: number }>;
  tone: BadgeTone;
}

export const CATEGORY_META: Record<ReportCategory, CategoryMeta> = {
  student: { label: 'الطالب', description: 'مستندات طالب واحد', icon: IconUserSearch, tone: 'brand' },
  finance: { label: 'المالية', description: 'الصندوق والتحصيل والذمم', icon: IconCash, tone: 'success' },
  attendance: { label: 'الحضور', description: 'الحضور والغياب والمتابعة', icon: IconCalendarCheck, tone: 'info' },
  academic: { label: 'الأكاديمي', description: 'العلامات والبرامج والنصاب', icon: IconSchool, tone: 'warning' },
  sheets: { label: 'أوراق للطباعة', description: 'قوائم وأوراق تُعبّأ في الصف', icon: IconPrinter, tone: 'neutral' },
  admin: { label: 'الإدارة', description: 'إحصائيات ونشاط الموظفين', icon: IconChartPie, tone: 'ink' },
};

export const CATEGORY_ORDER: ReportCategory[] = ['student', 'finance', 'attendance', 'academic', 'sheets', 'admin'];

/** Arabic name of each parameter (form labels and card chips). */
export const PARAM_LABELS: Record<ReportParamKind, string> = {
  student: 'الطالب',
  section: 'الشعبة',
  exam: 'المذاكرة',
  teacher: 'المدرّس',
  date: 'اليوم',
  from: 'من تاريخ',
  to: 'إلى تاريخ',
  currency: 'العملة',
  paymentMethod: 'طريقة الدفع',
  minCount: 'الحد الأدنى (مرات)',
  days: 'عدد أيام الدوام',
  status: 'الحالة',
  city: 'المدينة',
  school: 'المدرسة',
  bus: 'الحافلة',
  knowWay: 'طريقة المعرفة',
  customFilters: 'الفلاتر المخصصة',
};

/** Every parameter kind, optional (print page: reads whatever the URL carries). */
export const REPORT_KINDS = (Object.keys(PARAM_LABELS) as ReportParamKind[]).map((kind) => ({ kind, required: false }));
