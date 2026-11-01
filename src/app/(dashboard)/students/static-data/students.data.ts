export const studentsLabels = {
  title: 'سجل الطلاب المقيدين',
  description: 'إدارة ومتابعة بيانات الطلاب، سجلات العائلات، والتسكين في الشعب الدراسية',
  createAction: 'تسجيل طالب جديد',
  searchPlaceholder: 'بحث باسم الطالب، اسم الأب، أو كنية العائلة...',
  emptyMessage: 'لا يوجد طلاب مسجلون بعد',
  emptyDescription: 'ابدأ بقيد وتسجيل أول طالب في المعهد من خلال معالج التسجيل السريع',
  allBranches: 'جميع الفروع الجغرافية',
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
