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
      radius="lg"
      withBorder
      mb="md"
      style={{
        backgroundColor: 'var(--app-surface)',
        borderColor: 'var(--app-border)',
        borderRadius: rem(14),
        boxShadow: 'var(--app-card-shadow)',
        transition: 'background-color 200ms ease, border-color 200ms ease',
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
