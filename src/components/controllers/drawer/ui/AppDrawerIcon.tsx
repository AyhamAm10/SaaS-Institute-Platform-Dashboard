'use client';

import { ThemeIcon } from '@mantine/core';
import { ReactNode } from 'react';
import { useDrawerMirror } from '../store/useDrawerMirror';

export interface AppDrawerIconProps {
  icon?: ReactNode;
  color?: string;
  variant?: 'light' | 'filled' | 'outline' | 'subtle' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AppDrawerIcon({
  icon,
  color = 'primary',
  variant = 'light',
  size = 'lg',
  className,
}: AppDrawerIconProps) {
  const storeIcon = useDrawerMirror('icon');
  const resolvedIcon = icon ?? storeIcon;

  if (!resolvedIcon) return null;

  return (
    <ThemeIcon
      radius="xl"
      size={size}
      variant={variant}
      color={color}
      className={className}
      style={{ flexShrink: 0 }}
    >
      {resolvedIcon}
    </ThemeIcon>
  );
}
