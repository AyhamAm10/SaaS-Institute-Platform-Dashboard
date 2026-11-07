'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { REPORT_PAPER } from './init/report.init';

/** SVG data URI of a QR code for `text` (null while generating or without text). */
export function useQrDataUri(text: string | null): string | null {
  const [uri, setUri] = useState<{ text: string; value: string } | null>(null);

  useEffect(() => {
    if (!text) return;
    let cancelled = false;
    QRCode.toString(text, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: REPORT_PAPER.text, light: '#0000' } })
      .then((svg) => !cancelled && setUri({ text, value: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` }))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [text]);

  return text && uri?.text === text ? uri.value : null;
}
