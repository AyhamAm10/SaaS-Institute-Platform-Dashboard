import { ReactNode } from 'react';
import type { ReportCell, ReportColumnKind } from '@/src/core/api';

export interface AppModuleBreadcrumbItem {
  label: string;
  href?: string;
}

export interface SelectionExportColumn {
  key: string;
  title: string;
  kind: ReportColumnKind;
  value: (row: unknown) => ReportCell;
}

export interface AppModuleInitialProps {
  children?: ReactNode;
  className?: string;
  /** Title of the printed / exported selection (e.g. "قائمة الطلاب"). */
  exportTitle?: string;
}
