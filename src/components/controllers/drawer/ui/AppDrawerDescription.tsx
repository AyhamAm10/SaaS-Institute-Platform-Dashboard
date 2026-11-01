'use client';

import { Text } from '@mantine/core';
import { ReactNode } from 'react';
import { useDrawerMirror } from '../store/useDrawerMirror';

export interface AppDrawerDescriptionProps {
  children?: ReactNode;
  className?: string;
}

export function AppDrawerDescription({ children, className }: AppDrawerDescriptionProps) {
  const storeDesc = useDrawerMirror('description');
  const content = children ?? storeDesc;

  if (!content) return null;

  return (
    <Text size="sm" fw={300} c="var(--app-text-secondary)" className={className} style={{ lineHeight: 1.5 }}>
      {content}
    </Text>
  );
}
