import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'المواد الدراسية | منصة إدارة المنظومة التعليمية',
  description: 'إدارة وتحديد المواد والمقررات التعليمية وتعيينها للشُعب الدراسية',
};

/**
 * SubjectsPage
 *
 * Pure Server Component entry point per Section 9 of role.md.
 * Strictly NO 'use client' allowed here.
 * Delegates client rendering to RenderUi.
 */
export default function SubjectsPage() {
  return <RenderUi />;
}
