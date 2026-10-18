'use client';

import { Badge, Group, Stack, Text, ThemeIcon, Title, rem } from '@mantine/core';
import { ReactNode } from 'react';
import { useDataModuleMirror } from '../store/useDataModuleMirror';

export interface DataModuleTitleProps {
  title?: string;
  description?: string;
  showBadge?: boolean;
  badgeLabel?: string;
  icon?: ReactNode;
}

export function DataModuleTitle(props: DataModuleTitleProps) {
  const storeTitle = useDataModuleMirror('title');
  const storeDescription = useDataModuleMirror('description');
  const total = useDataModuleMirror('total');

  const title = props.title ?? storeTitle;
  const description = props.description ?? storeDescription;
  const showBadge = props.showBadge ?? true;

  return (
    <Stack gap={2}>
      <Group gap="xs" align="center">
        {props.icon && (
          <ThemeIcon size={28} radius="md" color="primary" variant="light">
            {props.icon}
          </ThemeIcon>
        )}
        <Title order={2} fz={{ base: 17, sm: 20 }} fw={700}>
          {title}
        </Title>
        {showBadge && total !== undefined && (
          <Badge
            variant="light"
            color="primary"
            radius="sm"
            size="sm"
            fw={600}
            style={{
              paddingLeft: rem(8),
              paddingRight: rem(8),
              height: rem(22),
              fontSize: rem(11.5),
            }}
          >
            {props.badgeLabel ? `${total} ${props.badgeLabel}` : total}
          </Badge>
        )}
      </Group>
      {description && (
        <Text size="xs" c="dimmed" fw={400} style={{ lineHeight: 1.4 }}>
          {description}
        </Text>
      )}
    </Stack>
  );
}
