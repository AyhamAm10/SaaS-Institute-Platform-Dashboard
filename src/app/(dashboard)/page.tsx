import { RenderUi } from './render-ui';

/**
 * Dashboard Home Page
 *
 * Pure Server Component. Strictly NO 'use client' allowed here.
 * Delegates visual composition to RenderUi.
 */
export default function DashboardPage() {
  return <RenderUi />;
}
