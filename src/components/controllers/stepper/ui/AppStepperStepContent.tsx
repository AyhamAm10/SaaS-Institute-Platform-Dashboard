'use client';

import { ReactNode } from 'react';
import { Box, Collapse, rem } from '@mantine/core';
import { useStepItemContext } from './StepItemContext';

export interface AppStepperStepContentProps {
  children?: ReactNode;
}

export function AppStepperStepContent({ children }: AppStepperStepContentProps) {
  const { isOpen } = useStepItemContext();

  return (
    <Collapse
      expanded={isOpen}
      transitionDuration={350}
      transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Box
        px={{ base: rem(18), sm: rem(28) }}
        pt={rem(22)}
        pb={rem(28)}
      >
        {children}
      </Box>
    </Collapse>
  );
}

AppStepperStepContent.displayName = 'AppStepperStep.Content';
