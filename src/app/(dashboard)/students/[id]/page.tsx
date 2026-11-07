import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'ملف الطالب | منصة إدارة المنظومة التعليمية',
};

/** StudentProfilePage — Server Component entry point (role.md §9). */
export default function StudentProfilePage() {
  return <RenderUi />;
}
