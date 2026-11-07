import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'طباعة السجلات المحددة | منصة إدارة المنظومة التعليمية',
};

/** SelectionPrintPage — Server Component entry point. */
export default function SelectionPrintPage() {
  return <RenderUi />;
}

