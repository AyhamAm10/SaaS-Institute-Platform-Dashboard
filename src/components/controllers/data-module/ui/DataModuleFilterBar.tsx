'use client';

import { Flex, Paper, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface DataModuleFilterBarProps {
  children?: ReactNode;
}

export function DataModuleFilterBar({ children }: DataModuleFilterBarProps) {
  return (
    <Paper
      p="sm"
      px="lg"
      radius="xl"
      withBorder
      mb="lg"
      style={{
        backgroundColor: 'var(--mantine-color-body)',
        borderColor: 'var(--mantine-color-gray-2)',
        borderRadius: rem(18),
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
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
