import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'إيصال دفع | منصة إدارة المنظومة التعليمية',
};

/** ReceiptPage — Server Component entry point (role.md §9). */
export default function ReceiptPage() {
  return <RenderUi />;
}
