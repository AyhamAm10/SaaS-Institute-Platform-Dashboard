'use client';

import { useStore } from 'zustand';
import { useStepperStore } from './stepper.store';
import { StepperState } from '../state/stepper.state';

export function useStepperMirror<K extends keyof StepperState>(key: K): StepperState[K] {
  const store = useStepperStore();
  return useStore(store, (state) => state[key]);
}

export function useStepperMirrorSelector<TSelected>(
  selector: (state: StepperState) => TSelected,
): TSelected {
  const store = useStepperStore();
  return useStore(store, selector);
}
