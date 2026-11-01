import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { AmbientState, createInitialAmbientState } from '../state/ambient.state';
import { AppAmbientInitialProps, resolveAmbientConfig } from '../init/ambient.init';

export type AmbientStore = ControllerStoreApi<AmbientState>;

export function createAmbientStore(props: AppAmbientInitialProps): AmbientStore {
  const initial = createInitialAmbientState(props);

  return createControllerStore<AmbientState>((set) => ({
    ...initial,
    updateProps: (next: AppAmbientInitialProps) => set({ config: resolveAmbientConfig(next) }),
  }));
}

export const AmbientContext = createContext<AmbientStore | null>(null);

export function useAmbientStore(): AmbientStore {
  const store = useContext(AmbientContext);
  if (!store) {
    throw new Error('useAmbientStore must be used within an <AppAmbient> component hierarchy.');
  }
  return store;
}
