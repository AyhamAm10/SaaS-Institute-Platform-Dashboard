import type { BadgeTone } from '@/src/components/controllers/badge/init/badge.init';
import type { ClosureScope } from '@/src/core/api';

export type ClosureStatus = 'ongoing' | 'upcoming' | 'past';

/** Labels of the closures (holidays) tab. */
export const closureLabels = {
  title: 'العطل',
  description: 'أيام لا يُسجَّل فيها حضور ولا تُحسب غياباً أو تأخيراً: للمعهد كله أو لفرع أو لشعب محددة',
  emptyMessage: 'لا توجد عطل',
  emptyDescription: 'أضف عطلة لتُستثنى أيامها من الحضور والغياب',
  create: 'عطلة جديدة',
  colReason: 'العطلة',
  colScope: 'النطاق',
  colPeriod: 'الفترة',
  colStatus: 'الحالة',
  colActions: 'إجراءات',
  edit: 'تعديل',
  remove: 'حذف',

  createTitle: 'عطلة جديدة',
  editTitle: 'تعديل العطلة',
  drawerDescription: 'في أيام العطلة لا يُسجَّل حضور للمشمولين بها، ولا تدخل في إحصاءات الحضور والغياب',
  reason: 'سبب العطلة',
  reasonPlaceholder: 'مثال: عطلة عيد الفطر',
  scope: 'نطاق العطلة',
  branch: 'الفرع',
  branchPlaceholder: 'اختر الفرع',
  sections: 'الشعب',
  sectionsHint: 'الشعب المعروضة هي شعب الفرع والعام الدراسي المختارين في أعلى الصفحة',
  noSections: 'لا توجد شعب في الفرع والعام الحاليين',
  fromDate: 'من تاريخ',
  toDate: 'إلى تاريخ',
  datePlaceholder: 'اختر التاريخ',
  save: 'حفظ',
  cancel: 'إلغاء',
  saveError: 'تعذّر حفظ العطلة',

  deleteTitle: 'حذف العطلة',
  deleteConfirm: (reason: string) =>
    `سيُحذف "${reason}" وتعود أيامها أياماً عادية. لا يُعاد احتساب غياب للأيام الماضية تلقائياً.`,
  confirmDelete: 'حذف',
  deleteError: 'تعذّر حذف العطلة',

  scopeInstitute: 'كل المعهد',
  days: (n: number) => (n === 1 ? 'يوم واحد' : `${n} أيام`),
  until: 'إلى',
  required: 'هذا الحقل مطلوب',
  invalidRange: 'تاريخ النهاية يجب ألا يسبق تاريخ البداية',
  branchRequired: 'اختر الفرع',
  sectionsRequired: 'اختر شعبة واحدة على الأقل',
  reasonShort: 'اكتب سبب العطلة (حرفان على الأقل)',
} as const;

export const SCOPE_OPTIONS: { value: ClosureScope; label: string }[] = [
  { value: 'INSTITUTE', label: 'كل المعهد' },
  { value: 'BRANCH', label: 'فرع محدد' },
  { value: 'SECTION', label: 'شعب محددة' },
];

export const SCOPE_TONES: Record<ClosureScope, BadgeTone> = {
  INSTITUTE: 'danger',
  BRANCH: 'warning',
  SECTION: 'info',
};

export const SCOPE_LABELS: Record<ClosureScope, string> = {
  INSTITUTE: 'المعهد',
  BRANCH: 'فرع',
  SECTION: 'شعب',
};

export const STATUS_LABELS: Record<ClosureStatus, string> = {
  ongoing: 'جارية',
  upcoming: 'قادمة',
  past: 'منتهية',
};

export const STATUS_TONES: Record<ClosureStatus, BadgeTone> = {
  ongoing: 'success',
  upcoming: 'info',
  past: 'neutral',
};
