export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'ذكر' },
  { value: 'FEMALE', label: 'أنثى' },
];

export const BOOLEAN_OPTIONS = [
  { value: 'true', label: 'نعم' },
  { value: 'false', label: 'لا' },
];

export const studentsLabels = {
  title: 'سجل الطلاب المقيدين',
  description: 'إدارة ومتابعة بيانات الطلاب، سجلات العائلات، والتسكين في الشعب الدراسية',
  createAction: 'تسجيل طالب جديد',
  searchPlaceholder: 'بحث باسم الطالب، اسم الأب، أو كنية العائلة...',
  emptyMessage: 'لا يوجد طلاب مسجلون بعد',
  emptyDescription: 'ابدأ بقيد وتسجيل أول طالب في المعهد من خلال معالج التسجيل السريع',
  allBranches: 'جميع الفروع الجغرافية',

  tableFullName: 'اسم الطالب',
  tableFamily: 'العائلة والتواصل',
  tableBranch: 'الفرع الجغرافي',
  tableSection: 'الشعبة المسجل بها',
  tableBirthDate: 'تاريخ الميلاد',
  notEnrolled: 'غير مسكن بشعبة',
  tableActions: 'الإجراءات',
  editButton: 'تعديل',
  deleteButton: 'حذف',
  editTitle: 'تعديل بيانات الطالب',
  editDescription: 'تعديل البيانات الأساسية والعائلة والحقول الإضافية للطالب',
  sectionBasic: 'البيانات الأساسية',
  sectionFamily: 'العائلة',
  sectionFamilyDescription: 'ابحث عن عائلة أخرى لنقل الطالب إليها عند الحاجة',
  sectionCustomFields: 'الحقول الإضافية الخاصة بالمعهد',
  fieldFamilySearch: 'بحث عن عائلة',
  fieldFamilySearchPlaceholder: 'كنية العائلة، اسم الأب، أو رقم الهاتف...',
  fieldFamily: 'عائلة الطالب',
  familiesLoading: 'جاري البحث...',
  familiesEmpty: 'لا توجد عائلات مطابقة',
  customFieldsEmpty: 'لا توجد حقول إضافية معرفة للمعهد. يمكن إضافتها من صفحة الحقول المخصصة للطلاب.',
  fieldFullName: 'اسم الطالب الكامل',
  fieldGender: 'الجنس',
  fieldBirthDate: 'تاريخ الميلاد',
  submitEdit: 'حفظ التعديلات',
  cancel: 'إلغاء',
  deleteModalTitle: 'حذف الطالب',
  deleteConfirmPrompt: 'هل أنت متأكد من حذف الطالب',
  deleteReportLoading: 'جاري التحقق من السجلات المرتبطة...',
  deleteReportTitle: 'سجلات مرتبطة بالطالب (ستبقى محفوظة):',
  deleteSoftNote: 'سيختفي الطالب من القوائم، مع الاحتفاظ بسجله التاريخي في النظام.',
  confirmDelete: 'تأكيد الحذف',
};

/** Demo chart data (no API yet): attendance hours per period tab. */
export const studentsActivityDatasets = {
  'يومي': [
    { label: '8 ص', value: 2.4 },
    { label: '10 ص', value: 5.6 },
    { label: '12 م', value: 4.1 },
    { label: '2 م', value: 6.2 },
    { label: '4 م', value: 3.3 },
  ],
  'أسبوعي': [
    { label: 'السبت', value: 9 },
    { label: 'الأحد', value: 17 },
    { label: 'الإثنين', value: 16 },
    { label: 'الثلاثاء', value: 22 },
    { label: 'الأربعاء', value: 11 },
    { label: 'الخميس', value: 7 },
  ],
  'شهري': [
    { label: 'الأسبوع 1', value: 64 },
    { label: 'الأسبوع 2', value: 82 },
    { label: 'الأسبوع 3', value: 71 },
    { label: 'الأسبوع 4', value: 90 },
  ],
};

export const studentsAssignmentSegments = [
  { label: 'تم التسليم بالكامل', value: 65 },
  { label: 'قيد المراجعة', value: 20 },
  { label: 'مهام متبقية', value: 15 },
];
