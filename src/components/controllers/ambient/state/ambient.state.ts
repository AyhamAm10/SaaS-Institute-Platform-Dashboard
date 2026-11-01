import { ControllerState } from '@/src/core/mirror';
import { AppAmbientInitialProps, ResolvedAmbientConfig, resolveAmbientConfig } from '../init/ambient.init';

export interface AmbientState extends ControllerState {
  config: ResolvedAmbientConfig;
  updateProps: (props: AppAmbientInitialProps) => void;
}

export function createInitialAmbientState(props: AppAmbientInitialProps): AmbientState {
  return {
    config: resolveAmbientConfig(props),
    updateProps: () => {},
  };
}
