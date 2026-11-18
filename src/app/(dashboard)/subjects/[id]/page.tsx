import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'تفاصيل المادة | منصة إدارة المنظومة التعليمية',
};

/** SubjectDetailPage — Server Component entry point (role.md §9). */
export default function SubjectDetailPage() {
  return <RenderUi />;
}
