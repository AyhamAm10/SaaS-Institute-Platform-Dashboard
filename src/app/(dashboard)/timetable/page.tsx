import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الجدول الدراسي الأسبوعي | منصة إدارة المنظومة التعليمية',
  description: 'محرك الجدولة الذكي، عرض الحصص الأسبوعية، الكشف عن التعارضات والتوليد الآلي',
};

export default function TimetablePage() {
  return <RenderUi />;
}
