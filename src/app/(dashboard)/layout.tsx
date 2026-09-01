import { ReactNode } from 'react';
import { LayoutController } from '@/src/components/controllers/layout';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LayoutController>{children}</LayoutController>;
}
