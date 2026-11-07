'use client';

import { Group } from '@mantine/core';
import { IconEdit, IconEye } from '@tabler/icons-react';
import { Institute } from '@/src/core/api';
import { AppIconButton } from '@/src/components/controllers/button';
import { institutesLabels } from '../static-data/institutes.data';

interface InstituteActionsCellProps {
  institute: Institute;
  onDetails: (institute: Institute) => void;
  onEdit: (institute: Institute) => void;
}

export function InstituteActionsCell({
  institute,
  onDetails,
  onEdit,
}: InstituteActionsCellProps) {
  return (
    <Group gap="xs" justify="center" wrap="nowrap">
      <AppIconButton
        variant="ghost"
        size="sm"
        label={institutesLabels.detailsButton}
        onClick={() => onDetails(institute)}
      >
        <IconEye size={15} />
      </AppIconButton>
      <AppIconButton
        variant="ghost"
        size="sm"
        label={institutesLabels.editButton}
        onClick={() => onEdit(institute)}
      >
        <IconEdit size={15} />
      </AppIconButton>
    </Group>
  );
}

