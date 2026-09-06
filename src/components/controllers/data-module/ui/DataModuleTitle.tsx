'use client';

import { Badge, Group, Stack, Text, Title } from '@mantine/core';
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
      <Group gap="xs" align="center">
        <Title order={2} size="h3" fw={700} style={{ letterSpacing: '-0.3px' }}>
          {title}
        </Title>
        {showBadge && total !== undefined && (
          <Badge
            variant="light"
            color="primary"
            radius="xl"
            size="md"
            fw={700}
          >
            {total}
          </Badge>
        )}
      </Group>
      {description && (
        <Text size="sm" c="dimmed" fw={400}>
          {description}
        </Text>
      )}
    </Stack>
  );
}
