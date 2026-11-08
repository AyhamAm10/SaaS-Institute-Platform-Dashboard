import type { ReportCategory, ReportDefinition, ReportParamKind, ReportParams } from '@/src/core/api';
import { reportLink } from '@/src/components/controllers/report/init/report-link';
import { CATEGORY_ORDER } from '../static-data/reports.data';

/** Pure helpers of the reports center and workspace (D3). */

/** Catalog entries matching a free-text search and a category. */
export function filterCatalog(
  catalog: ReportDefinition[],
  search: string,
  category: ReportCategory | 'all',
): ReportDefinition[] {
  const q = search.trim();
  return catalog.filter(
    (r) => (category === 'all' || r.category === category) && (!q || r.title.includes(q) || r.description.includes(q)),
  );
}

/** Non-empty categories in display order with their reports. */
export function groupCatalog(catalog: ReportDefinition[]): { category: ReportCategory; reports: ReportDefinition[] }[] {
  return CATEGORY_ORDER.map((category) => ({ category, reports: catalog.filter((r) => r.category === category) })).filter(
    (g) => g.reports.length > 0,
  );
}

/** Workspace form: every parameter kept as a string (inputs / selects). */
export type ReportForm = Partial<Record<ReportParamKind, string | null>>;

/** Query name of each parameter kind (same contract as the server). */
export const PARAM_QUERY: Record<ReportParamKind, keyof ReportParams> = {
  student: 'studentId',
  section: 'sectionId',
  exam: 'examId',
  teacher: 'teacherId',
  date: 'date',
  from: 'from',
  to: 'to',
  currency: 'currency',
  paymentMethod: 'paymentMethod',
  minCount: 'minCount',
  days: 'days',
  status: 'statusId',
  city: 'cityId',
  school: 'schoolId',
  bus: 'busId',
  knowWay: 'knowWayId',
  customFilters: 'customFilters',
};

const NUMERIC: ReadonlySet<ReportParamKind> = new Set([
  'student',
  'section',
  'exam',
  'teacher',
  'minCount',
  'days',
  'status',
  'city',
  'school',
  'bus',
  'knowWay',
]);

/** Form → API params (only the report's own parameters, empty values dropped). */
export function toReportParams(definition: Pick<ReportDefinition, 'params'>, form: ReportForm): ReportParams {
  const params: Record<string, string | number> = {};
  for (const { kind } of definition.params) {
    const raw = form[kind]?.toString().trim();
    if (!raw) continue;
    const value = NUMERIC.has(kind) ? Number(raw) : raw;
    if (typeof value === 'number' && !(value > 0)) continue;
    params[PARAM_QUERY[kind]] = value;
  }
  return params as ReportParams;
}

/** URL search params (contextual launch, print page) → form. */
export function formFromSearch(search: URLSearchParams): ReportForm {
  const form: ReportForm = {};
  for (const [kind, query] of Object.entries(PARAM_QUERY) as [ReportParamKind, string][]) {
    const value = search.get(query);
    if (value) form[kind] = value;
  }
  return form;
}

/** API params → query string (print page link, Excel). */
export function toQueryString(params: ReportParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  return search.toString();
}

/** Required parameters still empty in the form. */
export function missingRequired(definition: ReportDefinition, form: ReportForm): ReportParamKind[] {
  return definition.params.filter((p) => p.required && !form[p.kind]?.toString().trim()).map((p) => p.kind);
}

/** Link to a report workspace with parameters already chosen. */
export function reportHref(key: string, params: ReportParams = {}): string {
  return reportLink(key, params);
}

/** Link to the print page (opens the browser print dialog once loaded). */
export function reportPrintHref(key: string, params: ReportParams): string {
  const qs = toQueryString(params);
  return `/reports/${key}/print?${qs}${qs ? '&' : ''}autoprint=1`;
}
