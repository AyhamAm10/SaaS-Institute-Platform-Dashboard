'use client';

import { Button } from '@mantine/core';
import { ReactNode } from 'react';
import { useDrawerMirror } from '../store/useDrawerMirror';

export interface AppDrawerSubmitProps {
  children?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  color?: string;
  type?: 'submit' | 'button';
  form?: string;
  onClick?: () => void;
  leftSection?: ReactNode;
  className?: string;
}

export function AppDrawerSubmit({
  children = 'حفظ',
  loading,
  disabled = false,
  color = 'primary',
  type = 'submit',
  form,
  onClick,
  leftSection,
  className,
}: AppDrawerSubmitProps) {
  const storeLoading = useDrawerMirror('loading');
  const isLoading = loading ?? storeLoading;

  return (
    <Button
      type={type}
      form={form}
      color={color}
      radius="xl"
      loading={isLoading}
      disabled={disabled}
      onClick={onClick}
      leftSection={leftSection}
      className={className}
    >
      {children}
    </Button>
  );
}
