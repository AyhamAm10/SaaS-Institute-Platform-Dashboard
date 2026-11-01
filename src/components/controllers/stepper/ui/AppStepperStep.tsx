'use client';

import React, { Children, isValidElement, ReactNode, useEffect, useMemo } from 'react';
import { AppSurface } from '../../surface';
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
      {/* Open step = raised glass card with a soft orange ring; closed steps sit flat. */}
      <AppSurface
        level={isOpen ? 2 : 1}
        radius="xl"
        padding={0}
        style={{
          overflow: 'hidden',
          boxShadow: isOpen
            ? 'var(--app-card-shadow), 0 0 0 1px var(--app-brand-accent-ring), 0 18px 40px -20px rgba(241, 103, 38, 0.35)'
            : 'var(--app-glass-highlight)',
          transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
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
      </AppSurface>
    </StepItemContext.Provider>
  );
}

AppStepperStep.Header = AppStepperStepHeader;
AppStepperStep.Content = AppStepperStepContent;
AppStepperStep.displayName = 'AppStepper.Step';
