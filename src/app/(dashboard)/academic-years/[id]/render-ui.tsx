'use client';

import { useParams } from 'next/navigation';
import { AcademicYearDetailController } from './AcademicYearDetailController';

/** Client boundary: reads the route id only. */
export function RenderUi() {
  const params = useParams<{ id: string }>();
  return <AcademicYearDetailController key={params.id} id={Number(params.id)} />;
}
