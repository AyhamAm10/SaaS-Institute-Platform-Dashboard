'use client';

import { Box, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconDatabaseOff } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useDataModuleMirror } from '../store/useDataModuleMirror';

export interface DataModuleEmptyProps {
  message?: string;
  description?: string;
  icon?: ReactNode;
}

export function DataModuleEmpty(props: DataModuleEmptyProps) {
  const storeMessage = useDataModuleMirror('emptyMessage');
  const storeDesc = useDataModuleMirror('emptyDescription');

  const message = props.message ?? storeMessage;
  const description = props.description ?? storeDesc;

  return (
    <Box py={50} px="md">
      <Stack align="center" justify="center" gap="xs">
        <ThemeIcon size={56} radius="xl" variant="light" color="gray">
          {props.icon ?? <IconDatabaseOff size={28} stroke={1.5} />}
        </ThemeIcon>
        <Text fw={600} size="md" c="var(--mantine-color-text)">
          {message}
        </Text>
        {description && (
          <Text size="sm" c="dimmed" ta="center" maw={360}>
            {description}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
