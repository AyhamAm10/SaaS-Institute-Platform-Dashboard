'use client';

import React, { Children, isValidElement, ReactNode, useEffect, useMemo } from 'react';
import { Paper } from '@mantine/core';
import { useStepperMirror } from '../store/useStepperMirror';
import { StepItemContext, StepItemContextValue } from './StepItemContext';
import { AppStepperStepHeader } from './AppStepperStepHeader';
import { AppStepperStepContent } from './AppStepperStepContent';

export interface AppStepperStepProps {
  step: number;
  label: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function AppStepperStep({
  step,
  label,
  description,
  icon,
  children,
}: AppStepperStepProps) {
  const active = useStepperMirror('active');
  const config = useStepperMirror('config');
  const goToStep = useStepperMirror('goToStep');
  const registerStep = useStepperMirror('registerStep');
  const unregisterStep = useStepperMirror('unregisterStep');

  // Register step metadata in controller store
  useEffect(() => {
    registerStep({ step, label, description, icon });
    return () => {
      unregisterStep(step);
    };
  }, [step, label, description, icon, registerStep, unregisterStep]);

  const isOpen = active === step;
  const isCompleted = step < active;
  const isCurrent = step === active;

  const toggleOpen = () => {
    if (config.allowStepSelect || isCompleted || isCurrent) {
      goToStep(step);
    }
  };

  const contextValue: StepItemContextValue = useMemo(
    () => ({
      step,
      label,
      description,
      icon,
      isOpen,
      isCompleted,
      isCurrent,
      toggleOpen,
    }),
    [step, label, description, icon, isOpen, isCompleted, isCurrent, toggleOpen],
  );

  // Check if children contain explicit compound subcomponents
  const childrenArray = Children.toArray(children);
  const hasCompoundHeader = childrenArray.some(
    (child) =>
      isValidElement(child) &&
      (child.type === AppStepperStepHeader ||
        (child.type as any)?.displayName === 'AppStepperStep.Header'),
  );
  const hasCompoundContent = childrenArray.some(
    (child) =>
      isValidElement(child) &&
      (child.type === AppStepperStepContent ||
        (child.type as any)?.displayName === 'AppStepperStep.Content'),
  );

  const isCompoundMode = hasCompoundHeader || hasCompoundContent;

  return (
    <StepItemContext.Provider value={contextValue}>
      <Paper
        radius="lg"
        withBorder
        style={{
          backgroundColor: isOpen ? 'var(--app-surface)' : 'var(--app-subtle)',
          borderColor: isOpen ? 'var(--app-brand-accent)' : 'var(--app-border)',
          boxShadow: isOpen
            ? 'var(--app-card-shadow)'
            : '0 1px 3px rgba(0, 0, 0, 0.02)',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease',
          overflow: 'hidden',
        }}
      >
        {isCompoundMode ? (
          children
        ) : (
          <>
            <AppStepperStepHeader />
            <AppStepperStepContent>{children}</AppStepperStepContent>
          </>
        )}
      </Paper>
    </StepItemContext.Provider>
  );
}

AppStepperStep.Header = AppStepperStepHeader;
AppStepperStep.Content = AppStepperStepContent;
AppStepperStep.displayName = 'AppStepper.Step';
