import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'تقرير | منصة إدارة المنظومة التعليمية',
};

/** ReportPage — Server Component entry point (role.md §9). */
export default function ReportPage() {
  return <RenderUi />;
}
