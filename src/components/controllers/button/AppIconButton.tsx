'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ActionIcon, ActionIconProps, Tooltip } from '@mantine/core';
import { AppIconButtonVariant, resolveIconButtonSize, resolveIconButtonVariant } from './init/button.init';

export interface AppIconButtonProps
  extends Omit<ActionIconProps, 'variant' | 'color'>,
    Omit<ComponentPropsWithoutRef<'button'>, keyof ActionIconProps | 'color'> {
  variant?: AppIconButtonVariant;
  /** Accessible label; also shown as a tooltip unless `withTooltip` is false. */
  label: string;
  withTooltip?: boolean;
  children: ReactNode;
}

/** AppIconButton — circular icon action with a built-in tooltip and accessible label. */
export function AppIconButton({
  variant = 'default',
  label,
  withTooltip = true,
  size = 'md',
  children,
  ...props
}: AppIconButtonProps) {
  const resolved = resolveIconButtonVariant(variant);
  const dimension = resolveIconButtonSize(size as never);

  const button = (
    <ActionIcon
      variant={resolved.variant}
      color={resolved.color}
      radius="xl"
      size={dimension}
      aria-label={label}
      {...props}
    >
      {children}
    </ActionIcon>
  );

  if (!withTooltip) return button;

  return (
    <Tooltip label={label} position="top" openDelay={250}>
      {button}
    </Tooltip>
  );
}
