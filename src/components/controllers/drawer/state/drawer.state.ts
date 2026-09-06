import { ReactNode } from 'react';
import { ControllerState } from '@/src/core/mirror/types';
import { AppDrawerInitialProps, ResolvedDrawerConfig, resolveDrawerConfig } from '../init/drawer.init';

export interface DrawerState extends ControllerState {
  // Domain State
  opened: boolean;
  loading: boolean;
  title: ReactNode | null;
  description: ReactNode | null;
  icon: ReactNode | null;
  config: ResolvedDrawerConfig;
  rawProps: AppDrawerInitialProps;

  // Actions
  close: () => void;
  setLoading: (loading: boolean) => void;
  updateProps: (props: AppDrawerInitialProps) => void;
}

export function createInitialDrawerState(props: AppDrawerInitialProps): Omit<
  DrawerState,
  'close' | 'setLoading' | 'updateProps'
> {
  const config = resolveDrawerConfig(props);

  return {
    opened: props.opened,
    loading: props.loading ?? false,
    title: props.title ?? null,
    description: props.description ?? null,
    icon: props.icon ?? null,
    config,
    rawProps: props,
  };
}
