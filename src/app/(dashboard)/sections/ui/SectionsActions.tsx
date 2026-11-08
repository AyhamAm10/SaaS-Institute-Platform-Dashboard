'use client';

import { Group } from '@mantine/core';
import { IconGitBranch, IconPlus } from '@tabler/icons-react';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { AppButton } from '@/src/components/controllers/button';

/**
 * SectionsActions
 *
 * Header action buttons for the Sections page.
 * Pure presentation — reads actions from the mirror.
 */
interface SectionsActionsProps {
  canManage?: boolean;
}

export function SectionsActions({ canManage = true }: SectionsActionsProps) {
  const openCreate = useSectionsMirror('openCreate');
  const openBranchesModal = useSectionsMirror('openBranchesModal');

  if (!canManage) return null;

  return (
    <Group gap="sm">
      <AppButton variant="outline" leftSection={<IconGitBranch size={16} />} onClick={openBranchesModal}>
        إدارة الفروع الأكاديمية
      </AppButton>

      <AppButton leftSection={<IconPlus size={16} />} onClick={openCreate}>
        إضافة شعبة جديدة
      </AppButton>
    </Group>
  );
}
