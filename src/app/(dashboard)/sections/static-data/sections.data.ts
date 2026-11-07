/**
 * Static metadata, grade options, and labels for Sections module.
 */

export const sectionsPageMetadata = {
  title: 'الشعب والفصول',
  description: 'إدارة الشعب الدراسية وتوزيع الطلاب وتحديد الرسوم الدراسية لكل شعبة.',
  emptyMessage: 'لا توجد شعب دراسية مسجلة',
  emptyDescription: 'ابدأ بإضافة أول شعبة دراسية للمعهد وربطها بالفرع الأكاديمي والسنة الدراسية المناسبة.',
  searchPlaceholder: 'بحث باسم الشعبة أو الفرع الأكاديمي...',
};

export const sectionFormLabels = {
  name: 'اسم الشعبة',
  namePlaceholder: 'مثال: الشعبة 1-أ',
  academicBranchId: 'الفرع الأكاديمي',
  academicYearId: 'السنة الدراسية',
  branchId: 'فرع المعهد',
  feeAmount: 'الرسوم الدراسية (ل.س)',
  feePlaceholder: 'مثال: 1500',
  createTitle: 'إضافة شعبة جديدة',
  editTitle: 'تعديل بيانات الشعبة',
  feeModalTitle: 'تعديل الرسوم الدراسية',
  detailsTitle: 'تفاصيل الشعبة',
  submitCreate: 'إنشاء الشعبة',
  submitEdit: 'حفظ التعديلات',
  submitFee: 'تحديث الرسوم',
  cancel: 'إلغاء',
  branchesManagement: 'إدارة الفروع الأكاديمية',
  branchCreateTitle: 'إضافة فرع أكاديمي جديد',
  branchName: 'اسم الفرع الأكاديمي',
  branchNamePlaceholder: 'مثال: الثانوي العام — الفرع العلمي',
  branchDescription: 'الوصف (اختياري)',
  branchDescriptionPlaceholder: 'وصف موجز للمسار الأكاديمي...',
};

/** Labels of the section details drawer (subjects plan & section info). */
export const sectionDetailsLabels = {
  tabSubjects: 'المواد والخطة',
  tabInfo: 'بيانات الشعبة',
  tabStudents: 'الطلاب',
  studentsDescription: 'تسجيل الطلاب بالشعبة، النقل، الانسحاب وتخصيص المواد',
  subjectsDescription: 'المواد المقررة والمعلمون المكلفون وعدد الحصص الأسبوعية',
  infoDescription: 'المعلومات الأساسية وإحصائيات التسجيل والرسوم',

  // Summary
  summarySubjects: 'المواد المسندة',
  summaryPeriods: 'الحصص أسبوعياً',
  summaryNoTeacher: 'بدون معلم',

  // Assign form
  assignTitle: 'إسناد مادة جديدة',
  assignDescription: 'اختر المادة ثم المعلم المكلف وعدد حصصها في الأسبوع',
  availableCount: 'متاحة',
  allAssigned: 'جميع مواد المعهد مسندة لهذه الشعبة',
  subjectLabel: 'المادة الدراسية',
  subjectPlaceholder: 'ابحث واختر المادة...',
  teacherLabel: 'المعلم المكلف',
  teacherDescription: 'اختياري — يظهر المعلمون المؤهلون للمادة في فرع الشعبة الأكاديمي فقط',
  teacherPlaceholderNoSubject: 'اختر المادة أولاً',
  teacherPlaceholderNone: 'لا يوجد معلم مؤهل لهذه المادة في هذا الفرع الأكاديمي',
  teacherPlaceholder: 'اختر المعلم...',
  teacherAuto: 'توزيع تلقائي (بدون تحديد)',
  periodsLabel: 'عدد الحصص أسبوعياً',
  assignButton: 'إسناد المادة',

  // Plan list
  planTitle: 'الخطة التدريسية',
  planDescription: 'المواد المقررة لهذه الشعبة',
  noTeacher: 'بدون معلم — توزيع تلقائي',
  removeSubject: 'إزالة المادة من الشعبة',
  emptyTitle: 'لا توجد مواد في الخطة بعد',
  emptyDescription: 'ابدأ بإسناد أول مادة من النموذج أعلاه',

  // Info tab
  academicYear: 'السنة الدراسية',
  fee: 'الرسوم المعتمدة',
  currency: 'ل.س',
  students: 'الطلاب المسجلون',
  subjects: 'المواد المقررة',
  teachers: 'المدرسون',
  timetables: 'الجداول',

  close: 'إغلاق',
};
