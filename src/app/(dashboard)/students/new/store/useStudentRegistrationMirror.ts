'use client';

import { useStore } from 'zustand';
import { useStudentRegistrationStore } from './student-registration.store';
import { StudentRegistrationState } from '../state/student-registration.state';

export function useStudentRegistrationMirror<K extends keyof StudentRegistrationState>(
  key: K,
): StudentRegistrationState[K] {
  const store = useStudentRegistrationStore();
  return useStore(store, (s) => s[key]);
}

export function useStudentRegistrationMirrorSelector<T>(
  selector: (state: StudentRegistrationState) => T,
): T {
  const store = useStudentRegistrationStore();
  return useStore(store, selector);
}
