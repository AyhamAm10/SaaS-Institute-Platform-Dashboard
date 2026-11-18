import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'تفاصيل المعلم | منصة إدارة المنظومة التعليمية',
};

/** TeacherDetailPage — Server Component entry point (role.md §9). */
export default function TeacherDetailPage() {
  return <RenderUi />;
}
