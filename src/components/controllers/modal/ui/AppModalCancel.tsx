'use client';

import { Button } from '@mantine/core';
import { ReactNode } from 'react';
import { useModalMirror } from '../store/useModalMirror';

export interface AppModalCancelProps {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AppModalCancel({
  children = 'إلغاء',
  disabled,
  onClick,
  className,
}: AppModalCancelProps) {
  const close = useModalMirror('close');
  const loading = useModalMirror('loading');

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
