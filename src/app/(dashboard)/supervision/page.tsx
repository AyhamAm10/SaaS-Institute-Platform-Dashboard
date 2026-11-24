import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'مراقباتي | منصة إدارة المنظومة التعليمية',
  description: 'المذاكرات التي كُلّفت بمراقبتها',
};

/** SupervisionPage — Server Component entry point (role.md §9). */
export default function SupervisionPage() {
  return <RenderUi />;
}
