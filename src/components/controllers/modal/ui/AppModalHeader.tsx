'use client';

import { Box, Flex, Group, Stack } from '@mantine/core';
import { Children, isValidElement, ReactNode } from 'react';
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
    const filteredChildren = Children.toArray(children).filter((child) => {
      if (!isValidElement(child)) return true;
      return (
        child.type !== AppModalClose &&
        (child.type as any)?.displayName !== 'AppModalClose'
      );
    });

    return (
      <Box
        px="xl"
        py="lg"
        className={className}
        style={{
          borderBottom: '1px solid var(--app-border)',
          backgroundColor: 'var(--app-surface)',
          flexShrink: 0,
        }}
      >
        <Flex justify="space-between" align="center" gap="md">
          <Group gap="sm" align="center" style={{ flex: 1, minWidth: 0 }}>
            {filteredChildren}
          </Group>
          {showClose && <AppModalClose />}
        </Flex>
      </Box>
    );
  }

  return (
    <Box
      px="xl"
      py="lg"
      className={className}
      style={{
        borderBottom: '1px solid var(--app-border)',
        backgroundColor: 'var(--app-surface)',
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
