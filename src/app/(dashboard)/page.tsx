import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'لوحة التحكم والمتابعة | منصة إدارة المعاهد',
  description: 'لوحة المؤشرات والتحليلات الأكاديمية والتشغيلية للمعهد',
};

/**
 * Dashboard Home Page
 *
 * Pure Server Component. Strictly NO 'use client' allowed here.
 * Delegates visual composition to RenderUi.
 */
export default function DashboardPage() {
  return <RenderUi />;
}
