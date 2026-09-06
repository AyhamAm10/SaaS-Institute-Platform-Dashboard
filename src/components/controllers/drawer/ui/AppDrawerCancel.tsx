'use client';

import { Button } from '@mantine/core';
import { ReactNode } from 'react';
import { useDrawerMirror } from '../store/useDrawerMirror';

export interface AppDrawerCancelProps {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AppDrawerCancel({
  children = 'إلغاء',
  disabled,
  onClick,
  className,
}: AppDrawerCancelProps) {
  const close = useDrawerMirror('close');
  const loading = useDrawerMirror('loading');

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      close();
    }
  };

  return (
    <Button
      variant="subtle"
      color="gray"
      radius="xl"
      onClick={handleClick}
      disabled={disabled ?? loading}
      className={className}
    >
      {children}
    </Button>
  );
}
