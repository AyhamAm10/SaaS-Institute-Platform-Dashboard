import type { BadgeTone } from '@/src/components/controllers/badge/init/badge.init';
import type { ContractStatus, InstallmentStatus, PaymentMethod } from '@/src/core/api';

/** Labels of the student finance drawer (E10). */
export const financeLabels = {
  title: 'الملف المالي',
  description: 'العقود والأقساط والدفعات',
  summaryTotal: 'المطلوب',
  summaryPaid: 'المدفوع',
  summaryRemaining: 'المتبقي',
  summaryOverdue: 'متأخر',
  noEnrollments: 'الطالب غير مسجل بأي شعبة. سجّله بشعبة أولاً لإنشاء عقد.',
  noContract: 'لا يوجد عقد لهذا التسجيل',
  createContract: 'إنشاء عقد',
  editContract: 'تعديل العقد',
  recordPayment: 'تسجيل دفعة',
  installments: 'الأقساط',
  payments: 'الدفعات',
  noPayments: 'لا توجد دفعات بعد',
  discount: 'الحسم',
  total: 'الإجمالي',
  receipt: 'إيصال',
  print: 'طباعة',
  cancelPayment: 'إلغاء الدفعة',
  close: 'إغلاق',
  cancel: 'إلغاء',
  save: 'حفظ',

  // Contract form
  contractTitle: 'إنشاء عقد للطالب',
  editContractTitle: 'تعديل العقد',
  editContractHint: 'الأقساط المدفوعة (ولو جزئياً) تبقى كما هي؛ يُعاد توزيع المتبقي على أقساط جديدة.',
  grossAmount: 'المبلغ الإجمالي',
  grossAmountHint: 'اتركه فارغاً لاستخدام رسوم الشعبة',
  currency: 'العملة',
  currencyHint: 'افتراضياً عملة رسوم الشعبة',
  discountAmount: 'قيمة الحسم',
  discountReason: 'سبب الحسم',
  firstPayment: 'الدفعة الأولى',
  firstPaymentHint: 'تصبح القسط الأول، مستحقة بتاريخ البداية',
  installmentsCount: 'عدد الأقساط الشهرية',
  startDate: 'تاريخ البداية',
  startDateHint: 'افتراضياً اليوم',
  previewButton: 'معاينة الأقساط',
  previewTitle: 'جدول الأقساط',
  createButton: 'إنشاء العقد',
  previewError: 'تعذّرت معاينة الأقساط',
  contractError: 'تعذّر حفظ العقد',

  // Payment
  paymentTitle: 'تسجيل دفعة',
  amount: 'المبلغ',
  exchangeRate: 'سعر الصرف (ليرة لكل دولار)',
  method: 'طريقة الدفع',
  note: 'ملاحظة',
  remaining: 'المتبقي على العقد',
  applied: 'بعملة العقد',
  allocationTitle: 'ستتوزع الدفعة على:',
  installmentShort: (n: number) => `القسط ${n}`,
  amountRequired: 'أدخل مبلغ الدفعة',
  rateRequired: 'سعر الصرف مطلوب عند الدفع بعملة غير عملة العقد',
  exceedsRemaining: 'المبلغ أكبر من المتبقي على العقد',
  paymentError: 'تعذّر تسجيل الدفعة',

  // Cancel
  cancelTitle: 'إلغاء الدفعة',
  cancelHint: 'لا تُحذف الدفعة: تُلغى مع السبب، ويعود مبلغها على الأقساط، ويبقى رقم الإيصال محفوظاً.',
  cancelReason: 'سبب الإلغاء',
  cancelReasonRequired: 'سبب الإلغاء مطلوب',
  confirmCancel: 'تأكيد الإلغاء',
  cancelError: 'تعذّر إلغاء الدفعة',
} as const;

export const INSTALLMENT_STATUS_META: Record<InstallmentStatus, { label: string; tone: BadgeTone }> = {
  PENDING: { label: 'مستحق', tone: 'neutral' },
  PARTIAL: { label: 'مدفوع جزئياً', tone: 'warning' },
  PAID: { label: 'مدفوع', tone: 'success' },
  OVERDUE: { label: 'متأخر', tone: 'danger' },
  CANCELLED: { label: 'ملغى', tone: 'neutral' },
};

export const CONTRACT_STATUS_META: Record<ContractStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'فعّال', tone: 'info' },
  COMPLETED: { label: 'مسدَّد بالكامل', tone: 'success' },
  CANCELLED: { label: 'ملغى', tone: 'neutral' },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: 'نقداً',
  BANK_TRANSFER: 'تحويل بنكي',
  OTHER: 'أخرى',
};

export const PAYMENT_METHOD_OPTIONS = (Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map(
  (value) => ({ value, label: PAYMENT_METHOD_LABELS[value] }),
);
