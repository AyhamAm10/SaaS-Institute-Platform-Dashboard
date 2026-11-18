'use client';

import { useParams } from 'next/navigation';
import { SectionDetailController } from './SectionDetailController';

/** Client boundary: reads the route id only. */
export function RenderUi() {
  const params = useParams<{ id: string }>();
  return <SectionDetailController key={params.id} sectionId={Number(params.id)} />;
}
