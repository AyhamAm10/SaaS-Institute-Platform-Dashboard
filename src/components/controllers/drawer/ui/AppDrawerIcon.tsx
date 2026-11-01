'use client';

import { ReactNode } from 'react';
import { IconTile, InfoTileTone } from '../../info-tile';
import { useDrawerMirror } from '../store/useDrawerMirror';

export interface AppDrawerIconProps {
  icon?: ReactNode;
  /** Legacy Mantine color name; mapped onto a design-system tone. */
  color?: string;
  variant?: 'light' | 'filled' | 'outline' | 'subtle' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE: Record<NonNullable<AppDrawerIconProps['size']>, number> = { sm: 32, md: 38, lg: 44, xl: 50 };

/** Maps legacy color names used by pages onto the semantic tile tones. */
export function resolveIconTone(color?: string): InfoTileTone {
  if (!color) return 'brand';
  if (['red', 'danger'].includes(color)) return 'danger';
  if (['teal', 'green', 'success'].includes(color)) return 'success';
  if (['gray', 'dark', 'ink'].includes(color)) return 'ink';
  return 'brand';
}

export function AppDrawerIcon({ icon, color, size = 'lg' }: AppDrawerIconProps) {
  const storeIcon = useDrawerMirror('icon');
  const resolvedIcon = icon ?? storeIcon;

  if (!resolvedIcon) return null;

  return (
    <IconTile tone={resolveIconTone(color)} size={SIZE[size]}>
      {resolvedIcon}
    </IconTile>
  );
}
