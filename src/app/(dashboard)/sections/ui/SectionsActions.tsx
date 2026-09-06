'use client';

import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useSectionsMirror } from '../store/useSectionsMirror';

/**
 * SectionsActions
 *
 * Header action buttons for the Sections page.
 * Pure presentation — reads actions from the mirror.
 */
export function SectionsActions() {
  const openCreate = useSectionsMirror('openCreate');

  return (
    <Button
      color="primary"
      radius="xl"
      leftSection={<IconPlus size={16} />}
      onClick={openCreate}
    >
      إضافة شُعبة جديدة
    </Button>
  );
}
