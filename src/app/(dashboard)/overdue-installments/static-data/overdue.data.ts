/** Labels of the overdue installments page (E10). */
export const overdueLabels = {
  title: 'الأقساط المتأخرة',
  description: 'أقساط تجاوزت تاريخ استحقاقها ولم تُدفع بالكامل (بتوقيت المعهد)',
  searchPlaceholder: 'ابحث باسم الطالب...',
  emptyMessage: 'لا توجد أقساط متأخرة',
  emptyDescription: 'كل الأقساط المستحقة مدفوعة',
  currencyPlaceholder: 'كل العملات',
  colStudent: 'الطالب',
  colInstallment: 'القسط',
  colDueDate: 'تاريخ الاستحقاق',
  colDaysLate: 'التأخير',
  colAmount: 'المبلغ',
  colRemaining: 'المتبقي',
  daysLate: (n: number) => `${n} يوم`,
} as const;
