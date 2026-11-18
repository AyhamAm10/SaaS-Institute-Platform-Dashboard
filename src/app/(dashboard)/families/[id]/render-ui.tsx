'use client';

import { useParams } from 'next/navigation';
import { FamilyDetailController } from './FamilyDetailController';

/** Client boundary: reads the route id only. */
export function RenderUi() {
  const params = useParams<{ id: string }>();
  return <FamilyDetailController key={params.id} familyId={Number(params.id)} />;
}
