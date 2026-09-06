'use client';

import { Box, Skeleton, Stack } from '@mantine/core';

export interface DataModuleLoadingProps {
  rowsCount?: number;
}

export function DataModuleLoading({ rowsCount = 5 }: DataModuleLoadingProps) {
  return (
    <Box p="md">
      <Stack gap="sm">
        <Skeleton height={40} radius="md" />
        {Array.from({ length: rowsCount }).map((_, i) => (
          <Skeleton key={i} height={36} radius="sm" opacity={0.7} />
        ))}
      </Stack>
    </Box>
  );
}
