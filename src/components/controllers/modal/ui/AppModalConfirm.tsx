'use client';

import { Button } from '@mantine/core';
import { ReactNode } from 'react';
import { useModalMirror } from '../store/useModalMirror';
import { ModalVariant } from '../init/modal.init';

export interface AppModalConfirmProps {
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

const variantButtonColor: Record<ModalVariant, string> = {
  danger: 'red',
  warning: 'orange',
  info: 'blue',
  success: 'teal',
  default: 'primary',
};

export function AppModalConfirm({
  children = 'تأكيد',
  loading,
  disabled = false,
  color,
  type = 'button',
  form,
  onClick,
  leftSection,
  className,
}: AppModalConfirmProps) {
  const storeLoading = useModalMirror('loading');
  const modalVariant = useModalMirror('variant');

  const isLoading = loading ?? storeLoading;
  const resolvedColor = color ?? variantButtonColor[modalVariant] ?? 'primary';

  return (
    <Button
      type={type}
      form={form}
      color={resolvedColor}
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
