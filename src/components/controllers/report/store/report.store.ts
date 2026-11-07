import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import type { ControllerStoreApi } from '@/src/core/mirror/types';
import type { ReportState } from '../state/report.state';
import { type AppReportProps, resolveReportConfig } from '../init/report.init';

export type ReportStore = ControllerStoreApi<ReportState>;

/** Isolated store of one rendered report (several can share a page). */
export function createReportStore(props: AppReportProps): ReportStore {
  const config = resolveReportConfig(props);
  return createControllerStore<ReportState>((set) => ({
    document: props.document,
    institute: props.institute,
    ...config,
    qrDataUri: null,
    setQrDataUri: (qrDataUri) => set({ qrDataUri }),
    sync: (patch) => set(patch),
  }));
}

export const ReportContext = createContext<ReportStore | null>(null);

export function useReportStoreContext(): ReportStore {
  const store = useContext(ReportContext);
  if (!store) throw new Error('AppReport sub-components must be rendered inside <AppReport>.');
  return store;
}
