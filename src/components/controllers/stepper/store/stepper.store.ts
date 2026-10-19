import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { StepperState, createInitialStepperState } from '../state/stepper.state';
import { AppStepperInitialProps, StepConfig, resolveStepperConfig } from '../init/stepper.init';

export type StepperStore = ControllerStoreApi<StepperState>;

export function createStepperStore(initialProps: AppStepperInitialProps): StepperStore {
  const initial = createInitialStepperState(initialProps);

  return createControllerStore<StepperState>((set, get) => ({
    ...initial,

    setActive: (step: number) => {
      const state = get();
      if (step < 0) return;
      if (!state.isControlled) {
        set({ active: step });
      }
      state.rawProps.onStepChange?.(step);
    },

    goToStep: (step: number) => {
      get().setActive(step);
    },

    nextStep: async () => {
      const state = get();
      if (state.active >= state.totalSteps - 1) return;
      if (state.rawProps.onBeforeNext) {
        const canProceed = await state.rawProps.onBeforeNext(state.active);
        if (!canProceed) return;
      }
      get().setActive(state.active + 1);
    },

    prevStep: async () => {
      const state = get();
      if (state.active <= 0) return;
      if (state.rawProps.onBeforePrev) {
        const canProceed = await state.rawProps.onBeforePrev(state.active);
        if (!canProceed) return;
      }
      get().setActive(state.active - 1);
    },

    registerStep: (config: StepConfig) => {
      set((state) => {
        const exists = state.steps.find((s) => s.step === config.step);
        let newSteps: StepConfig[];
        if (exists) {
          newSteps = state.steps.map((s) => (s.step === config.step ? config : s));
        } else {
          newSteps = [...state.steps, config].sort((a, b) => a.step - b.step);
        }
        return {
          steps: newSteps,
          totalSteps: newSteps.length,
        };
      });
    },

    unregisterStep: (stepNumber: number) => {
      set((state) => {
        const newSteps = state.steps.filter((s) => s.step !== stepNumber);
        return {
          steps: newSteps,
          totalSteps: newSteps.length,
        };
      });
    },

    updateProps: (props: AppStepperInitialProps) => {
      const config = resolveStepperConfig(props);
      const isControlled = props.active !== undefined;
      set((state) => ({
        rawProps: props,
        config,
        isControlled,
        active: isControlled ? props.active! : state.active,
      }));
    },
  }));
}

export const StepperContext = createContext<StepperStore | null>(null);

export function useStepperStore(): StepperStore {
  const store = useContext(StepperContext);
  if (!store) {
    throw new Error('useStepperStore must be used within an <AppStepper> component hierarchy.');
  }
  return store;
}
