import type {
  ReportDefinition,
  ReportDocument,
  ReportParamKind,
  ReportParams,
  StudentField,
} from '@/src/core/api';
import type { ReportForm } from '../../utils/reports.utils';

export interface Option {
  value: string;
  label: string;
  cityId?: number | null;
}

export type OptionKey =
  | 'sections'
  | 'exams'
  | 'teachers'
  | 'students'
  | 'statuses'
  | 'cities'
  | 'schools'
  | 'buses'
  | 'knowWays';

/**
 * ReportWorkspaceState
 *
 * One report (D3): its catalog definition, the parameter form (prefilled
 * from the URL by contextual buttons), the submitted parameters, the
 * server document and the Excel export.
 */
export interface ReportWorkspaceState {
  reportKey: string;
  definition: ReportDefinition | null;
  catalogLoading: boolean;

  form: ReportForm;
  missing: ReportParamKind[];
  submitted: ReportParams | null;

  document: ReportDocument | null;
  isBuilding: boolean;
  buildError: string | null;

  options: Record<OptionKey, Option[]>;
  studentFields: StudentField[];
  studentSearch: string;
  /** Chosen student kept as an option while the search list changes. */
  selectedStudent: Option | null;

  isExporting: boolean;
  exportError: string | null;

  setField: (kind: ReportParamKind, value: string | null) => void;
  setStudentSearch: (search: string) => void;
  submit: () => void;
  syncDefinition: (definition: ReportDefinition | null, loading: boolean) => void;
  syncDocument: (document: ReportDocument | null, isBuilding: boolean, error: string | null) => void;
  syncOptions: (key: OptionKey, options: Option[]) => void;
  syncStudentFields: (fields: StudentField[]) => void;
  setSelectedStudent: (option: Option | null) => void;
  setExporting: (isExporting: boolean, error?: string | null) => void;
}
