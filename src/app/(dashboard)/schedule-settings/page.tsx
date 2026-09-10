import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'إعدادات الدوام والجدول | منصة إدارة المنظومة التعليمية',
  description: 'تهيئة أوقات الدوام المدرسي، مدد الحصص، فترات الاستراحة والأيام الدراسية',
};

export default function ScheduleSettingsPage() {
  return <RenderUi />;
}
