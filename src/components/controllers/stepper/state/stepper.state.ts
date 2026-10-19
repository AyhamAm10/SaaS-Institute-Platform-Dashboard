import { ControllerState } from '@/src/core/mirror/types';
import {
  AppStepperInitialProps,
  ResolvedStepperConfig,
  StepConfig,
  resolveStepperConfig,
} from '../init/stepper.init';

export interface StepperState extends ControllerState {
  // Domain State
  active: number;
  totalSteps: number;
  steps: StepConfig[];
  isControlled: boolean;
  config: ResolvedStepperConfig;
  rawProps: AppStepperInitialProps;

  // Actions
  setActive: (step: number) => void;
  goToStep: (step: number) => void;
  nextStep: () => Promise<void> | void;
  prevStep: () => Promise<void> | void;
  registerStep: (config: StepConfig) => void;
  unregisterStep: (step: number) => void;
  updateProps: (props: AppStepperInitialProps) => void;
}

export function createInitialStepperState(
  props: AppStepperInitialProps,
): Omit<
  StepperState,
  'setActive' | 'goToStep' | 'nextStep' | 'prevStep' | 'registerStep' | 'unregisterStep' | 'updateProps'
> {
  const isControlled = props.active !== undefined;
  const config = resolveStepperConfig(props);

  return {
    active: isControlled ? props.active! : (props.defaultStep ?? 0),
    totalSteps: 0,
    steps: [],
    isControlled,
    config,
    rawProps: props,
  };
}
