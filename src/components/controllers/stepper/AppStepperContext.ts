'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface AppStepperStepConfig {
  step: number;
  label: string;
  description?: string;
  icon?: ReactNode;
}

export interface AppStepperContextValue {
  active: number;
  totalSteps: number;
  steps: AppStepperStepConfig[];
  registerStep: (config: AppStepperStepConfig) => void;
  onStepClick?: (step: number) => void;
  allowStepSelect?: boolean;
}

export const AppStepperContext = createContext<AppStepperContextValue | null>(null);

export function useAppStepperContext(): AppStepperContextValue {
  const context = useContext(AppStepperContext);
  if (!context) {
    throw new Error('useAppStepperContext must be used within an AppStepper provider');
  }
  return context;
}
