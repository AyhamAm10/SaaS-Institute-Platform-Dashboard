import { ControllerState } from '@/src/core/mirror';
import { AppModuleInitialProps, SelectionExportColumn } from '../init/app-module.init';

export interface AppModuleState extends ControllerState {
  rawProps: AppModuleInitialProps;
  exportTitle?: string;
  selection: {
    rows: unknown[];
    columns: SelectionExportColumn[];
  };
  isExporting: boolean;
  exportError: string | null;
  setSelection: (rows: unknown[], columns: SelectionExportColumn[]) => void;
  setExporting: (isExporting: boolean) => void;
  setExportError: (error: string | null) => void;
}

export function createInitialAppModuleState(props: AppModuleInitialProps): Omit<
  AppModuleState,
  'setSelection' | 'setExporting' | 'setExportError'
> {
  return {
    rawProps: props,
    exportTitle: props.exportTitle,
    selection: {
      rows: [],
      columns: [],
    },
    isExporting: false,
    exportError: null,
  };
}
