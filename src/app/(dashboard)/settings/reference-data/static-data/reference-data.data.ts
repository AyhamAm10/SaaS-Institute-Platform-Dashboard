import {
  IconBuildingCommunity,
  IconBus,
  IconClipboardText,
  IconMapPin,
  IconSpeakerphone,
  IconTags,
} from '@tabler/icons-react';
import {
  busesResource,
  citiesResource,
  examTypesResource,
  knowWaysResource,
  schoolsResource,
  StatusTone,
  studentStatusesResource,
} from '@/src/core/api';
import type { BadgeTone } from '@/src/components/controllers';
import { LookupConfig } from '../lookup/lookup.config';

export const referenceDataLabels = {
  title: 'الجداول المرجعية',
  description: 'القوائم الأساسية التي تُستخدم في بيانات الطلاب والمذاكرات',
};

/** Student status tones → StatusBadge tones, with Arabic labels. */
export const STATUS_TONES: Record<StatusTone, { badge: BadgeTone; label: string }> = {
  SUCCESS: { badge: 'success', label: 'أخضر (إيجابي)' },
  WARNING: { badge: 'warning', label: 'برتقالي (تنبيه)' },
  DANGER: { badge: 'danger', label: 'أحمر (سلبي)' },
  INFO: { badge: 'info', label: 'أزرق (معلومة)' },
  NEUTRAL: { badge: 'neutral', label: 'رمادي (محايد)' },
  BRAND: { badge: 'brand', label: 'لون المعهد' },
};

export const TONE_OPTIONS = (Object.keys(STATUS_TONES) as StatusTone[]).map((tone) => ({
  value: tone,
  label: STATUS_TONES[tone].label,
}));

const nameField = (label: string, placeholder: string) => ({
  name: 'name',
  label,
  type: 'text' as const,
  required: true,
  placeholder,
});

/** One entry per tab. Order = tab order. */
export const LOOKUP_CONFIGS: LookupConfig[] = [
  {
    key: 'cities',
    resource: citiesResource,
    title: 'المدن',
    singular: 'مدينة',
    description: 'مدن سكن الطلاب ومواقع المدارس',
    icon: IconMapPin,
    fields: [nameField('اسم المدينة', 'مثال: دمشق')],
    columns: [],
  },
  {
    key: 'schools',
    resource: schoolsResource,
    title: 'المدارس',
    singular: 'مدرسة',
    description: 'المدارس الأصلية التي يدرس فيها الطلاب',
    icon: IconBuildingCommunity,
    fields: [
      nameField('اسم المدرسة', 'مثال: ثانوية الباسل'),
      { name: 'cityId', label: 'المدينة', type: 'select', options: 'cities', defaultValue: null },
    ],
    columns: [{ field: 'cityId', title: 'المدينة', render: 'option', options: 'cities' }],
  },
  {
    key: 'buses',
    resource: busesResource,
    title: 'الباصات',
    singular: 'باص',
    description: 'باصات النقل التابعة للفرع النشط',
    icon: IconBus,
    fields: [
      nameField('اسم الباص', 'مثال: باص المزة'),
      { name: 'plateNumber', label: 'رقم اللوحة', type: 'text' },
      { name: 'driverName', label: 'اسم السائق', type: 'text' },
      { name: 'driverPhone', label: 'هاتف السائق', type: 'tel' },
      { name: 'capacity', label: 'عدد المقاعد', type: 'number', defaultValue: null },
      { name: 'isActive', label: 'الباص في الخدمة', type: 'switch', defaultValue: true },
    ],
    columns: [
      { field: 'driverName', title: 'السائق', render: 'text' },
      { field: 'driverPhone', title: 'هاتف السائق', render: 'phone' },
      { field: 'capacity', title: 'المقاعد', render: 'text' },
      { field: 'isActive', title: 'الحالة', render: 'active' },
    ],
  },
  {
    key: 'know-ways',
    resource: knowWaysResource,
    title: 'طرق المعرفة',
    singular: 'طريقة معرفة',
    description: 'كيف تعرّف الطالب أو أهله على المعهد',
    icon: IconSpeakerphone,
    fields: [nameField('طريقة المعرفة', 'مثال: صديق، إعلان، فيسبوك')],
    columns: [],
  },
  {
    key: 'student-statuses',
    resource: studentStatusesResource,
    title: 'حالات الطلاب',
    singular: 'حالة',
    description: 'حالة وصفية للطالب في المعهد. الحالة الافتراضية تُعطى لكل طالب جديد',
    icon: IconTags,
    fields: [
      nameField('اسم الحالة', 'مثال: مستمر'),
      { name: 'tone', label: 'لون الحالة', type: 'tone', defaultValue: 'NEUTRAL' },
      { name: 'sortOrder', label: 'ترتيب العرض', type: 'number', defaultValue: 0 },
      {
        name: 'isDefault',
        label: 'الحالة الافتراضية للطلاب الجدد',
        type: 'switch',
        defaultValue: false,
        description: 'تفعيلها يلغي الحالة الافتراضية السابقة',
      },
      { name: 'isActive', label: 'الحالة مفعّلة', type: 'switch', defaultValue: true },
    ],
    columns: [
      { field: 'tone', title: 'المظهر', render: 'tone' },
      { field: 'isDefault', title: 'افتراضية', render: 'default' },
      { field: 'isActive', title: 'الحالة', render: 'active' },
    ],
  },
  {
    key: 'exam-types',
    resource: examTypesResource,
    title: 'أنواع المذاكرات',
    singular: 'نوع مذاكرة',
    description: 'تصنيف المذاكرات (أسبوعية، شهرية، نصفية...)',
    icon: IconClipboardText,
    fields: [nameField('نوع المذاكرة', 'مثال: مذاكرة شهرية')],
    columns: [],
  },
];
