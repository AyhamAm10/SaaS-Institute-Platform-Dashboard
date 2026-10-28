import { ReactNode } from 'react';

export interface StatCardProps {
  children?: ReactNode;
  variant?: 'default' | 'elevated' | 'glass';
  className?: string;
}

export interface ResolvedStatCardConfig {
  variant: 'default' | 'elevated' | 'glass';
}

export function resolveStatCardConfig(props: StatCardProps): ResolvedStatCardConfig {
  return {
    variant: props.variant ?? 'glass',
  };
}
