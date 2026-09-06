import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الشُعب والفصول | منصة إدارة المعاهد',
  description: 'إدارة وتوزيع الشُعب الدراسية وتحديد الرسوم الدراسية للمعهد',
};

/**
 * SectionsPage
 *
 * Pure Server Component entry point per Section 9 of role.md.
 * Delegating client rendering to RenderUi.
 */
export default function SectionsPage() {
  return <RenderUi />;
}
