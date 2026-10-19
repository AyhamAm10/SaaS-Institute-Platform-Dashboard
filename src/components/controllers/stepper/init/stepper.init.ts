import { ReactNode } from 'react';

export interface StepConfig {
  step: number;
  label: string;
  description?: string;
  icon?: ReactNode;
}

export interface AppStepperInitialProps {
  /**
   * Controlled active step index.
   */
  active?: number;

  /**
   * Default active step index for uncontrolled mode. Defaults to 0.
   */
  defaultStep?: number;

  /**
   * Callback fired whenever the active step changes.
   */
  onStepChange?: (step: number) => void;

  /**
   * Callback fired when a step header or sidebar item is clicked.
   */
  onStepClick?: (step: number) => void;

  /**
   * Whether steps can be clicked directly to open. Defaults to false.
   */
  allowStepSelect?: boolean;

  /**
   * Optional validation hook before advancing to the next step.
   */
  onBeforeNext?: (currentStep: number) => boolean | Promise<boolean>;

  /**
   * Optional validation hook before moving back to previous step.
   */
  onBeforePrev?: (currentStep: number) => boolean | Promise<boolean>;

  /**
   * Width of the vertical timeline sidebar on desktop view. Defaults to 340px.
   */
  sidebarWidth?: number | string;

  /**
   * Child step components.
   */
  children?: ReactNode;
}

export interface ResolvedStepperConfig {
  allowStepSelect: boolean;
  sidebarWidth: number | string;
}

export function resolveStepperConfig(props: AppStepperInitialProps): ResolvedStepperConfig {
  return {
    allowStepSelect: props.allowStepSelect ?? false,
    sidebarWidth: props.sidebarWidth ?? 340,
  };
}
