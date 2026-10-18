'use client';

import { useStore } from 'zustand';
import { useStudentsStore } from './students.store';
import { StudentsState } from '../state/students.state';

export function useStudentsMirror<K extends keyof StudentsState>(key: K): StudentsState[K] {
  const store = useStudentsStore();
  return useStore(store, (s) => s[key]);
}

export function useStudentsMirrorSelector<T>(selector: (state: StudentsState) => T): T {
  const store = useStudentsStore();
  return useStore(store, selector);
}
