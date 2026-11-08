import { Metadata } from 'next';
import { RenderUi } from './render-ui';

export const metadata: Metadata = {
  title: 'الإعدادات والتأسيس | منصة إدارة المنظومة التعليمية',
  description: 'إدارة إعدادات المعهد، الحسابات، والجداول المرجعية',
};

/** SettingsPage — Pure Server Component entry point (role.md §9). */
export default function SettingsPage() {
  return <RenderUi />;
}

