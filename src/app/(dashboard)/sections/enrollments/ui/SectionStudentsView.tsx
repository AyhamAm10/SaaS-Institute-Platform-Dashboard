'use client';

import { Center, Group, Loader, Stack } from '@mantine/core';
import { IconUserPlus, IconUsers } from '@tabler/icons-react';
import {
  AppButton,
  AppDrawer,
  AppEmptyState,
  AppSelect,
  StatusBadge,
} from '@/src/components/controllers';
import { useSectionStudentsMirror } from '../store/useSectionStudentsMirror';
import { RosterStatusFilter } from '../state/section-students.state';
import { filterRoster } from '../utils/section-students.utils';
import {
  ENROLLMENT_STATUS_FILTERS,
  sectionStudentsLabels as labels,
} from '../static-data/section-students.data';
import { SectionStudentRow } from './SectionStudentRow';
import { AddStudentsModal } from './AddStudentsModal';
import { EnrollmentActionModal } from './EnrollmentActionModal';

export interface SectionStudentsViewProps {
  onEnroll: () => Promise<void>;
  onSubmitAction: () => Promise<void>;
  canManage?: boolean;
}

/**
 * SectionStudentsView
 *
 * Section roster with a status filter, the add-students modal and the
 * per-student action modal. ZERO useState hooks.
 */
export function SectionStudentsView({ onEnroll, onSubmitAction, canManage = true }: SectionStudentsViewProps) {
  const roster = useSectionStudentsMirror('roster');
  const isLoading = useSectionStudentsMirror('isLoading');
  const statusFilter = useSectionStudentsMirror('statusFilter');
  const setStatusFilter = useSectionStudentsMirror('setStatusFilter');
  const openAdd = useSectionStudentsMirror('openAdd');
  const openAction = useSectionStudentsMirror('openAction');

  const visible = filterRoster(roster, statusFilter);
  const activeCount = roster.filter((r) => r.status === 'ACTIVE').length;

  return (
    <AppDrawer.Section
      title={labels.title}
      description={labels.description}
      action={<StatusBadge size="xs">{activeCount}</StatusBadge>}
    >
      <Stack gap="sm">
        <Group justify="space-between" wrap="wrap" gap="xs">
          <AppSelect
            data={ENROLLMENT_STATUS_FILTERS}
            value={statusFilter}
            onChange={(val: string | null) => setStatusFilter((val ?? 'ALL') as RosterStatusFilter)}
            size="sm"
            w={160}
          />
          {canManage && (
            <AppButton size="sm" leftSection={<IconUserPlus size={16} />} onClick={openAdd}>
              {labels.addStudents}
            </AppButton>
          )}
        </Group>

        {isLoading ? (
          <Center py="lg">
            <Loader size="sm" color="primary" />
          </Center>
        ) : visible.length === 0 ? (
          <AppEmptyState
            compact
            icon={<IconUsers size={22} stroke={1.5} />}
            title={roster.length === 0 ? labels.emptyTitle : labels.emptyFiltered}
            description={roster.length === 0 ? labels.emptyDescription : undefined}
          />
        ) : (
          <Stack gap="xs">
            {visible.map((item) => (
              <SectionStudentRow key={item.enrollmentId} item={item} onAction={openAction} canManage={canManage} />
            ))}
          </Stack>
        )}
      </Stack>

      {canManage && (
        <>
          <AddStudentsModal onEnroll={onEnroll} />
          <EnrollmentActionModal onSubmit={onSubmitAction} />
        </>
      )}
    </AppDrawer.Section>
  );
}
