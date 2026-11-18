'use client';

import { useParams } from 'next/navigation';
import { ContractDetailController } from './ContractDetailController';

/** Client boundary: reads the route id only. */
export function RenderUi() {
  const params = useParams<{ id: string }>();
  return <ContractDetailController key={params.id} id={Number(params.id)} />;
}
