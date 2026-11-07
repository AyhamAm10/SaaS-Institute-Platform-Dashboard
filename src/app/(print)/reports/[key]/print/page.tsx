import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'طباعة تقرير | منصة إدارة المنظومة التعليمية',
};

/** ReportPrintPage — Server Component entry point (role.md §9). */
export default function ReportPrintPage() {
  return <RenderUi />;
}
