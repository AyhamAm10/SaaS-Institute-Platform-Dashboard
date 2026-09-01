import { createStore } from 'zustand/vanilla';
import { ControllerState, ControllerStoreApi } from './types';

/**
 * Factory function to create an isolated, per-instance vanilla Zustand store.
 *
 * This guarantees that every time a Controller component mounts, a new independent
 * store is instantiated, preventing cross-instance state pollution.
 *
 * @param stateCreator - Function that defines the initial state and actions using set/get/store.
 */
export function createControllerStore<TState extends ControllerState>(
  stateCreator: (
    set: ControllerStoreApi<TState>['setState'],
    get: ControllerStoreApi<TState>['getState'],
    store: ControllerStoreApi<TState>,
  ) => TState,
): ControllerStoreApi<TState> {
  return createStore<TState>(stateCreator);
}
