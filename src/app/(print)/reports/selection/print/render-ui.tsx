'use client';

import { useSearchParams } from 'next/navigation';
import { SelectionPrintController } from './SelectionPrintController';

export function RenderUi() {
  const searchParams = useSearchParams();
  const docId = searchParams.get('doc') || '';
  const autoPrint = searchParams.get('autoprint') === '1';

  return <SelectionPrintController docId={docId} autoPrint={autoPrint} />;
}

