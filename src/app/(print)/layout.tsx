import { ReactNode } from 'react';
import { DashboardGuard } from '@/src/core/auth';
import { OperationalContextGate } from '@/src/components/controllers/layout/OperationalContextGate';

/**
 * Print layout: same authentication as the dashboard, but no sidebar or
 * header, so pages print on paper as-is (receipts).
 */
export default function PrintLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardGuard>
      <OperationalContextGate>{children}</OperationalContextGate>
    </DashboardGuard>
  );
}
