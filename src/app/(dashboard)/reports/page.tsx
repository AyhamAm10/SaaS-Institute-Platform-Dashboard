import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'التقارير والطباعة | منصة إدارة المنظومة التعليمية',
  description: 'تقارير المعهد: معاينة وطباعة وتصدير',
};

/** ReportsPage — Server Component entry point (role.md §9). */
export default function ReportsPage() {
  return <RenderUi />;
}
