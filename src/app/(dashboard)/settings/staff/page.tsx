import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الموظفون والصلاحيات | منصة إدارة المنظومة التعليمية',
  description: 'حسابات موظفي المعهد وأدوارهم',
};

/** StaffPage — Server Component entry point (role.md §9). */
export default function StaffPage() {
  return <RenderUi />;
}
