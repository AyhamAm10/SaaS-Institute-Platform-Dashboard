import { useStore } from 'zustand';
import { useReportStoreContext } from './report.store';
import type { ReportState } from '../state/report.state';

export function useReportMirror<K extends keyof ReportState>(key: K): ReportState[K] {
  return useStore(useReportStoreContext(), (state) => state[key]);
}

export function useReportMirrorSelector<T>(selector: (state: ReportState) => T): T {
  return useStore(useReportStoreContext(), selector);
}
