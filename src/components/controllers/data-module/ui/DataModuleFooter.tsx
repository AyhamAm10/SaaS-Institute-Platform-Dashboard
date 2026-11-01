'use client';

import { Box, Group, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { formatNumber } from '@/src/core/format';
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
  const strong = (value: number) => (
    <Text span fw={500} c="var(--app-text-primary)">
      {formatNumber(value)}
    </Text>
  );

  return (
    <Group justify="space-between" align="center" mt="md" px="sm" wrap="wrap" gap="md">
      {showSummary && total > 0 ? (
        <Text size="sm" fw={300} c="var(--app-text-muted)">
          عرض {strong(start)} - {strong(end)} من أصل {strong(total)} سجل
        </Text>
      ) : (
        <Box />
      )}
      {children ?? <DataModulePagination />}
    </Group>
  );
}
