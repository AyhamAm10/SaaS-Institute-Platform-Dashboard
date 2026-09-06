'use client';

import { Box, Flex } from '@mantine/core';
import { ReactNode } from 'react';
import { AppModalCancel } from './AppModalCancel';
import { AppModalConfirm } from './AppModalConfirm';

export interface AppModalFooterProps {
  children?: ReactNode;
  className?: string;
}

export function AppModalFooter({ children, className }: AppModalFooterProps) {
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
        <AppModalCancel />
        <AppModalConfirm />
      </Flex>
    </Box>
  );
}
