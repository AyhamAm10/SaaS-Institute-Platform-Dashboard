'use client';

import { Group, Text, UnstyledButton, rem } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { ReactNode } from 'react';
import Link from 'next/link';

export interface StatCardActionProps {
  children?: ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
}

export function StatCardAction({
  children,
  onClick,
  href,
  icon,
}: StatCardActionProps) {
  if (!children) return null;

  const content = (
    <Group justify="space-between" align="center" w="100%">
      <Text size="xs" fw={600} style={{ fontSize: rem(12), color: 'inherit' }}>
        {children}
      </Text>
      {icon ?? <IconArrowLeft size={14} style={{ color: 'inherit' }} />}
    </Group>
  );

  const style = {
    marginTop: 'auto',
    width: '100%',
    padding: `${rem(6)} ${rem(14)}`,
    borderRadius: rem(10),
    border: '1px solid var(--app-border)',
    backgroundColor: 'transparent',
    color: 'var(--app-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 160ms ease',
  };

  if (href) {
    return (
      <UnstyledButton
        component={Link}
        href={href}
        style={style}
        className="stat-card-action-btn"
      >
        {content}
      </UnstyledButton>
    );
  }

  return (
    <UnstyledButton
      onClick={onClick}
      style={style}
      className="stat-card-action-btn"
    >
      {content}
    </UnstyledButton>
  );
}
