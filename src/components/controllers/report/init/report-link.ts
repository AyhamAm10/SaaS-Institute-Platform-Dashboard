import type { ReportParams } from '@/src/core/api/reports.api';

/** `/reports/<key>?<params>`: the workspace builds the report at once. */
export function reportLink(key: string, params: ReportParams = {}): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') search.set(k, String(v));
  }
  const qs = search.toString();
  return `/reports/${key}${qs ? `?${qs}` : ''}`;
}
