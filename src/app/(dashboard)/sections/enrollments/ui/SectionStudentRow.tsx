'use client';

import { Group, Menu, Stack, Text } from '@mantine/core';
import {
  IconArrowsExchange,
  IconBook,
  IconCircleCheck,
  IconDotsVertical,
  IconPlayerPlay,
  IconUser,
  IconUserMinus,
} from '@tabler/icons-react';
import { AppIconButton, AppSurface, IconTile, StatusBadge } from '@/src/components/controllers';
import type { SectionRosterItem } from '@/src/core/api';
import { STATUS_TONES } from '@/src/app/(dashboard)/settings/reference-data/static-data/reference-data.data';
import type { EnrollmentActionType } from '../state/section-students.state';
import { availableActions } from '../utils/section-students.utils';
import {
  ENROLLMENT_STATUS_META,
  sectionStudentsLabels as labels,
} from '../static-data/section-students.data';

const ACTION_META: Record<EnrollmentActionType, { label: string; icon: React.ReactNode; danger?: boolean }> = {
  transfer: { label: labels.actionTransfer, icon: <IconArrowsExchange size={15} /> },
  subjects: { label: labels.actionSubjects, icon: <IconBook size={15} /> },
  complete: { label: labels.actionComplete, icon: <IconCircleCheck size={15} /> },
  withdraw: { label: labels.actionWithdraw, icon: <IconUserMinus size={15} />, danger: true },
  reactivate: { label: labels.actionReactivate, icon: <IconPlayerPlay size={15} /> },
};

export interface SectionStudentRowProps {
  item: SectionRosterItem;
  onAction: (type: EnrollmentActionType, item: SectionRosterItem) => void;
  canManage?: boolean;
}

/** One roster row: student, enrollment status, subjects and actions. Props only. */
export function SectionStudentRow({ item, onAction, canManage = true }: SectionStudentRowProps) {
  const status = ENROLLMENT_STATUS_META[item.status];
  const actions = availableActions(item);
  const studentStatus = item.student.status;

  return (
    <AppSurface level={2} radius="md" padding="sm">
      <Group justify="space-between" wrap="nowrap" gap="sm" align="flex-start">
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }} align="flex-start">
          <IconTile tone={item.status === 'ACTIVE' ? 'brand' : 'neutral'} size={38}>
            <IconUser size={18} />
          </IconTile>
          <Stack gap={4} style={{ minWidth: 0 }}>
            <Group gap={6} wrap="wrap">
              <Text size="sm" fw={500} truncate>
                {item.student.fullName}
              </Text>
              <StatusBadge tone={status.tone} variant="dot" size="xs">
                {status.label}
              </StatusBadge>
              {studentStatus && (
                <StatusBadge tone={STATUS_TONES[studentStatus.tone].badge} size="xs">
                  {studentStatus.name}
                </StatusBadge>
              )}
            </Group>
            {item.student.familyName && (
              <Text size="xs" c="var(--app-text-muted)" truncate>
                {item.student.familyName}
                {item.student.phone ? ` · ${item.student.phone}` : ''}
              </Text>
            )}
            {item.statusReason && (
              <Text size="xs" c="var(--app-text-muted)">
                {labels.reasonLabel}: {item.statusReason}
              </Text>
            )}
            <Group gap={4} wrap="wrap">
              {item.takesAllSubjects ? (
                <StatusBadge tone="ink" size="xs">
                  {labels.allSubjects}
                </StatusBadge>
              ) : (
                item.subjects.map((subject) => (
                  <StatusBadge key={subject.id} tone="info" size="xs">
                    {subject.name}
                  </StatusBadge>
                ))
              )}
            </Group>
          </Stack>
        </Group>

        {canManage && actions.length > 0 && (
          <Menu position="bottom-end" withinPortal shadow="md">
            <Menu.Target>
              <AppIconButton size="sm" label={labels.actionsMenu}>
                <IconDotsVertical size={15} />
              </AppIconButton>
            </Menu.Target>
            <Menu.Dropdown>
              {actions.map((type) => (
                <Menu.Item
                  key={type}
                  leftSection={ACTION_META[type].icon}
                  color={ACTION_META[type].danger ? 'red' : undefined}
                  onClick={() => onAction(type, item)}
                >
                  {ACTION_META[type].label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </AppSurface>
  );
}
