import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'القاعات والمختبرات | منصة إدارة المنظومة التعليمية',
  description: 'إدارة وتخصيص القاعات الدراسية والمختبرات والسعات وتحديد فترات التوافر',
};

export default function RoomsPage() {
  return <RenderUi />;
}
