'use client';

import { ReactNode } from 'react';
import { IconTile } from '../../info-tile';

export interface StatCardIconProps {
  children?: ReactNode;
  /** brand = glossy orange tile, ink = glossy black tile. */
  tone?: 'brand' | 'ink';
}

export function StatCardIcon({ children, tone = 'brand' }: StatCardIconProps) {
  if (!children) return null;

  return (
    <IconTile tone={tone} size={44}>
      {children}
    </IconTile>
  );
}
