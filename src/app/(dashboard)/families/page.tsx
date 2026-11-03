import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'العائلات وأولياء الأمور | منصة إدارة المنظومة التعليمية',
  description: 'إدارة سجلات العائلات وبيانات التواصل المرتبطة بالطلاب',
};

/**
 * FamiliesPage
 *
 * Pure Server Component entry point per Section 9 of role.md.
 * Strictly NO 'use client' allowed here.
 * Delegates client rendering to RenderUi.
 */
export default function FamiliesPage() {
  return <RenderUi />;
}
