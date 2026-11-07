'use client';

import { useParams } from 'next/navigation';
import { StudentProfileController } from './StudentProfileController';

/** Client boundary: reads the route id only. */
export function RenderUi() {
  const params = useParams<{ id: string }>();
  return <StudentProfileController key={params.id} studentId={Number(params.id)} />;
}
