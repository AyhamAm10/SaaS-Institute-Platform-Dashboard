'use client';

import { useStore } from 'zustand';
import { useTeacherRegistrationStore } from './teacher-registration.store';
import { TeacherRegistrationState } from '../state/teacher-registration.state';

export function useTeacherRegistrationMirror<K extends keyof TeacherRegistrationState>(
  key: K,
): TeacherRegistrationState[K] {
  const store = useTeacherRegistrationStore();
  return useStore(store, (s) => s[key]);
}

export function useTeacherRegistrationMirrorSelector<T>(
  selector: (state: TeacherRegistrationState) => T,
): T {
  const store = useTeacherRegistrationStore();
  return useStore(store, selector);
}
