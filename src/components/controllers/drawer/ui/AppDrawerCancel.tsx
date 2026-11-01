'use client';

import { AppButton } from '../../button';
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
    <AppButton variant="ghost" onClick={handleClick} disabled={disabled ?? loading} className={className}>
      {children}
    </AppButton>
  );
}
