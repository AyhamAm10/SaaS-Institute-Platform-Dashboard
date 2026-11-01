'use client';

import { Text } from '@mantine/core';
import { ReactNode } from 'react';
import { useModalMirror } from '../store/useModalMirror';

export interface AppModalDescriptionProps {
  children?: ReactNode;
  className?: string;
}

export function AppModalDescription({ children, className }: AppModalDescriptionProps) {
  const storeDesc = useModalMirror('description');
  const content = children ?? storeDesc;

  if (!content) return null;

  return (
    <Text size="sm" fw={300} c="var(--app-text-secondary)" className={className} style={{ lineHeight: 1.5 }}>
      {content}
    </Text>
  );
}
