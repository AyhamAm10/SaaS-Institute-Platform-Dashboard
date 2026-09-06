'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useDrawerMirror } from '../store/useDrawerMirror';

export interface AppDrawerCloseProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AppDrawerClose({ size = 'md', className }: AppDrawerCloseProps) {
  const close = useDrawerMirror('close');

  return (
    <Tooltip label="إغلاق" withArrow position="bottom">
      <ActionIcon
        variant="subtle"
        color="gray"
        radius="xl"
        size={size}
        onClick={close}
        className={className}
        aria-label="إغلاق النافذة الجانبية"
      >
        <IconX size={18} stroke={2} />
      </ActionIcon>
    </Tooltip>
  );
}
