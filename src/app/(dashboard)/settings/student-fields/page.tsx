import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الحقول المخصصة للطلاب | منصة إدارة المعاهد',
  description: 'إدارة وتخصيص الحقول الإضافية لبيانات الطلاب حسب احتياجات المعهد',
};

/**
 * StudentFieldsPage
 *
 * Pure Server Component entry point per Section 9 & 12 of role.md.
 * Delegates client rendering to RenderUi.
 */
export default function StudentFieldsPage() {
  return <RenderUi />;
}
