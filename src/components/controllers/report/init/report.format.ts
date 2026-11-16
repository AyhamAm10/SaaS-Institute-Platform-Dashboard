import type { ReportBadgeCell, ReportCell, ReportColumnKind, ReportMoneyCell } from '@/src/core/api';
import { formatDate, formatMoney, formatNumber } from '@/src/core/format';

/** Pure formatting of report cells (screen, print and tests share it). */

export function isMoneyCell(cell: ReportCell): cell is ReportMoneyCell {
  return typeof cell === 'object' && cell !== null && 'amount' in cell;
}

export function isBadgeCell(cell: ReportCell): cell is ReportBadgeCell {
  return typeof cell === 'object' && cell !== null && 'text' in cell;
}

/** Display text of a cell for its column kind ("—" for empty values). */
export function formatReportCell(cell: ReportCell, kind: ReportColumnKind): string {
  if (kind === 'blank') return '';
  if (cell === null || cell === '') return '—';
  if (isMoneyCell(cell)) return formatMoney(cell.amount, cell.currency);
  if (isBadgeCell(cell)) return cell.text;
  if (typeof cell === 'number') {
    if (kind === 'percent') return `${formatNumber(cell)}%`;
    return formatNumber(cell);
  }
  if (kind === 'date') return formatDate(cell);
  return cell;
}

/** Kind of a free value (stats / fields), inferred from its shape. */
export function inferKind(cell: ReportCell): ReportColumnKind {
  if (isMoneyCell(cell)) return 'money';
  if (isBadgeCell(cell)) return 'badge';
  if (typeof cell === 'number') return 'number';
  if (typeof cell === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(cell)) return 'date';
  return 'text';
}

/** Cells that read left-to-right inside the Arabic page (numbers, phones, money). */
export function isLtrKind(kind: ReportColumnKind): boolean {
  return (
    kind === 'phone' ||
    kind === 'number' ||
    kind === 'mark' ||
    kind === 'percent' ||
    kind === 'date' ||
    kind === 'money'
  );
}

/** Numbers and money sit at the line start of their cell (left edge), dates / phones centered, text right. */
export function columnAlign(kind: ReportColumnKind): 'left' | 'center' | 'right' {
  if (kind === 'number' || kind === 'money' || kind === 'percent') return 'left';
  return isLtrKind(kind) ? 'center' : 'right';
}

/** Relative column widths → percentages that sum to 100. */
export function columnPercents(widths: (number | undefined)[]): number[] {
  const values = widths.map((w) => (w && w > 0 ? w : 1));
  const total = values.reduce((a, b) => a + b, 0);
  return values.map((w) => Math.round((w / total) * 1000) / 10);
}

/** "2026/11/07 14:05" of an ISO instant (generation time). */
export function formatGeneratedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${formatDate(d)} ${hh}:${mm}`;
}

/** Escapes text for a CSS string literal (margin-box content). */
function cssString(text: string): string {
  return `"${text.replace(/[\\"]/g, '\\$&').replace(/\s+/g, ' ')}"`;
}

export const REPORT_FOOTER_NOTE = 'مستند مُولَّد آلياً من منصة إدارة المعهد';

/**
 * Print CSS of the whole print system. Page 1 is the cover (named page
 * "cover": no margins, no running boxes); every other page carries the footer
 * boxes (issue date, generated-by note, "صفحة X من Y"), the running header
 * lives in the repeated table head.
 */
export function pageCss(orientation: 'portrait' | 'landscape', issuedAt = ''): string {
  const box = 'font: 9px Tajawal, sans-serif; color: #8a949e; direction: rtl;';
  return `
@page { size: A4 ${orientation}; margin: 10mm 10mm 16mm;
  @bottom-right { content: ${cssString(REPORT_FOOTER_NOTE)}; ${box} }
  @bottom-center { content: ${cssString(issuedAt ? 'صدر بتاريخ ' + issuedAt : '')}; ${box} }
  @bottom-left { content: "صفحة " counter(page) " من " counter(pages); ${box} }
}
@page cover { size: A4 ${orientation}; margin: 0; @bottom-right { content: none; } @bottom-center { content: none; } @bottom-left { content: none; } }
.report-cover { page: cover; break-after: page; }
.report-frame { width: 100%; border-collapse: collapse; }
.report-frame > thead { display: table-header-group; }
.report-frame > tbody > tr > td, .report-frame > thead > tr > td { padding: 0; }
@media screen { .report-frame-body { padding: 4mm 10mm 10mm; } .report-frame-head { padding: 0 10mm; } }
@media print {
  html, body { background: #ffffff !important; }
  .no-print { display: none !important; }
  .report-paper { box-shadow: none !important; margin: 0 !important; width: auto !important; min-height: 0 !important; padding: 0 !important; border: 0 !important; border-radius: 0 !important; }
  .report-avoid-break { break-inside: avoid; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}`;
}
