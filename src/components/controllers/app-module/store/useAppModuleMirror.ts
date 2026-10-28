import { useStore } from 'zustand';
import { useAppModuleStoreContext } from './app-module.store';
import { AppModuleState } from '../state/app-module.state';

export function useAppModuleMirror<K extends keyof AppModuleState>(key: K): AppModuleState[K] {
  const store = useAppModuleStoreContext();
  return useStore(store, (state) => state[key]);
}

export function useAppModuleMirrorSelector<T>(selector: (state: AppModuleState) => T): T {
  const store = useAppModuleStoreContext();
  return useStore(store, selector);
}
