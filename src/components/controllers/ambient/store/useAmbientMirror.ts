import { useStore } from 'zustand';
import { useAmbientStore } from './ambient.store';
import { AmbientState } from '../state/ambient.state';

export function useAmbientMirror<K extends keyof AmbientState>(key: K): AmbientState[K] {
  const store = useAmbientStore();
  return useStore(store, (state) => state[key]);
}

export function useAmbientMirrorSelector<T>(selector: (state: AmbientState) => T): T {
  const store = useAmbientStore();
  return useStore(store, selector);
}
