import React, { ReactNode } from 'react';
import { MantineSize } from '@mantine/core';

export type DrawerSize = MantineSize | (string & {}) | number;
export type DrawerPosition = 'right' | 'left' | 'top' | 'bottom';

export interface AppDrawerInitialProps {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  size?: DrawerSize;
  position?: DrawerPosition;
  loading?: boolean;
  withCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  trapFocus?: boolean;
  lockScroll?: boolean;
  padding?: MantineSize | number;
  zIndex?: number;
  children?: ReactNode;
}

export interface ResolvedDrawerConfig {
  size: DrawerSize;
  position: DrawerPosition;
  padding: MantineSize | number;
  withCloseButton: boolean;
  closeOnClickOutside: boolean;
  closeOnEscape: boolean;
}

export function resolveDrawerConfig(props: AppDrawerInitialProps): ResolvedDrawerConfig {
  return {
    size: props.size ?? 'md',
    position: props.position ?? 'right',
    padding: props.padding ?? 'lg',
    withCloseButton: props.withCloseButton ?? true,
    closeOnClickOutside: props.closeOnClickOutside ?? true,
    closeOnEscape: props.closeOnEscape ?? true,
  };
}
