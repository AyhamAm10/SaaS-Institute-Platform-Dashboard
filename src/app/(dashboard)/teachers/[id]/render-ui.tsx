'use client';

import { useParams } from 'next/navigation';
import { TeacherDetailController } from './TeacherDetailController';

/** Client boundary: reads the route id only. */
export function RenderUi() {
  const params = useParams<{ id: string }>();
  return <TeacherDetailController key={params.id} teacherId={Number(params.id)} />;
}
