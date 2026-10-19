'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface StepItemContextValue {
  step: number;
  label: string;
  description?: string;
  icon?: ReactNode;
  isOpen: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  toggleOpen: () => void;
}

export const StepItemContext = createContext<StepItemContextValue | null>(null);

export function useStepItemContext(): StepItemContextValue {
  const context = useContext(StepItemContext);
  if (!context) {
    throw new Error('useStepItemContext must be used within an <AppStepper.Step> hierarchy.');
  }
  return context;
}
