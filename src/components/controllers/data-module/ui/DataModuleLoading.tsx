'use client';

import { Box, Skeleton, Stack } from '@mantine/core';

export interface DataModuleLoadingProps {
  rowsCount?: number;
}

export function DataModuleLoading({ rowsCount = 5 }: DataModuleLoadingProps) {
  return (
    <Box py="md">
      <Stack gap={8}>
        <Skeleton height={18} width="40%" radius="xl" mb={6} opacity={0.6} />
        {Array.from({ length: rowsCount }).map((_, i) => (
          <Skeleton key={i} height={54} radius="md" opacity={0.75 - i * 0.08} />
        ))}
      </Stack>
    </Box>
  );
}
