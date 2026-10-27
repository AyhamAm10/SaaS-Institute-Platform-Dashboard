'use client';

import { Box, Flex, Group, Stack } from '@mantine/core';
import { Children, isValidElement, ReactNode } from 'react';
import { AppDrawerClose } from './AppDrawerClose';
import { AppDrawerTitle } from './AppDrawerTitle';
import { AppDrawerDescription } from './AppDrawerDescription';
import { AppDrawerIcon } from './AppDrawerIcon';
import { useDrawerMirror } from '../store/useDrawerMirror';

export interface AppDrawerHeaderProps {
  children?: ReactNode;
  withCloseButton?: boolean;
  className?: string;
}

export function AppDrawerHeader({
  children,
  withCloseButton,
  className,
}: AppDrawerHeaderProps) {
  const config = useDrawerMirror('config');
  const showClose = withCloseButton ?? config.withCloseButton;

  // If custom children are provided, render layout container
  if (children) {
    // Filter out AppDrawerClose from children so close button is never duplicated
    const filteredChildren = Children.toArray(children).filter((child) => {
      if (!isValidElement(child)) return true;
      return (
        child.type !== AppDrawerClose &&
        (child.type as any)?.displayName !== 'AppDrawerClose'
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
          {showClose && <AppDrawerClose />}
        </Flex>
      </Box>
    );
  }

  // Default automatic layout from store
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
          <AppDrawerIcon />
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <AppDrawerTitle />
            <AppDrawerDescription />
          </Stack>
        </Group>
        {showClose && <AppDrawerClose />}
      </Flex>
    </Box>
  );
}
