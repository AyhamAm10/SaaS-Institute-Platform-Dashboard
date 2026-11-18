import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'تفاصيل الدفعة | منصة إدارة المنظومة التعليمية',
};

/** PaymentDetailPage — Server Component entry point (role.md §9). */
export default function PaymentDetailPage() {
  return <RenderUi />;
}
