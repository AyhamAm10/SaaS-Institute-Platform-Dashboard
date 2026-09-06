'use client';

import { Group, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { useDataModuleMirror } from '../store/useDataModuleMirror';
import { DataModulePagination } from './DataModulePagination';

export interface DataModuleFooterProps {
  children?: ReactNode;
  showSummary?: boolean;
}

export function DataModuleFooter({ children, showSummary = true }: DataModuleFooterProps) {
  const page = useDataModuleMirror('page');
  const limit = useDataModuleMirror('limit');
  const total = useDataModuleMirror('total');

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <Group justify="space-between" align="center" mt="md" wrap="wrap" gap="sm">
      {showSummary && total > 0 ? (
        <Text size="xs" c="dimmed">
          عرض <Text span fw={600} c="var(--mantine-color-text)">{start}</Text> - <Text span fw={600} c="var(--mantine-color-text)">{end}</Text> من أصل <Text span fw={600} c="var(--mantine-color-text)">{total}</Text> سجل
        </Text>
      ) : (
        <span />
      )}
      {children ?? <DataModulePagination />}
    </Group>
  );
}
