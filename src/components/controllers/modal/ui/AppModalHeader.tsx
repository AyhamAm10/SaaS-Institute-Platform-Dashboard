'use client';

import { Box, Group, Stack, rem } from '@mantine/core';
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

const isType = (child: ReactNode, type: unknown, displayName: string) =>
  isValidElement(child) &&
  (child.type === type || (child.type as { displayName?: string })?.displayName === displayName);

/**
 * Modal header: icon tile on the start side, title + description stacked next to it,
 * close button on the end side. Never wraps, so the icon always sits beside the title.
 */
export function AppModalHeader({
  children,
  withCloseButton,
  className,
}: AppModalHeaderProps) {
  const config = useModalMirror('config');
  const showClose = withCloseButton ?? config.withCloseButton;

  let icon: ReactNode = <AppModalIcon />;
  let text: ReactNode = (
    <>
      <AppModalTitle />
      <AppModalDescription />
    </>
  );

  if (children) {
    const items = Children.toArray(children).filter((child) => !isType(child, AppModalClose, 'AppModalClose'));
    const iconItems = items.filter((child) => isType(child, AppModalIcon, 'AppModalIcon'));
    icon = iconItems.length > 0 ? iconItems : null;
    text = items.filter((child) => !isType(child, AppModalIcon, 'AppModalIcon'));
  }

  return (
    <Box px="xl" pt="xl" pb="sm" className={className} style={{ flexShrink: 0 }}>
      <Group justify="space-between" align="flex-start" gap="md" wrap="nowrap">
        <Group gap="md" align="center" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          {icon}
          <Stack gap={rem(4)} style={{ flex: 1, minWidth: 0 }}>
            {text}
          </Stack>
        </Group>
        {showClose && <AppModalClose />}
      </Group>
    </Box>
  );
}
