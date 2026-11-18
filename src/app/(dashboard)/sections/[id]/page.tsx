import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'تفاصيل الشعبة | منصة إدارة المنظومة التعليمية',
};

/** SectionDetailPage — Server Component entry point (role.md §9). */
export default function SectionDetailPage() {
  return <RenderUi />;
}
