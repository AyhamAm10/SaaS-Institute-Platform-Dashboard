'use client';

import { useParams } from 'next/navigation';
import { MarkSheetController } from './MarkSheetController';

/** Client boundary: reads the route id only. */
export function RenderUi() {
  const params = useParams<{ id: string }>();
  return <MarkSheetController key={params.id} examId={Number(params.id)} />;
}
