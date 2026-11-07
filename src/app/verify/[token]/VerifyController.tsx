'use client';

import { useVerifyDocumentQuery } from '@/src/core/api';
import { VerifyView } from './ui/VerifyView';

/**
 * VerifyController
 *
 * Public page opened by the QR code of a printed statement, transcript,
 * exam sheet or receipt (D3). No sign-in: it shows what the institute
 * actually issued, so a forged or altered paper is caught.
 */
export function VerifyController({ token }: { token: string }) {
  const { data, isLoading, isError } = useVerifyDocumentQuery(token);
  return <VerifyView result={isError ? { valid: false } : (data ?? null)} isLoading={isLoading} />;
}
