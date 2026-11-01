import type { CSSProperties, ReactNode } from 'react';

export type InfoTileTone = 'brand' | 'ink' | 'neutral' | 'success' | 'danger';

export interface InfoTileProps {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  tone?: InfoTileTone;
  hint?: ReactNode;
}

export interface DetailItem {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
}

export interface DetailListProps {
  items: DetailItem[];
  /** Number of columns on wider screens (always 1 on mobile). */
  columns?: 1 | 2 | 3;
}

/**
 * 3D icon tile: brand = orange gradient, ink = black gradient. Both carry a top highlight
 * and an inner bottom shade so the tile reads as a raised, glossy object.
 */
export function resolveIconTileStyle(tone: InfoTileTone = 'neutral'): CSSProperties {
  switch (tone) {
    case 'brand':
      return {
        background: 'linear-gradient(150deg, var(--mantine-color-brand-4), var(--mantine-color-brand-7))',
        color: 'var(--app-text-on-brand)',
        boxShadow:
          'var(--app-brand-glow), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -3px 6px rgba(0, 0, 0, 0.12)',
      };
    case 'ink':
      return {
        background: 'linear-gradient(150deg, #3A3A3D, #141416)',
        color: '#FFFFFF',
        boxShadow:
          '0 10px 20px -8px rgba(20, 20, 22, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -3px 6px rgba(0, 0, 0, 0.3)',
      };
    case 'success':
      return {
        backgroundColor: 'var(--app-success-soft)',
        color: 'var(--app-success-text)',
        border: '1px solid var(--app-success-border)',
      };
    case 'danger':
      return {
        backgroundColor: 'var(--app-danger-soft)',
        color: 'var(--app-danger-text)',
        border: '1px solid var(--app-danger-border)',
      };
    default:
      return {
        backgroundColor: 'var(--app-brand-accent-soft)',
        color: 'var(--app-brand-accent-text)',
        border: '1px solid var(--app-brand-accent-ring)',
      };
  }
}
