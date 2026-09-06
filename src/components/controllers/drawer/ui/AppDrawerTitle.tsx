'use client';

import { Title } from '@mantine/core';
import { ReactNode } from 'react';
import { useDrawerMirror } from '../store/useDrawerMirror';

export interface AppDrawerTitleProps {
  children?: ReactNode;
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

export function AppDrawerTitle({
  children,
  order = 3,
  size = 'h4',
  className,
}: AppDrawerTitleProps) {
  const storeTitle = useDrawerMirror('title');
  const content = children ?? storeTitle;

  if (!content) return null;

  return (
    <Title
      order={order}
      size={size}
      fw={700}
      className={className}
      style={{ letterSpacing: '-0.2px', margin: 0, lineHeight: 1.3 }}
    >
      {content}
    </Title>
  );
}
