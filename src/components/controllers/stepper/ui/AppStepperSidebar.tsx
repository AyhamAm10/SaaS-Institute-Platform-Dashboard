'use client';

import React from 'react';
import { Box, rem, Stack } from '@mantine/core';
import { useStepperMirror } from '../store/useStepperMirror';
import { AppStepperSidebarItem } from './AppStepperSidebarItem';

export interface AppStepperSidebarProps {
  children?: React.ReactNode;
}

export function AppStepperSidebar({ children }: AppStepperSidebarProps) {
  const steps = useStepperMirror('steps');
  const active = useStepperMirror('active');
  const config = useStepperMirror('config');
  const goToStep = useStepperMirror('goToStep');
  const rawProps = useStepperMirror('rawProps');

  const handleStepClick = (stepIndex: number) => {
    if (config.allowStepSelect || stepIndex < active) {
      if (rawProps.onStepClick) {
        rawProps.onStepClick(stepIndex);
      } else {
        goToStep(stepIndex);
      }
    }
  };

  return (
    <Box
      visibleFrom="md"
      w={typeof config.sidebarWidth === 'number' ? rem(config.sidebarWidth) : config.sidebarWidth}
      style={{
        flexShrink: 0,
        position: 'sticky',
        top: rem(24),
        paddingTop: rem(6),
      }}
    >
      <Stack gap={rem(32)}>
        <Stack gap={rem(44)} style={{ position: 'relative' }}>
          {steps.map((s, idx) => {
            const isCompleted = s.step < active;
            const isCurrent = s.step === active;
            const isClickable = config.allowStepSelect || isCompleted;
            const isLast = idx === steps.length - 1;

            return (
              <AppStepperSidebarItem
                key={s.step}
                s={s}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                isClickable={isClickable}
                isLast={isLast}
                handleStepClick={handleStepClick}
              />
            );
          })}
        </Stack>

        {children}
      </Stack>
    </Box>
  );
}
