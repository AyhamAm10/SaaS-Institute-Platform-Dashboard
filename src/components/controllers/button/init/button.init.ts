import type { MantineSize } from '@mantine/core';

/**
 * primary = ink filled (main action)       accent = logo-orange filled (rare, celebratory)
 * outline = glass pill with border         ghost  = text-only, subtle hover
 * danger  = soft destructive               dangerSolid = filled destructive (confirm dialogs)
 */
export type AppButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'dangerSolid';

/** default = glass circle, ghost = no chrome, brand = soft orange, danger = soft red. */
export type AppIconButtonVariant = 'default' | 'ghost' | 'brand' | 'danger' | 'primary';

export interface ResolvedMantineVariant {
  variant: 'filled' | 'light' | 'default' | 'subtle' | 'outline';
  color: string;
}

const BUTTON_VARIANTS: Record<AppButtonVariant, ResolvedMantineVariant> = {
  primary: { variant: 'filled', color: 'primary' },
  accent: { variant: 'filled', color: 'brand' },
  outline: { variant: 'default', color: 'gray' },
  ghost: { variant: 'subtle', color: 'gray' },
  danger: { variant: 'light', color: 'danger' },
  dangerSolid: { variant: 'filled', color: 'danger' },
};

const ICON_BUTTON_VARIANTS: Record<AppIconButtonVariant, ResolvedMantineVariant> = {
  default: { variant: 'default', color: 'gray' },
  ghost: { variant: 'subtle', color: 'gray' },
  brand: { variant: 'light', color: 'brand' },
  danger: { variant: 'subtle', color: 'danger' },
  primary: { variant: 'filled', color: 'primary' },
};

export function resolveButtonVariant(variant: AppButtonVariant = 'primary'): ResolvedMantineVariant {
  return BUTTON_VARIANTS[variant];
}

export function resolveIconButtonVariant(variant: AppIconButtonVariant = 'default'): ResolvedMantineVariant {
  return ICON_BUTTON_VARIANTS[variant];
}

const ICON_BUTTON_SIZE: Record<'xs' | 'sm' | 'md' | 'lg', number> = { xs: 28, sm: 32, md: 36, lg: 42 };

export function resolveIconButtonSize(size: MantineSize = 'md'): number {
  return ICON_BUTTON_SIZE[size as keyof typeof ICON_BUTTON_SIZE] ?? ICON_BUTTON_SIZE.md;
}
