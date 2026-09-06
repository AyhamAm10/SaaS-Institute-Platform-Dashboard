'use client';

import { Box, Flex, Group, Stack } from '@mantine/core';
import { ReactNode } from 'react';
import { AppModalClose } from './AppModalClose';
import { AppModalTitle } from './AppModalTitle';
import { AppModalDescription } from './AppModalDescription';
import { AppModalIcon } from './AppModalIcon';
import { useModalMirror } from '../store/useModalMirror';

export interface AppModalHeaderProps {
  children?: ReactNode;
  withCloseButton?: boolean;
  className?: string;
}

export function AppModalHeader({
  children,
  withCloseButton,
  className,
}: AppModalHeaderProps) {
  const config = useModalMirror('config');
  const showClose = withCloseButton ?? config.withCloseButton;

  if (children) {
    return (
      <Box
        px="lg"
        py="md"
        className={className}
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          backgroundColor: '#ffffff',
          flexShrink: 0,
        }}
      >
        <Flex justify="space-between" align="center" gap="md">
          <Group gap="sm" align="center" style={{ flex: 1, minWidth: 0 }}>
            {children}
          </Group>
          {showClose && <AppModalClose />}
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
        borderBottom: '1px solid var(--mantine-color-gray-2)',
        backgroundColor: '#ffffff',
        flexShrink: 0,
      }}
    >
      <Flex justify="space-between" align="center" gap="md">
        <Group gap="sm" align="center" style={{ flex: 1, minWidth: 0 }}>
          <AppModalIcon />
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <AppModalTitle />
            <AppModalDescription />
          </Stack>
        </Group>
        {showClose && <AppModalClose />}
      </Flex>
    </Box>
  );
}
