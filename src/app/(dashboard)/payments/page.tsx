import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الدفعات | منصة إدارة المنظومة التعليمية',
  description: 'سجل الدفعات والإيصالات وإلغاء الدفعات',
};

/** PaymentsPage — Server Component entry point (role.md §9). */
export default function PaymentsPage() {
  return <RenderUi />;
}
