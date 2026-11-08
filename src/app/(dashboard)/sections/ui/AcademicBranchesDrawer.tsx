'use client';

import { Alert, Divider, Stack } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconGitBranch } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers';
import { AcademicBranch } from '@/src/core/api';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { sectionFormLabels } from '../static-data/sections.data';
import { AcademicBranchForm } from './AcademicBranchForm';
import { AcademicBranchList } from './AcademicBranchList';

export interface AcademicBranchesDrawerProps {
  opened: boolean;
  onClose: () => void;
  branches: AcademicBranch[];
  onCreate: () => Promise<void>;
  onDelete: (id: number, name: string) => Promise<void>;
}

/**
 * AcademicBranchesDrawer
 *
 * Pure presentation layer component adhering strictly to role.md.
 * ZERO internal useState hooks.
 * Reads form state, loading flags, errors, and actions exclusively from useSectionsMirror.
 */
export function AcademicBranchesDrawer({
  opened,
  onClose,
  branches = [],
  onCreate,
  onDelete,
}: AcademicBranchesDrawerProps) {
  const setBranchError = useSectionsMirror('setBranchError');
  const branchError = useSectionsMirror('branchError');
  const branchSuccess = useSectionsMirror('branchSuccess');
  const setBranchSuccess = useSectionsMirror('setBranchSuccess');

  return (
    <AppDrawer opened={opened} onClose={onClose} size="lg">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconGitBranch size={20} />} color="teal" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>{sectionFormLabels.branchesManagement}</AppDrawer.Title>
          <AppDrawer.Description>
            عرض وإدارة الفروع والمسارات الأكاديمية الخاصة بالمعهد (مثل العلمي، الأدبي، المهني)
          </AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <Stack gap="lg">
          {branchError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              radius="md"
              withCloseButton
              onClose={() => setBranchError(null)}
            >
              {branchError}
            </Alert>
          )}

          {branchSuccess && (
            <Alert
              icon={<IconCheck size={16} />}
              color="teal"
              variant="light"
              radius="md"
              withCloseButton
              onClose={() => setBranchSuccess(null)}
            >
              {branchSuccess}
            </Alert>
          )}

          <AcademicBranchForm onCreate={onCreate} />
          <Divider />

          <AcademicBranchList branches={branches} onDelete={onDelete} />
        </Stack>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel onClick={onClose}>إغلاق</AppDrawer.Cancel>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
