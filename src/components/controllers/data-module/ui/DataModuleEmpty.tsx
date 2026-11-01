'use client';

import { Box } from '@mantine/core';
import { IconDatabaseOff } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { AppEmptyState } from '../../empty-state';
import { useDataModuleMirror } from '../store/useDataModuleMirror';

export interface DataModuleEmptyProps {
  message?: string;
  description?: string;
  icon?: ReactNode;
}

export function DataModuleEmpty(props: DataModuleEmptyProps) {
  const storeMessage = useDataModuleMirror('emptyMessage');
  const storeDesc = useDataModuleMirror('emptyDescription');

  return (
    <Box py="xl">
      <AppEmptyState
        title={props.message ?? storeMessage}
        description={props.description ?? storeDesc}
        icon={props.icon ?? <IconDatabaseOff size={28} stroke={1.5} />}
      />
    </Box>
  );
}
