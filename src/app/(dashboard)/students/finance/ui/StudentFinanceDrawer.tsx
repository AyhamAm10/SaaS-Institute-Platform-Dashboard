'use client';

import { Stack } from '@mantine/core';
import { IconReceipt2 } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers';
import { useFinanceMirror } from '../store/student-finance.store';
import { financeLabels as labels } from '../static-data/student-finance.data';
import { FinanceActions, StudentFinancePanel } from './StudentFinancePanel';

export type { FinanceActions } from './StudentFinancePanel';

/** StudentFinanceDrawer: the finance panel in a drawer (students list). ZERO useState hooks. */
export function StudentFinanceDrawer({ onClose, actions }: { onClose: () => void; actions: FinanceActions }) {
  const student = useFinanceMirror('student');

  return (
    <AppDrawer opened onClose={onClose} size="xl">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconReceipt2 size={20} />} color="primary" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>
            {labels.title}: {student.fullName}
          </AppDrawer.Title>
          <AppDrawer.Description>{labels.description}</AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <StudentFinancePanel actions={actions} />
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>{labels.close}</AppDrawer.Cancel>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
