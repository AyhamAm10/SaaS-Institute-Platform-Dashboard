'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { ReportPrintController } from './ReportPrintController';
import { formFromSearch, toReportParams } from '@/src/app/(dashboard)/reports/utils/reports.utils';
import { REPORT_KINDS } from '@/src/app/(dashboard)/reports/static-data/reports.data';

/** Client boundary: reads the route key and the report parameters only. */
export function RenderUi() {
  const { key } = useParams<{ key: string }>();
  const search = new URLSearchParams(useSearchParams().toString());
  const params = toReportParams({ params: REPORT_KINDS }, formFromSearch(search));
  return <ReportPrintController reportKey={key} params={params} autoPrint={search.get('autoprint') === '1'} />;
}
