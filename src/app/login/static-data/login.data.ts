export interface FeatureItem {
  id: string;
  title: string;
  description: string;
}

export const LOGIN_FEATURES: FeatureItem[] = [
  {
    id: 'tenancy',
    title: 'عزل بيانات آمن ومستقل',
    description: 'معمارية سحابية متقدمة تضمن خصوصية وسرية بيانات معهدك بصلابة تامة.',
  },
  {
    id: 'academic',
    title: 'إدارة أكاديمية وإدارية ذكية',
    description: 'تنظيم الفصول، متابعة الطلاب، والجداول الدراسية بواجهة مرنة وسلسة.',
  },
  {
    id: 'financial',
    title: 'تقارير مالية وتتبع الأقساط',
    description: 'لوحات قياس فورية للتحصيلات، الذمم، والتدفقات المالية للمعهد.',
  },
  {
    id: 'security',
    title: 'أمان معزز ومصادقة مزدوجة',
    description: 'جلسات مشفرة مع تدوير تلقائي لرموز التحقق وحماية متقدمة ضد الاختراق.',
  },
];

export const LOGIN_MESSAGES = {
  title: 'تسجيل الدخول للإدارة',
  subtitle: 'أدخل بيانات اعتماد حسابك الإداري للوصول إلى لوحة التحكم',
  phoneLabel: 'رقم الجوال المسجل',
  phonePlaceholder: '+9665xxxxxxxx',
  passwordLabel: 'كلمة المرور',
  passwordPlaceholder: '••••••••',
  submitButton: 'تسجيل الدخول',
  submittingButton: 'جاري التحقق...',
  brandingBadge: 'الجيل القادم من أنظمة التعليم SaaS',
  brandingTitle: 'منصة إدارة المعاهد والمؤسسات التعليمية',
  brandingDescription:
    'بيئة سحابية رائدة تمكن المعاهد والأكاديميات من ضبط العمليات التعليمية والإدارية والمالية بأعلى درجات الموثوقية والسرعة.',
  unauthorizedRoleError:
    'عذراً، هذا الحساب غير مصرح له بالدخول كمسؤول للنظام. يرجى استخدام حساب إداري.',
  genericLoginError:
    'فشل تسجيل الدخول. يرجى التحقق من صحة رقم الجوال وكلمة المرور.',
};
