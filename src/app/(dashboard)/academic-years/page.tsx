import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'السنوات الدراسية | منصة إدارة المعاهد',
  description: 'إدارة ومتابعة السنوات الدراسية وضبط السنة النشطة للمعهد',
};

/**
 * AcademicYearsPage
 *
 * Pure Server Component entry point per Section 9 of role.md.
 * Delegating client rendering to RenderUi.
 */
export default function AcademicYearsPage() {
  return <RenderUi />;
}
