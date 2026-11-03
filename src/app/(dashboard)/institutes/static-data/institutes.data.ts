import { FeatureKey } from '@/src/core/api';

/** Default brand colors proposed for a new institute (editable in the form). */
export const DEFAULT_INSTITUTE_COLORS = {
  primary: '#1a73e8',
  secondary: '#34a853',
} as const;

/** Time zone of a new institute (Syria). */
export const DEFAULT_INSTITUTE_TIMEZONE = 'Asia/Damascus';

/** Time zones offered in the institute form (IANA names, Arabic labels). */
export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Damascus', label: 'دمشق (Asia/Damascus)' },
  { value: 'Asia/Beirut', label: 'بيروت (Asia/Beirut)' },
  { value: 'Asia/Amman', label: 'عمّان (Asia/Amman)' },
  { value: 'Asia/Baghdad', label: 'بغداد (Asia/Baghdad)' },
  { value: 'Asia/Riyadh', label: 'الرياض (Asia/Riyadh)' },
  { value: 'Asia/Dubai', label: 'دبي (Asia/Dubai)' },
  { value: 'Africa/Cairo', label: 'القاهرة (Africa/Cairo)' },
  { value: 'Europe/Istanbul', label: 'إسطنبول (Europe/Istanbul)' },
];

/** Arabic titles of the optional modules (feature flags). */
export const FEATURE_LABELS: Record<FeatureKey, { title: string; description: string }> = {
  SMS: { title: 'الرسائل النصية SMS', description: 'إرسال الرسائل والإشعارات النصية للأهالي' },
  ONLINE_REGISTRATION: {
    title: 'التسجيل الإلكتروني',
    description: 'استقبال طلبات تسجيل الطلاب عبر رابط عام',
  },
  PARENTS_APP: { title: 'تطبيق الأهل', description: 'متابعة الأهالي لحضور وعلامات وأقساط أبنائهم' },
  STUDENTS_APP: { title: 'تطبيق الطلاب', description: 'وصول الطلاب إلى برنامجهم وعلاماتهم' },
  ACCOUNTING: { title: 'نظام المحاسبة', description: 'الصناديق والمصروفات والقيود والتقارير المالية' },
};

export const institutesLabels = {
  title: 'المعاهد التعليمية',
  subtitle: 'إدارة ومتابعة كافة المعاهد والمؤسسات التعليمية المسجلة في المنظومة وتعيين مدراء الإدارة.',
  totalCountBadge: 'معهد مسجل',
  createNewButton: 'إضافة معهد جديد',
  searchPlaceholder: 'البحث باسم المعهد، رقم الهاتف، أو العنوان...',
  refreshButton: 'تحديث البيانات',
  emptyState: 'لا يوجد أي معهد مسجل حاليا.',
  emptySearch: 'لم يتم العثور على معاهد تطابق البحث.',
  
  // Table Headers
  tableName: 'المعهد',
  tablePhone: 'رقم الهاتف',
  tableAddress: 'العنوان',
  tableAdmin: 'مدير المعهد',
  tableColors: 'سمة المعهد',
  tableCreatedAt: 'تاريخ التسجيل',
  tableActions: 'الإجراءات',

  // Create Drawer
  createDrawerTitle: 'إنشاء معهد تعليمي جديد',
  createDrawerDescription: 'تسجيل معهد جديد في المنصة وتعيين الحساب الإداري المسؤول عنه بصورة فورية وتلقائية.',
  instituteSectionTitle: '1. بيانات المؤسسة التعليمية',
  adminSectionTitle: '2. حساب المدير المسؤول',
  instituteSectionDescription: 'الهوية البصرية والبيانات الرسمية للمؤسسة التعليمية.',
  adminSectionDescription: 'الحساب الإداري المسؤول الذي سيتمكن من تسجيل الدخول وإدارة هذا المعهد.',

  // Edit Drawer
  editDrawerTitle: 'تعديل بيانات المعهد',
  editDrawerDescription: 'تعديل الهوية وبيانات التواصل وكود الدخول الخاص بالمعهد.',
  submitEditButton: 'حفظ التعديلات',
  editButton: 'تعديل',
  instituteCodeRequired: 'كود المعهد',
  instituteCodeEditHint: 'يستخدمه المستخدمون عند تسجيل الدخول إذا كان رقمهم مسجلاً في أكثر من معهد',
  
  // Fields
  instituteName: 'اسم المعهد',
  instituteNamePlaceholder: 'مثال: معهد الأمل النموذجي',
  institutePhone: 'هاتف المعهد',
  institutePhonePlaceholder: '+966500000000',
  instituteCode: 'كود المعهد (اختياري)',
  instituteCodePlaceholder: 'يُولَّد تلقائياً إذا تُرك فارغاً',
  instituteTimezone: 'المنطقة الزمنية',
  instituteTimezoneHint: 'تُحسب بها تواريخ الحضور واستحقاق الأقساط',
  detailsTimezone: 'المنطقة الزمنية',
  instituteAddress: 'عنوان المعهد',
  instituteAddressPlaceholder: 'المدينة، الحي، الشارع',
  instituteLogoUrl: 'رابط شعار المعهد (اختياري)',
  instituteLogoUrlPlaceholder: 'https://...',
  institutePrimaryColor: 'اللون الرئيسي للهوية',
  instituteSecondaryColor: 'اللون الثانوي للهوية',

  adminFullName: 'الاسم الكامل للمدير',
  adminFullNamePlaceholder: 'مثال: أ. أحمد مصطفى',
  adminPhone: 'رقم هاتف المدير (اسم المستخدم للدخول)',
  adminPhonePlaceholder: '+9665XXXXXXXX',
  adminPassword: 'كلمة مرور حساب المدير',
  adminPasswordPlaceholder: 'على الأقل 6 خانات',

  submitButton: 'حفظ وتأسيس المعهد',
  cancelButton: 'إلغاء',
  detailsButton: 'عرض التفاصيل',

  // Details Drawer
  detailsDrawerTitle: 'تفاصيل المعهد التعليمي',
  detailsDrawerDescription: 'معلومات الهوية والاتصال وإدارة الحساب المسؤول.',
  noAdminAssigned: 'لم يتم تعيين مدير بعد',
  detailsCode: 'كود الدخول',
  featuresSectionTitle: 'الميزات المفعّلة للمعهد:',
  featuresLoading: 'جاري تحميل الميزات...',
  
  // Alerts
  creationSuccess: 'تم إنشاء المعهد التعليمي وتعيين المدير وتأسيس الفروع بنجاح.',
};
