import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'إدخال العلامات | منصة إدارة المنظومة التعليمية',
};

/** MarkSheetPage — Server Component entry point (role.md §9). */
export default function MarkSheetPage() {
  return <RenderUi />;
}
