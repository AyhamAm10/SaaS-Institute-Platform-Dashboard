'use client';

import { ReactNode } from 'react';
import { Box } from '@mantine/core';
import { useAppStepperContext } from './AppStepperContext';

export interface AppStepperStepProps {
  step: number;
  label: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function AppStepperStep({ step, children }: AppStepperStepProps) {
  const { active } = useAppStepperContext();

  if (active !== step) {
    return null;
  }

  return (
    <Box py="md">
      {children}
    </Box>
  );
}

AppStepperStep.displayName = 'AppStepper.Step';
