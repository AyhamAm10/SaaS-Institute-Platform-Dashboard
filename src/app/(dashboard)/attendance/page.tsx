import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الحضور والانصراف | منصة إدارة المنظومة التعليمية',
  description: 'تسجيل دخول وانصراف الطلاب اليومي حسب الشعبة',
};

/** AttendancePage — Server Component entry point (role.md §9). */
export default function AttendancePage() {
  return <RenderUi />;
}
