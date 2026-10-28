import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { AppModuleState, createInitialAppModuleState } from '../state/app-module.state';
import { AppModuleInitialProps } from '../init/app-module.init';

export type AppModuleStore = ControllerStoreApi<AppModuleState>;

export function createAppModuleStore(props: AppModuleInitialProps): AppModuleStore {
  const initial = createInitialAppModuleState(props);

  return createControllerStore<AppModuleState>(() => ({
    ...initial,
  }));
}

export const AppModuleContext = createContext<AppModuleStore | null>(null);

export function useAppModuleStoreContext(): AppModuleStore {
  const context = useContext(AppModuleContext);
  if (!context) {
    throw new Error('AppModule subcomponents must be rendered within an <AppModule> provider');
  }
  return context;
}
