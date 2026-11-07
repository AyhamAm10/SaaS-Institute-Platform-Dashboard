'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { ReportWorkspaceController } from './ReportWorkspaceController';
import { formFromSearch } from '../utils/reports.utils';

/** Client boundary: reads the route key and the prefilled parameters only. */
export function RenderUi() {
  const params = useParams<{ key: string }>();
  const search = useSearchParams();
  return (
    <ReportWorkspaceController
      key={`${params.key}?${search.toString()}`}
      reportKey={params.key}
      initialForm={formFromSearch(new URLSearchParams(search.toString()))}
    />
  );
}
