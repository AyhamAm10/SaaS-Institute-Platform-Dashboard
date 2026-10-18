import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'سجل الطلاب | منصة إدارة المعاهد',
  description: 'إدارة ومتابعة سجلات الطلاب المقيدين في المعهد والشُعب الدراسية',
};

/**
 * StudentsPage
 *
 * Pure Server Component entry point per Section 9 & 12 of role.md.
 * Delegates client rendering to RenderUi.
 */
export default function StudentsPage() {
  return <RenderUi />;
}
