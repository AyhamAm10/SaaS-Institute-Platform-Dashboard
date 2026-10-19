'use client';

import React, { useEffect, useState } from 'react';
import { AppStepperInitialProps } from './init/stepper.init';
import { StepperContext, createStepperStore } from './store/stepper.store';
import {
  AppStepperActions,
  AppStepperRoot,
  AppStepperSidebar,
  AppStepperStep,
  AppStepperStepContent,
  AppStepperStepHeader,
} from './ui';

export interface AppStepperProps extends AppStepperInitialProps {}

/**
 * AppStepper Controller
 *
 * Built adhering strictly to the Controller Architecture Guide and role.md:
 * - Isolated Zustand store per instance (src/core/mirror)
 * - 4-layer separation (init, state, store, ui)
 * - Compound Pattern (AppStepper.Step, AppStepper.Step.Header, AppStepper.Step.Content, AppStepper.Actions)
 * - Accordion row items with fluid Mantine Collapse animation
 * - Prominent, tall vertical timeline sidebar on the right
 */
export function AppStepper(props: AppStepperProps) {
  const [store] = useState(() => createStepperStore(props));

  // Synchronize controlled props
  useEffect(() => {
    store.getState().updateProps(props);
  }, [
    props.active,
    props.defaultStep,
    props.allowStepSelect,
    props.sidebarWidth,
    props.onStepChange,
    props.onStepClick,
    props.onBeforeNext,
    props.onBeforePrev,
    store,
  ]);

  return (
    <StepperContext.Provider value={store}>
      <AppStepperRoot>
        {props.children}
      </AppStepperRoot>
    </StepperContext.Provider>
  );
}

// Compound component attachments
AppStepper.Step = AppStepperStep;
AppStepper.Step.Header = AppStepperStepHeader;
AppStepper.Step.Content = AppStepperStepContent;
AppStepper.Actions = AppStepperActions;
AppStepper.Sidebar = AppStepperSidebar;
AppStepper.Root = AppStepperRoot;
