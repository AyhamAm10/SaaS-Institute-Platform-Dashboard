import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'المذاكرات | منصة إدارة المنظومة التعليمية',
  description: 'مذاكرات الشعب وإدخال العلامات',
};

/** ExamsPage — Server Component entry point (role.md §9). */
export default function ExamsPage() {
  return <RenderUi />;
}
