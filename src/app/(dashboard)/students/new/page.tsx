import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'تسجيل طالب جديد | منصة إدارة المعاهد',
  description: 'معالج تسجيل وقيد طالب جديد بالمعهد وتسكينه في الشعب الدراسية',
};

/**
 * StudentRegistrationPage
 *
 * Pure Server Component entry point per Section 9 & 12 of role.md.
 * Delegates client rendering to RenderUi.
 */
export default function StudentRegistrationPage() {
  return <RenderUi />;
}
