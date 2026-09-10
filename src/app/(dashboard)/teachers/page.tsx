import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الكادر التدريسي | منصة إدارة المنظومة التعليمية',
  description: 'إدارة المعلمين وتخصصاتهم ومؤهلاتهم الأكاديمية وأوقات تفرغهم الأسبوعية',
};

export default function TeachersPage() {
  return <RenderUi />;
}
