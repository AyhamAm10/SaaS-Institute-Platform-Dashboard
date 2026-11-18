import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'تفاصيل العائلة | منصة إدارة المنظومة التعليمية',
};

/** FamilyDetailPage — Server Component entry point (role.md §9). */
export default function FamilyDetailPage() {
  return <RenderUi />;
}
