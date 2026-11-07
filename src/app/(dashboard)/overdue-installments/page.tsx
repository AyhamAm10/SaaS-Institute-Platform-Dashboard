import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الأقساط المتأخرة | منصة إدارة المنظومة التعليمية',
  description: 'الأقساط المستحقة وغير المدفوعة بالكامل',
};

/** OverdueInstallmentsPage — Server Component entry point (role.md §9). */
export default function OverdueInstallmentsPage() {
  return <RenderUi />;
}
