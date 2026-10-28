import { ControllerState } from '@/src/core/mirror';
import { AppModuleInitialProps, resolveAppModuleConfig } from '../init/app-module.init';

export interface AppModuleState extends ControllerState {
  variant: 'dashboard' | 'table' | 'form' | 'default';
  rawProps: AppModuleInitialProps;
}

export function createInitialAppModuleState(props: AppModuleInitialProps): AppModuleState {
  const config = resolveAppModuleConfig(props);
  return {
    variant: config.variant,
    rawProps: props,
  };
}
