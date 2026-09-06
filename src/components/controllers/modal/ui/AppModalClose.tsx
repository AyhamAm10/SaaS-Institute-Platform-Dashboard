'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useModalMirror } from '../store/useModalMirror';

export interface AppModalCloseProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AppModalClose({ size = 'md', className }: AppModalCloseProps) {
  const close = useModalMirror('close');

  return (
    <Tooltip label="إغلاق" withArrow position="bottom">
      <ActionIcon
        variant="subtle"
        color="gray"
        radius="xl"
        size={size}
        onClick={close}
        className={className}
        aria-label="إغلاق النافذة"
      >
        <IconX size={18} stroke={2} />
      </ActionIcon>
    </Tooltip>
  );
}
