'use client';

import { ReactNode } from 'react';
import { AppPageHeader } from '../../page-header';
import { AppModuleBreadcrumbItem } from '../init/app-module.init';

export interface AppModuleHeaderProps {
  breadcrumbs?: AppModuleBreadcrumbItem[];
  withBreadcrumbs?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function AppModuleHeader(props: AppModuleHeaderProps) {
  return <AppPageHeader {...props} />;
}
