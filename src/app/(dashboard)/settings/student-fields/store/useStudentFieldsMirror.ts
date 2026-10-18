'use client';

import { useStore } from 'zustand';
import { useStudentFieldsStore } from './student-fields.store';
import { StudentFieldsState } from '../state/student-fields.state';

export function useStudentFieldsMirror<K extends keyof StudentFieldsState>(
  key: K,
): StudentFieldsState[K] {
  const store = useStudentFieldsStore();
  return useStore(store, (s) => s[key]);
}

export function useStudentFieldsMirrorSelector<T>(
  selector: (state: StudentFieldsState) => T,
): T {
  const store = useStudentFieldsStore();
  return useStore(store, selector);
}
