import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الجداول المرجعية | منصة إدارة المنظومة التعليمية',
  description: 'إدارة المدن والمدارس والباصات وطرق المعرفة وحالات الطلاب وأنواع المذاكرات',
};

/**
 * ReferenceDataPage
 *
 * Pure Server Component entry point (role.md §9). Delegates to RenderUi.
 */
export default function ReferenceDataPage() {
  return <RenderUi />;
}
