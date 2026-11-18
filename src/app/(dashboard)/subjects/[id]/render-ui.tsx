'use client';

import { useParams } from 'next/navigation';
import { SubjectDetailController } from './SubjectDetailController';

/** Client boundary: reads the route id only. */
export function RenderUi() {
  const params = useParams<{ id: string }>();
  return <SubjectDetailController key={params.id} id={Number(params.id)} />;
}
