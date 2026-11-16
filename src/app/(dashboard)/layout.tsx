import { ReactNode } from 'react';
import { LayoutController } from '@/src/components/controllers/layout';
import { PasswordChangeGate } from '@/src/components/controllers/password-change';
import { DashboardGuard } from '@/src/core/auth';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardGuard>
      <PasswordChangeGate>
        <LayoutController>{children}</LayoutController>
      </PasswordChangeGate>
    </DashboardGuard>
  );
}
