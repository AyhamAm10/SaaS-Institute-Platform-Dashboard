import { IconFlag, IconLanguage, IconPray, IconUserCheck } from '@tabler/icons-react';
import {
  enrollmentSituationsResource,
  languagesResource,
  nationalitiesResource,
  religionsResource,
} from '@/src/core/api';
import { LookupConfig } from '../lookup/lookup.config';

const nameField = (label: string, placeholder: string) => ({
  name: 'name',
  label,
  type: 'text' as const,
  required: true,
  placeholder,
});

/**
 * The official lists: the student's identity (nationality, religion, foreign language)
 * and his situation each academic year. Every new institute starts with defaults.
 */
export const OFFICIAL_LIST_CONFIGS: LookupConfig[] = [
  {
    key: 'enrollment-situations',
    resource: enrollmentSituationsResource,
    title: 'أوضاع الطلاب',
    singular: 'وضع',
    description: 'وضع الطالب في كل سنة دراسية (مستجد، ناجح ويعيد، راسب...). يُختار في تسجيل الطالب بالسنة',
    icon: IconUserCheck,
    fields: [nameField('اسم الوضع', 'مثال: مستجد')],
    columns: [],
  },
  {
    key: 'nationalities',
    resource: nationalitiesResource,
    title: 'الجنسيات',
    singular: 'جنسية',
    description: 'جنسيات الطلاب كما تُكتب في القوائم والنماذج الرسمية',
    icon: IconFlag,
    fields: [nameField('الجنسية', 'مثال: عربي سوري')],
    columns: [],
  },
  {
    key: 'religions',
    resource: religionsResource,
    title: 'الديانات',
    singular: 'ديانة',
    description: 'تُستخدم في القوائم الرسمية وفي تجميع تقرير الطلاب',
    icon: IconPray,
    fields: [nameField('الديانة', 'مثال: مسلم')],
    columns: [],
  },
  {
    key: 'languages',
    resource: languagesResource,
    title: 'اللغات الأجنبية',
    singular: 'لغة',
    description: 'اللغة الأجنبية التي يدرسها الطالب، وهي لغة الامتحان الافتراضية للمتقدمين',
    icon: IconLanguage,
    fields: [nameField('اللغة', 'مثال: الإنكليزية')],
    columns: [],
  },
];
