import type { ReactNode } from 'react';
import type { ReportDocument, ReportTone } from '@/src/core/api';

/** Institute identity printed on every report (from the signed-in user). */
export interface ReportInstitute {
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  phone?: string | null;
  address?: string | null;
}

/** One cover line ("الفرع": "فرع المزة"). */
export interface ReportScopeItem {
  label: string;
  value: string;
}

export interface AppReportProps {
  document: ReportDocument;
  institute: ReportInstitute | null;
  /** screen: framed preview inside the dashboard · print: cover page + bare A4 pages. */
  variant?: 'screen' | 'print';
  /** Origin used in the verification QR link (defaults to the current site). */
  verifyOrigin?: string;
  /**
   * Operational scope shown on the cover (branch, academic year) when the
   * document does not state it itself. Defaults to the active header context.
   */
  scope?: ReportScopeItem[];
  children?: ReactNode;
}

export interface ResolvedReportConfig {
  variant: 'screen' | 'print';
  brand: string;
  scope: ReportScopeItem[];
  verifyUrl: string | null;
}

/**
 * Paper palette. A report is a sheet of paper, so it keeps fixed print-safe
 * colors in both themes; only the brand comes from the institute. The ink and
 * orange are the identity of the institute (same as the dashboard and apps).
 */
export const REPORT_PAPER = {
  background: '#ffffff',
  text: '#1f2328',
  muted: '#5f6b76',
  faint: '#8a949e',
  border: '#dfe3e8',
  stripe: '#f7f6f4',
  headerFill: '#f1f3f5',
  /** Official logo orange: used when the institute has not chosen a color. */
  defaultBrand: '#F16726',
  /** Brand ink (cover panel, table header): the same black as the app's primary action. */
  ink: '#141416',
  onInk: '#ffffff',
  onInkMuted: '#cbc7c2',
} as const;

const TONES: Record<Exclude<ReportTone, 'brand'>, { text: string; soft: string }> = {
  success: { text: '#2b8a3e', soft: '#ebfbee' },
  danger: { text: '#c92a2a', soft: '#fff5f5' },
  warning: { text: '#b35c00', soft: '#fff4e0' },
  info: { text: '#1864ab', soft: '#e7f5ff' },
  neutral: { text: '#495057', soft: '#f1f3f5' },
};

/** Text + soft fill of a tone; the brand tone uses the institute color. */
export function resolveTone(tone: ReportTone | undefined, brand: string): { text: string; soft: string } {
  if (!tone || tone === 'brand') return { text: brand, soft: withAlpha(brand, 0.08) };
  return TONES[tone];
}

/** `#rrggbb` + alpha → rgba(); other colors are returned as-is. */
export function withAlpha(color: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(color.trim());
  if (!m) return color;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** The institute brand color, or the official platform orange. */
export function resolveBrand(institute: { primaryColor?: string | null } | null | undefined): string {
  return institute?.primaryColor || REPORT_PAPER.defaultBrand;
}

/** Document criteria preceded by the operational scope the document does not already state. */
export function coverDetails(
  meta: { label: string; value: string }[],
  scope: ReportScopeItem[],
): { label: string; value: string }[] {
  const known = new Set(meta.map((m) => m.label));
  return [...scope.filter((s) => !known.has(s.label)), ...meta];
}

export function resolveReportConfig(props: AppReportProps): ResolvedReportConfig {
  const token = props.document.verification?.token;
  const origin = props.verifyOrigin ?? (typeof window === 'undefined' ? '' : window.location.origin);
  return {
    variant: props.variant ?? 'screen',
    brand: resolveBrand(props.institute),
    scope: props.scope ?? [],
    verifyUrl: token ? `${origin}/verify/${token}` : null,
  };
}
