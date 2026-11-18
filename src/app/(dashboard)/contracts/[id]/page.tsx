import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'تفاصيل العقد | منصة إدارة المنظومة التعليمية',
};

/** ContractDetailPage — Server Component entry point (role.md §9). */
export default function ContractDetailPage() {
  return <RenderUi />;
}
