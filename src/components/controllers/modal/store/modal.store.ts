'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { ModalState, createInitialModalState } from '../state/modal.state';
import { AppModalInitialProps, resolveModalConfig } from '../init/modal.init';

export type ModalStore = ControllerStoreApi<ModalState>;

export function createModalStore(initialProps: AppModalInitialProps): ModalStore {
  const initial = createInitialModalState(initialProps);

  return createControllerStore<ModalState>((set, get) => ({
    ...initial,

    close: () => {
      get().rawProps.onClose();
    },

    setLoading: (loading: boolean) => set({ loading }),

    updateProps: (props: AppModalInitialProps) => {
      const config = resolveModalConfig(props);
      set({
        rawProps: props,
        config,
        opened: props.opened,
        loading: props.loading !== undefined ? props.loading : get().loading,
        title: props.title !== undefined ? props.title : get().title,
        description: props.description !== undefined ? props.description : get().description,
        icon: props.icon !== undefined ? props.icon : get().icon,
        variant: config.variant,
      });
    },
  }));
}

export const ModalContext = createContext<ModalStore | null>(null);

export function useModalStore(): ModalStore {
  const store = useContext(ModalContext);
  if (!store) {
    throw new Error('useModalStore must be used within an <AppModal> component hierarchy.');
  }
  return store;
}
