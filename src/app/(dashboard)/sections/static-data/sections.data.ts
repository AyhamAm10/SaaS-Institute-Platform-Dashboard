/**
 * Static metadata, grade options, and labels for Sections module.
 */

export const sectionsPageMetadata = {
  title: 'الشُعب والفصول',
  description: 'إدارة الشُعب الدراسية وتوزيع الطلاب وتحديد الرسوم الدراسية لكل شُعبة.',
  emptyMessage: 'لا توجد شُعب دراسية مسجلة',
  emptyDescription: 'ابدأ بإضافة أول شُعبة دراسية للمعهد وربطها بالسنة الدراسية المناسبة.',
  searchPlaceholder: 'بحث باسم الشُعبة أو المرحلة...',
};

export const defaultGradesList = [
  'الصف الأول الابتدائي',
  'الصف الثاني الابتدائي',
  'الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي',
  'الصف الخامس الابتدائي',
  'الصف السادس الابتدائي',
  'الصف الأول المتوسط',
  'الصف الثاني المتوسط',
  'الصف الثالث المتوسط',
  'الصف الأول الثانوي',
  'الصف الثاني الثانوي',
  'الصف الثالث الثانوي',
];

export const sectionFormLabels = {
  name: 'اسم الشُعبة',
  namePlaceholder: 'مثال: الشعبة 1-أ',
  grade: 'المرحلة / الصف الدراسي',
  academicYearId: 'السنة الدراسية',
  branchId: 'الفرع',
  feeAmount: 'الرسوم الدراسية (ر.س)',
  feePlaceholder: 'مثال: 1500',
  createTitle: 'إضافة شُعبة جديدة',
  editTitle: 'تعديل بيانات الشُعبة',
  feeModalTitle: 'تعديل الرسوم الدراسية',
  detailsTitle: 'تفاصيل الشُعبة',
  submitCreate: 'إنشاء الشُعبة',
  submitEdit: 'حفظ التعديلات',
  submitFee: 'تحديث الرسوم',
  cancel: 'إلغاء',
};
