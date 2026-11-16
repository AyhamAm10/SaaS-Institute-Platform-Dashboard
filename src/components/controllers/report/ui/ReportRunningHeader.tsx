'use client';

import { useReportMirror, useReportMirrorSelector } from '../store/useReportMirror';
import { PrintLetterhead } from './PrintLetterhead';

/** Print-variant running header: repeated at the top of every inner page. */
export function ReportRunningHeader() {
  const institute = useReportMirror('institute');
  const brand = useReportMirror('brand');
  const title = useReportMirrorSelector((s) => s.document.title);
  return <PrintLetterhead institute={institute} brand={brand} title={title} />;
}
