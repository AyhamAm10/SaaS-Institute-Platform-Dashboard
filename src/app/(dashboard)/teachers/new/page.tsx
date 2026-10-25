import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'إضافة معلم جديد | منصة إدارة المعاهد',
  description: 'معالج إضافة معلم وتحديد المؤهلات التدريسية ومواعيد الدوام الأسبوعي',
};

/**
 * TeacherRegistrationPage
 *
 * Pure Server Component entry point per Section 9 & 12 of role.md.
 * Delegates client rendering to RenderUi.
 */
export default function TeacherRegistrationPage() {
  return <RenderUi />;
}
