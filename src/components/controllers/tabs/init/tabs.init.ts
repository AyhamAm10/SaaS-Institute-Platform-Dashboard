import type { ReactNode } from 'react';

export interface AppTabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Optional counter rendered as a small pill next to the label. */
  count?: number;
  disabled?: boolean;
}

export interface AppTabsInitialProps {
  items: AppTabItem[];
  /** Controlled value. */
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
  size?: 'xs' | 'sm' | 'md';
  children?: ReactNode;
}

export interface ResolvedTabsConfig {
  fullWidth: boolean;
  size: 'xs' | 'sm' | 'md';
}

export function resolveTabsConfig(props: AppTabsInitialProps): ResolvedTabsConfig {
  return {
    fullWidth: props.fullWidth ?? false,
    size: props.size ?? 'sm',
  };
}

export function resolveInitialTab(props: AppTabsInitialProps): string {
  return props.value ?? props.defaultValue ?? props.items[0]?.value ?? '';
}
