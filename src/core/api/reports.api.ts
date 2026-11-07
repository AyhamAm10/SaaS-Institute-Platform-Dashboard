import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';

/**
 * Reports (phase 3 D3). The server owns the catalog (who may open what) and
 * builds every report into one typed document; the dashboard only renders
 * it (screen + print) and downloads the Excel version.
 */

export type ReportTone = 'brand' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';
export type ReportCurrency = 'SYP' | 'USD';

export interface ReportMoneyCell {
  amount: number;
  currency: ReportCurrency;
}

export interface ReportBadgeCell {
  text: string;
  tone: ReportTone;
}

export type ReportCell = string | number | ReportMoneyCell | ReportBadgeCell | null;

export type ReportColumnKind = 'text' | 'number' | 'percent' | 'mark' | 'date' | 'money' | 'badge' | 'phone' | 'blank';

export interface ReportColumn {
  key: string;
  title: string;
  kind: ReportColumnKind;
  width?: number;
}

export type ReportRow = Record<string, ReportCell>;

export interface ReportStatItem {
  label: string;
  value: ReportCell;
  /** Explicit kind (e.g. percent); inferred from the value otherwise. */
  kind?: ReportColumnKind;
  tone?: ReportTone;
  hint?: string;
}

export interface ReportBarItem {
  label: string;
  value: number;
  caption?: string;
  tone?: ReportTone;
}

export type ReportBlock =
  | { type: 'stats'; title?: string; items: ReportStatItem[] }
  | { type: 'fields'; title?: string; columns?: 2 | 3 | 4; items: { label: string; value: ReportCell }[] }
  | {
      type: 'table';
      title?: string;
      columns: ReportColumn[];
      rows: ReportRow[];
      totals?: ReportRow[];
      emptyText?: string;
      ruled?: boolean;
    }
  | {
      type: 'grid';
      title?: string;
      corner: string;
      columns: string[];
      rows: { label: string; sub?: string; cells: (string | null)[] }[];
      ruled?: boolean;
    }
  | { type: 'bars'; title?: string; items: ReportBarItem[] }
  | { type: 'note'; tone: ReportTone; text: string }
  | { type: 'signatures'; items: string[] };

export interface ReportVerification {
  number: string;
  token: string;
}

export interface ReportDocument {
  key: string;
  title: string;
  subtitle?: string;
  orientation: 'portrait' | 'landscape';
  meta: { label: string; value: string }[];
  blocks: ReportBlock[];
  generatedAt: string;
  generatedBy: string | null;
  verification?: ReportVerification;
}

export type ReportCategory = 'student' | 'finance' | 'attendance' | 'academic' | 'sheets' | 'admin';

export type ReportParamKind =
  | 'student'
  | 'section'
  | 'exam'
  | 'teacher'
  | 'date'
  | 'from'
  | 'to'
  | 'currency'
  | 'paymentMethod'
  | 'minCount'
  | 'days';

export interface ReportDefinition {
  key: string;
  category: ReportCategory;
  title: string;
  description: string;
  permission: string;
  params: { kind: ReportParamKind; required: boolean }[];
  verifiable?: boolean;
}

/** Query parameters of a report (catalog kinds → query names). */
export interface ReportParams {
  studentId?: number;
  sectionId?: number;
  examId?: number;
  teacherId?: number;
  date?: string;
  from?: string;
  to?: string;
  currency?: ReportCurrency;
  paymentMethod?: 'CASH' | 'BANK_TRANSFER' | 'OTHER';
  minCount?: number;
  days?: number;
}

export interface VerificationResult {
  valid: boolean;
  institute?: { name: string; logoUrl: string; primaryColor: string };
  kind?: string;
  number?: string;
  issuedAt?: string;
  subject?: string;
  lines?: string[];
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getReportCatalog(): Promise<ReportDefinition[]> {
  const { data } = await apiClient.get<ReportDefinition[]>('/reports/catalog');
  return data;
}

export async function getReport(key: string, params: ReportParams): Promise<ReportDocument> {
  const { data } = await apiClient.get<ReportDocument>(`/reports/${key}`, { params });
  return data;
}

/** Downloads the Excel version and saves it with the server's file name. */
export async function downloadReportExcel(key: string, params: ReportParams): Promise<void> {
  const response = await apiClient.get<Blob>(`/reports/${key}/excel`, { params, responseType: 'blob' });
  const disposition = String(response.headers['content-disposition'] ?? '');
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? `${key}.xlsx`;
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Sends a built ReportDocument to be rendered and downloaded as an Excel workbook. */
export async function downloadDocumentExcel(doc: ReportDocument): Promise<void> {
  const response = await apiClient.post<Blob>('/reports/render/excel', doc, { responseType: 'blob' });
  const disposition = String(response.headers['content-disposition'] ?? '');
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? `${doc.key || 'selection'}.xlsx`;
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function getReceiptVerification(paymentId: number): Promise<ReportVerification> {
  const { data } = await apiClient.get<ReportVerification>(`/reports/receipts/${paymentId}/verification`);
  return data;
}

export async function verifyDocument(token: string): Promise<VerificationResult> {
  const { data } = await apiClient.get<VerificationResult>(`/reports/verify/${encodeURIComponent(token)}`);
  return data;
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const reportsKeys = {
  all: ['reports'] as const,
  catalog: () => [...reportsKeys.all, 'catalog'] as const,
  document: (key: string, params: ReportParams) => [...reportsKeys.all, 'document', key, params] as const,
  receipt: (paymentId: number) => [...reportsKeys.all, 'receipt', paymentId] as const,
  verify: (token: string) => [...reportsKeys.all, 'verify', token] as const,
};

export function useReportCatalogQuery() {
  return useQuery({ queryKey: reportsKeys.catalog(), queryFn: getReportCatalog, staleTime: 5 * 60_000 });
}

/** A document is built on demand (`enabled`), never refetched in the background. */
export function useReportQuery(key: string, params: ReportParams, enabled: boolean) {
  return useQuery({
    queryKey: reportsKeys.document(key, params),
    queryFn: () => getReport(key, params),
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

export function useReceiptVerificationQuery(paymentId: number) {
  return useQuery({
    queryKey: reportsKeys.receipt(paymentId),
    queryFn: () => getReceiptVerification(paymentId),
    enabled: paymentId > 0,
    staleTime: Infinity,
    retry: false,
  });
}

export function useVerifyDocumentQuery(token: string) {
  return useQuery({
    queryKey: reportsKeys.verify(token),
    queryFn: () => verifyDocument(token),
    enabled: Boolean(token),
    retry: false,
  });
}
