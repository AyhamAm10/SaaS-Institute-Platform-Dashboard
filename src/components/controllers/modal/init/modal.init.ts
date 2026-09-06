import React, { ReactNode } from 'react';
import { MantineSize, MantineRadius } from '@mantine/core';

export type ModalSize = MantineSize | (string & {}) | number;
export type ModalVariant = 'default' | 'danger' | 'warning' | 'info' | 'success';

export interface AppModalInitialProps {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  variant?: ModalVariant;
  size?: ModalSize;
  centered?: boolean;
  loading?: boolean;
  withCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;
  lockScroll?: boolean;
  radius?: MantineRadius;
  zIndex?: number;
  children?: ReactNode;
}

export interface ResolvedModalConfig {
  size: ModalSize;
  variant: ModalVariant;
  centered: boolean;
  radius: MantineRadius;
  withCloseButton: boolean;
  closeOnClickOutside: boolean;
  closeOnEscape: boolean;
}

export function resolveModalConfig(props: AppModalInitialProps): ResolvedModalConfig {
  return {
    size: props.size ?? 'md',
    variant: props.variant ?? 'default',
    centered: props.centered ?? true,
    radius: props.radius ?? 'lg',
    withCloseButton: props.withCloseButton ?? true,
    closeOnClickOutside: props.closeOnClickOutside ?? true,
    closeOnEscape: props.closeOnEscape ?? true,
  };
}
