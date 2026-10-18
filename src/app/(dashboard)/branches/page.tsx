import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الفروع الجغرافية | منصة إدارة المعاهد',
  description: 'إدارة الفروع والمراكز التعليمية التابعة للمعهد',
};

/**
 * BranchesPage
 *
 * Pure Server Component entry point per Section 9 & 12 of role.md.
 * Delegates client rendering to RenderUi.
 */
export default function BranchesPage() {
  return <RenderUi />;
}
