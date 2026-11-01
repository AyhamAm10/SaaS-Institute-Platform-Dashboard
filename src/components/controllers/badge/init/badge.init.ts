import type { CSSProperties } from 'react';

export type BadgeTone = 'brand' | 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'ink';

/** soft = tinted fill + border, outline = border only, dot = soft with a leading status dot, solid = filled. */
export type BadgeVariant = 'soft' | 'outline' | 'dot' | 'solid';

interface ToneColors {
  text: string;
  soft: string;
  border: string;
  solid: string;
}

const TONES: Record<BadgeTone, ToneColors> = {
  brand: {
    text: 'var(--app-brand-accent-text)',
    soft: 'var(--app-brand-accent-soft)',
    border: 'var(--app-brand-accent-ring)',
    solid: 'var(--app-brand-accent)',
  },
  warning: {
    text: 'var(--app-brand-accent-text)',
    soft: 'var(--app-brand-accent-soft)',
    border: 'var(--app-brand-accent-ring)',
    solid: 'var(--app-brand-accent)',
  },
  success: {
    text: 'var(--app-success-text)',
    soft: 'var(--app-success-soft)',
    border: 'var(--app-success-border)',
    solid: 'var(--app-success-text)',
  },
  danger: {
    text: 'var(--app-danger-text)',
    soft: 'var(--app-danger-soft)',
    border: 'var(--app-danger-border)',
    solid: 'var(--app-danger-text)',
  },
  info: {
    text: 'var(--app-info-text)',
    soft: 'var(--app-info-soft)',
    border: 'var(--app-info-border)',
    solid: 'var(--app-info-text)',
  },
  neutral: {
    text: 'var(--app-text-secondary)',
    soft: 'var(--app-sidebar-subtle)',
    border: 'var(--app-border)',
    solid: 'var(--app-text-secondary)',
  },
  ink: {
    text: 'var(--app-text-primary)',
    soft: 'var(--app-sidebar-subtle)',
    border: 'var(--app-border-hover)',
    solid: 'var(--app-brand-primary)',
  },
};

export function resolveBadgeStyle(tone: BadgeTone = 'neutral', variant: BadgeVariant = 'soft'): CSSProperties {
  const colors = TONES[tone];

  if (variant === 'solid') {
    return {
      backgroundColor: colors.solid,
      color: tone === 'ink' ? 'var(--app-bg)' : 'var(--app-text-on-brand)',
      border: '1px solid transparent',
    };
  }

  return {
    backgroundColor: variant === 'outline' ? 'transparent' : colors.soft,
    color: colors.text,
    border: `1px solid ${colors.border}`,
  };
}
