export const subjectsLabels = {
  title: 'المواد الدراسية',
  subtitle: 'إدارة وتحديد المواد والمقررات التعليمية وتعيينها للشُعب الدراسية في المعهد',
  totalCountBadge: 'مادة دراسية',
  searchPlaceholder: 'البحث باسم المادة أو الرمز الكودي...',
  createNewButton: 'إضافة مادة جديدة',
  refreshButton: 'تحديث البيانات',
  emptyState: 'لا توجد مواد دراسية مسجلة حالياً',
  emptyStateDesc: 'يمكنك إضافة أول مادة دراسية للمعهد عبر الضغط على زر "إضافة مادة جديدة".',

  // Table columns
  tableName: 'اسم المادة',
  tableCode: 'الرمز الكودي',
  tableSectionsCount: 'الشُعب المرتبطة',
  tableCreatedAt: 'تاريخ الإضافة',
  tableActions: 'الإجراءات',

  // Actions
  editButton: 'تعديل',
  deleteButton: 'حذف',

  // Drawer labels
  createTitle: 'إضافة مادة دراسية جديدة',
  createDescription: 'أدخل تفاصيل المادة الدراسية والرمز المميز لها في المعهد',
  editTitle: 'تعديل بيانات المادة الدراسية',
  editDescription: 'تعديل اسم المادة أو رمزها الكودي في المعهد',

  // Form fields
  fieldNameLabel: 'اسم المادة الدراسية',
  fieldNamePlaceholder: 'مثال: الرياضيات، اللغة العربية، الفيزياء',
  fieldCodeLabel: 'الرمز الكودي (Code)',
  fieldCodePlaceholder: 'مثال: MATH101, ARAB201, PHYS10',
  fieldCodeDescription: 'رمز فريد للمادة على مستوى المعهد التعليمي',

  submitCreate: 'حفظ وإضافة المادة',
  submitEdit: 'حفظ التعديلات',
  cancel: 'إلغاء',

  // Delete modal
  deleteModalTitle: 'تأكيد حذف المادة الدراسية',
  deleteConfirmPrompt: 'هل أنت متأكد من رغبتك في حذف المادة الدراسية',
  deleteWarningLinkedSections:
    'تنبيه: لا يمكن حذف هذه المادة لأنها مرتبطة حالياً بشُعب دراسية نشطة. يرجى إزالة المادة من الشُعب أولاً.',
  confirmDelete: 'نعم، حذف المادة',
} as const;
