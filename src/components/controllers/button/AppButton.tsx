'use client';

import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { Button, ButtonProps } from '@mantine/core';
import { AppButtonVariant, resolveButtonVariant } from './init/button.init';

export interface AppButtonProps
  extends Omit<ButtonProps, 'variant' | 'color'>,
    Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonProps | 'color'> {
  variant?: AppButtonVariant;
  /** Renders the button as a Next.js link. */
  href?: string;
}

/**
 * AppButton
 *
 * The only button pages should use. Variants map to the design system
 * (ink primary, orange accent, glass outline...) instead of free Mantine colors.
 */
export function AppButton({ variant = 'primary', href, ...props }: AppButtonProps) {
  const resolved = resolveButtonVariant(variant);

  if (href) {
    // Only Button (not native <button>) props are forwarded to the anchor.
    return (
      <Button component={Link} href={href} variant={resolved.variant} color={resolved.color} {...(props as ButtonProps)} />
    );
  }

  return <Button variant={resolved.variant} color={resolved.color} {...props} />;
}
