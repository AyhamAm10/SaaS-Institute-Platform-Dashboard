'use client';

import { ThemeIcon } from '@mantine/core';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useModalMirror } from '../store/useModalMirror';
import { ModalVariant } from '../init/modal.init';

export interface AppModalIconProps {
  icon?: ReactNode;
  color?: string;
  variant?: 'light' | 'filled' | 'outline' | 'subtle' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const variantColorMap: Record<ModalVariant, string> = {
  danger: 'red',
  warning: 'orange',
  info: 'blue',
  success: 'teal',
  default: 'primary',
};

function getDefaultVariantIcon(variant: ModalVariant) {
  switch (variant) {
    case 'danger':
      return <IconAlertCircle size={20} />;
    case 'warning':
      return <IconAlertTriangle size={20} />;
    case 'success':
      return <IconCheck size={20} />;
    case 'info':
      return <IconInfoCircle size={20} />;
    case 'default':
    default:
      return null;
  }
}

export function AppModalIcon({
  icon,
  color,
  variant = 'light',
  size = 'lg',
  className,
}: AppModalIconProps) {
  const storeIcon = useModalMirror('icon');
  const modalVariant = useModalMirror('variant');

  const resolvedColor = color ?? variantColorMap[modalVariant] ?? 'primary';
  const resolvedIcon = icon ?? storeIcon ?? getDefaultVariantIcon(modalVariant);

  if (!resolvedIcon) return null;

  return (
    <ThemeIcon
      radius="xl"
      size={size}
      variant={variant}
      color={resolvedColor}
      className={className}
      style={{ flexShrink: 0 }}
    >
      {resolvedIcon}
    </ThemeIcon>
  );
}
