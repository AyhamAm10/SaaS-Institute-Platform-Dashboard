'use client';

import { Flex, Paper, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleFilterBarProps {
  children?: ReactNode;
}

export function DataModuleFilterBar({ children }: DataModuleFilterBarProps) {
  return (
    <Paper
      p="md"
      px="lg"
      radius="md"
      withBorder
      mb="md"
      style={{
        backgroundColor: 'var(--mantine-color-body)',
        borderColor: 'var(--mantine-color-gray-2)',
        borderRadius: rem(8),
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      }}
    >
      <Flex
        gap="md"
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
