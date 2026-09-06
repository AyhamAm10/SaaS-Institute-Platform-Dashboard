'use client';

import { Flex, Paper } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleFilterBarProps {
  children?: ReactNode;
}

export function DataModuleFilterBar({ children }: DataModuleFilterBarProps) {
  return (
    <Paper
      p="xs"
      px="md"
      radius="xl"
      withBorder
      mb="md"
      style={{
        backgroundColor: 'var(--mantine-color-body)',
        borderColor: 'var(--mantine-color-gray-2)',
      }}
    >
      <Flex
        gap="sm"
        align="center"
        justify="space-between"
        wrap="wrap"
        direction={{ base: 'column', sm: 'row' }}
      >
        {children}
      </Flex>
    </Paper>
  );
}
