import { ReactNode } from 'react';
import { LayoutController } from '@/src/components/controllers/layout';
import { DashboardGuard } from '@/src/core/auth';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardGuard>
      <LayoutController>{children}</LayoutController>
    </DashboardGuard>
  );
}
