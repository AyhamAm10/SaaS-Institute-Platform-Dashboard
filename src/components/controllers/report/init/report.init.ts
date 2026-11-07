import type { ReactNode } from 'react';
import type { ReportDocument, ReportTone } from '@/src/core/api';

/** Institute identity printed on every report (from the signed-in user). */
export interface ReportInstitute {
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface AppReportProps {
  document: ReportDocument;
  institute: ReportInstitute | null;
  /** screen: framed preview inside the dashboard · print: bare A4 pages. */
  variant?: 'screen' | 'print';
  /** Origin used in the verification QR link (defaults to the current site). */
  verifyOrigin?: string;
  children?: ReactNode;
}

export interface ResolvedReportConfig {
  variant: 'screen' | 'print';
  brand: string;
  verifyUrl: string | null;
}

/**
 * Paper palette. A report is a sheet of paper, so it keeps fixed print-safe
 * colors in both themes; only the brand comes from the institute.
 */
export const REPORT_PAPER = {
  background: '#ffffff',
  text: '#1f2328',
  muted: '#5f6b76',
  faint: '#8a949e',
  border: '#dfe3e8',
  stripe: '#f7f8fa',
  headerFill: '#f1f3f5',
  defaultBrand: '#c2410c',
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

export function resolveReportConfig(props: AppReportProps): ResolvedReportConfig {
  const token = props.document.verification?.token;
  const origin = props.verifyOrigin ?? (typeof window === 'undefined' ? '' : window.location.origin);
  return {
    variant: props.variant ?? 'screen',
    brand: props.institute?.primaryColor || REPORT_PAPER.defaultBrand,
    verifyUrl: token ? `${origin}/verify/${token}` : null,
  };
}
