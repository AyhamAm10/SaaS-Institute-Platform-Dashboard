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
    <Text size="xs" c="dimmed" className={className} style={{ lineHeight: 1.4 }}>
      {content}
    </Text>
  );
}
