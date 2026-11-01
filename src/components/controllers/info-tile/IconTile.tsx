'use client';

import type { ReactNode } from 'react';
import { Center, rem } from '@mantine/core';
import { InfoTileTone, resolveIconTileStyle } from './init/info-tile.init';

export interface IconTileProps {
  children: ReactNode;
  tone?: InfoTileTone;
  size?: number;
}

/** Raised, glossy icon square used by stat cards, drawer headers and info tiles. */
export function IconTile({ children, tone = 'neutral', size = 44 }: IconTileProps) {
  return (
    <Center
      style={{
        width: rem(size),
        height: rem(size),
        flexShrink: 0,
        borderRadius: rem(Math.round(size * 0.32)),
        ...resolveIconTileStyle(tone),
      }}
    >
      {children}
    </Center>
  );
}
