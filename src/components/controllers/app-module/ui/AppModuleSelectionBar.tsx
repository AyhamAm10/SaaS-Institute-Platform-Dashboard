'use client';

import { Alert, Group, Paper, Text, rem, Stack } from '@mantine/core';
import { IconFileSpreadsheet, IconPrinter } from '@tabler/icons-react';
import { AppButton } from '../../button';
import { useSelectionExport } from '../useSelectionExport';

export function AppModuleSelectionBar() {
  const {
    rowsCount,
    hasColumns,
    isExporting,
    exportError,
    handlePrint,
    handleExcel,
  } = useSelectionExport();

  if (!hasColumns) {
    return null;
  }

  const selectionText =
    rowsCount === 0 ? 'لم يتم تحديد أي سجل' : `تم تحديد ${rowsCount} سجل`;

  return (
    <Stack gap={rem(6)} mb={rem(10)}>
      <Paper
        withBorder
        p={`${rem(6)} ${rem(14)}`}
        radius="var(--app-radius-md)"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--app-surface-subtle)',
          borderColor: 'var(--app-table-border)',
        }}
      >
        <Text fz={rem(12.5)} c={rowsCount > 0 ? 'var(--app-brand-accent)' : 'var(--app-text-muted)'}>
          {selectionText}
        </Text>

        <Group gap="xs">
          <AppButton
            variant="outline"
            size="xs"
            leftSection={<IconPrinter size={14} />}
            onClick={handlePrint}
            disabled={rowsCount === 0}
          >
            طباعة
          </AppButton>
          <AppButton
            variant="outline"
            size="xs"
            leftSection={<IconFileSpreadsheet size={14} />}
            onClick={handleExcel}
            disabled={rowsCount === 0}
            loading={isExporting}
          >
            Excel
          </AppButton>
        </Group>
      </Paper>

      {exportError && (
        <Alert color="red" variant="light" py={4} radius="var(--app-radius-sm)">
          {exportError}
        </Alert>
      )}
    </Stack>
  );
}
