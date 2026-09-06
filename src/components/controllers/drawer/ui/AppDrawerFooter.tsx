'use client';

import { Box, Flex } from '@mantine/core';
import { ReactNode } from 'react';
import { AppDrawerCancel } from './AppDrawerCancel';
import { AppDrawerSubmit } from './AppDrawerSubmit';

export interface AppDrawerFooterProps {
  children?: ReactNode;
  className?: string;
}

export function AppDrawerFooter({ children, className }: AppDrawerFooterProps) {
  // If children provided, render inside flex container
  if (children) {
    return (
      <Box
        px="lg"
        py="md"
        className={className}
        style={{
          borderTop: '1px solid var(--mantine-color-gray-2)',
          backgroundColor: '#ffffff',
          flexShrink: 0,
        }}
      >
        <Flex justify="space-between" align="center" gap="sm" wrap="wrap">
          {children}
        </Flex>
      </Box>
    );
  }

  // Default simple cancel/save buttons
  return (
    <Box
      px="lg"
      py="md"
      className={className}
      style={{
        borderTop: '1px solid var(--mantine-color-gray-2)',
        backgroundColor: '#ffffff',
        flexShrink: 0,
      }}
    >
      <Flex justify="flex-end" align="center" gap="sm">
        <AppDrawerCancel />
        <AppDrawerSubmit />
      </Flex>
    </Box>
  );
}
