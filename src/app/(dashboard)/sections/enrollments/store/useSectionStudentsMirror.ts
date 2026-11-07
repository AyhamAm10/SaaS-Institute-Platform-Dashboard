'use client';

import { useStore } from 'zustand';
import { useSectionStudentsStore } from './section-students.store';
import { SectionStudentsState } from '../state/section-students.state';

/** Strongly typed Mirror hook for SectionStudentsController. */
export function useSectionStudentsMirror<K extends keyof SectionStudentsState>(
  key: K,
): SectionStudentsState[K] {
  return useStore(useSectionStudentsStore(), (state) => state[key]);
}
