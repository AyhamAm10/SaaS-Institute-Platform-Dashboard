'use client';

import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useModalMirror } from '../store/useModalMirror';
import { ModalVariant } from '../init/modal.init';
import { IconTile, InfoTileTone } from '../../info-tile';

export interface AppModalIconProps {
  icon?: ReactNode;
  color?: string;
  variant?: 'light' | 'filled' | 'outline' | 'subtle' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const variantToneMap: Record<ModalVariant, InfoTileTone> = {
  danger: 'danger',
  warning: 'brand',
  info: 'ink',
  success: 'success',
  default: 'brand',
};

const SIZE: Record<NonNullable<AppModalIconProps['size']>, number> = { sm: 32, md: 38, lg: 44, xl: 50 };

function resolveTone(color: string | undefined, variant: ModalVariant): InfoTileTone {
  if (!color) return variantToneMap[variant] ?? 'brand';
  if (['red', 'danger'].includes(color)) return 'danger';
  if (['teal', 'green', 'success'].includes(color)) return 'success';
  if (['gray', 'dark', 'ink'].includes(color)) return 'ink';
  return 'brand';
}

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

export function AppModalIcon({ icon, color, size = 'lg' }: AppModalIconProps) {
  const storeIcon = useModalMirror('icon');
  const modalVariant = useModalMirror('variant');

  const resolvedIcon = icon ?? storeIcon ?? getDefaultVariantIcon(modalVariant);

  if (!resolvedIcon) return null;

  return (
    <IconTile tone={resolveTone(color, modalVariant)} size={SIZE[size]}>
      {resolvedIcon}
    </IconTile>
  );
}
