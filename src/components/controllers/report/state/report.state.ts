import type { ControllerState } from '@/src/core/mirror';
import type { ReportDocument } from '@/src/core/api';
import type { ReportInstitute } from '../init/report.init';

/**
 * ReportState
 *
 * One rendered report: the server document, the institute identity, the
 * resolved brand color, the verification link and its QR image.
 */
export interface ReportState extends ControllerState {
  document: ReportDocument;
  institute: ReportInstitute | null;
  variant: 'screen' | 'print';
  brand: string;
  verifyUrl: string | null;
  /** SVG data URI of the verification QR (null until generated). */
  qrDataUri: string | null;
  setQrDataUri: (uri: string | null) => void;
  sync: (patch: Partial<Pick<ReportState, 'document' | 'institute' | 'variant' | 'brand' | 'verifyUrl'>>) => void;
}
