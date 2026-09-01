import { StoreApi } from 'zustand';

/**
 * Generic Controller Store State Type.
 * Every controller defines its own state interface extending this.
 */
export type ControllerState = object;

/**
 * Store API type for isolated per-instance Zustand stores.
 */
export type ControllerStoreApi<TState extends ControllerState> = StoreApi<TState>;

/**
 * Mirror Schema defines all state, computed, and action properties
 * exposed by a Controller instance to its UI layer.
 */
export type MirrorSchema<TState extends ControllerState> = TState;

/**
 * Selector function type for extracting a slice from a Controller's mirror.
 */
export type MirrorSelector<TState extends ControllerState, TSelected> = (
  state: TState,
) => TSelected;
