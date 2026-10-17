'use client';

import { Badge, Group, Stack, Text, Title, rem } from '@mantine/core';
import { useDataModuleMirror } from '../store/useDataModuleMirror';

export interface DataModuleTitleProps {
  title?: string;
  description?: string;
  showBadge?: boolean;
}

export function DataModuleTitle(props: DataModuleTitleProps) {
  const storeTitle = useDataModuleMirror('title');
  const storeDescription = useDataModuleMirror('description');
  const total = useDataModuleMirror('total');

  const title = props.title ?? storeTitle;
  const description = props.description ?? storeDescription;
  const showBadge = props.showBadge ?? true;

  return (
    <Stack gap={4}>
      <Group gap="sm" align="center">
        <Title order={2} fz={{ base: 20, sm: 24 }} fw={800} style={{ letterSpacing: '-0.4px' }}>
          {title}
        </Title>
        {showBadge && total !== undefined && (
          <Badge
            variant="light"
            color="primary"
            radius="xl"
            size="md"
            fw={700}
            style={{
              paddingLeft: rem(12),
              paddingRight: rem(12),
              height: rem(26),
            }}
          >
            {total}
          </Badge>
        )}
      </Group>
      {description && (
        <Text size="sm" c="dimmed" fw={400} style={{ lineHeight: 1.5 }}>
          {description}
        </Text>
      )}
    </Stack>
  );
}
