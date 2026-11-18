import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'تفاصيل السنة الدراسية | منصة إدارة المنظومة التعليمية',
};

/** AcademicYearDetailPage — Server Component entry point (role.md §9). */
export default function AcademicYearDetailPage() {
  return <RenderUi />;
}
