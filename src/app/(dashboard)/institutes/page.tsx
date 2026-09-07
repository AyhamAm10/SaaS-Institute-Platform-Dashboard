import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'المعاهد التعليمية | منصة إدارة المنظومة التعليمية',
  description: 'إدارة وتأسيس كافة المعاهد والمؤسسات التعليمية وحسابات الإدارة في المنظومة',
};

/**
 * InstitutesPage
 *
 * Pure Server Component entry point per Section 9 of role.md.
 * Strictly NO 'use client' allowed here.
 * Delegates client rendering to RenderUi.
 */
export default function InstitutesPage() {
  return <RenderUi />;
}
