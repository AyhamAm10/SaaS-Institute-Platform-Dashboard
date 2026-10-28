import { ReactNode } from 'react';

export interface AppModuleBreadcrumbItem {
  label: string;
  href?: string;
}

export interface AppModuleInitialProps {
  children?: ReactNode;
  variant?: 'dashboard' | 'table' | 'form' | 'default';
  className?: string;
}

export interface ResolvedAppModuleConfig {
  variant: 'dashboard' | 'table' | 'form' | 'default';
}

export function resolveAppModuleConfig(props: AppModuleInitialProps): ResolvedAppModuleConfig {
  return {
    variant: props.variant ?? 'default',
  };
}
