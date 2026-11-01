import type { CSSProperties, ReactNode } from 'react';
import type { MantineSpacing, StyleProp } from '@mantine/core';

/**
 * Glass levels:
 * 1 = light frosted panel (toolbars, filter bars, nested blocks)
 * 2 = standard card
 * 3 = strong, nearly opaque glass (floating panels, overlays)
 */
export type SurfaceLevel = 1 | 2 | 3;

/** glass = frosted card, subtle = flat tinted block inside a card, brand = soft orange highlight. */
export type SurfaceTone = 'glass' | 'subtle' | 'brand';

export type SurfaceRadius = 'md' | 'lg' | 'xl';

export interface AppSurfaceProps {
  children?: ReactNode;
  level?: SurfaceLevel;
  tone?: SurfaceTone;
  radius?: SurfaceRadius;
  padding?: StyleProp<MantineSpacing>;
  /** Lifts on hover with a deeper shadow. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

const LEVEL_BACKGROUND: Record<SurfaceLevel, string> = {
  1: 'var(--app-glass-bg)',
  2: 'var(--app-surface)',
  3: 'var(--app-glass-bg-strong)',
};

const LEVEL_SHADOW: Record<SurfaceLevel, string> = {
  1: 'var(--app-glass-highlight)',
  2: 'var(--app-card-shadow)',
  3: 'var(--app-glass-highlight), var(--app-elev-2)',
};

export function resolveSurfaceStyle(props: AppSurfaceProps): CSSProperties {
  const level = props.level ?? 2;
  const tone = props.tone ?? 'glass';
  const radius = `var(--app-radius-${props.radius ?? (level === 1 ? 'md' : 'lg')})`;

  if (tone === 'subtle') {
    return {
      backgroundColor: 'var(--app-sidebar-subtle)',
      border: '1px solid var(--app-border-subtle)',
      borderRadius: radius,
      boxShadow: 'none',
    };
  }

  if (tone === 'brand') {
    return {
      backgroundColor: 'var(--app-brand-accent-soft)',
      border: '1px solid var(--app-brand-accent-ring)',
      borderRadius: radius,
      boxShadow: 'none',
    };
  }

  return {
    backgroundColor: LEVEL_BACKGROUND[level],
    backdropFilter: 'var(--app-glass-blur)',
    WebkitBackdropFilter: 'var(--app-glass-blur)',
    border: '1px solid var(--app-glass-border)',
    borderRadius: radius,
    boxShadow: LEVEL_SHADOW[level],
  };
}
