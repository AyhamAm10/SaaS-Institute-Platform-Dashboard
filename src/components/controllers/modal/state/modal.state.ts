import { ReactNode } from 'react';
import { ControllerState } from '@/src/core/mirror/types';
import {
  AppModalInitialProps,
  ModalVariant,
  ResolvedModalConfig,
  resolveModalConfig,
} from '../init/modal.init';

export interface ModalState extends ControllerState {
  // Domain State
  opened: boolean;
  loading: boolean;
  title: ReactNode | null;
  description: ReactNode | null;
  icon: ReactNode | null;
  variant: ModalVariant;
  config: ResolvedModalConfig;
  rawProps: AppModalInitialProps;

  // Actions
  close: () => void;
  setLoading: (loading: boolean) => void;
  updateProps: (props: AppModalInitialProps) => void;
}

export function createInitialModalState(props: AppModalInitialProps): Omit<
  ModalState,
  'close' | 'setLoading' | 'updateProps'
> {
  const config = resolveModalConfig(props);

  return {
    opened: props.opened,
    loading: props.loading ?? false,
    title: props.title ?? null,
    description: props.description ?? null,
    icon: props.icon ?? null,
    variant: config.variant,
    config,
    rawProps: props,
  };
}
