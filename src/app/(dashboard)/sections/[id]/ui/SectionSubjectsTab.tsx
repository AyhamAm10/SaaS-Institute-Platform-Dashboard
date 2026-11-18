import type { ReactNode } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { Center, Loader, Table, Text } from '@mantine/core';
import { AppIconButton, AppSurface, StatusBadge } from '@/src/components/controllers';
import type { SectionSubjectItem } from '@/src/core/api';
import { formatNumber } from '@/src/core/format';
import { sectionDetailLabels as labels } from '../static-data/section-detail.data';

interface Props {
  plan: SectionSubjectItem[];
  isLoading: boolean;
  /** Assign form, shown above the plan when the user may manage. */
  assignBar?: ReactNode;
  onRemove?: (subjectId: number) => void;
}

/** Weekly plan: subject, teacher and periods. Props only. */
export function SectionSubjectsTab({ plan, isLoading, assignBar, onRemove }: Props) {
  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  return (
    <>
      {assignBar}
      {plan.length === 0 ? (
        <Text ta="center" py="xl" c="var(--app-text-muted)">
          {labels.noSubjects}
        </Text>
      ) : (
    <AppSurface level={1} radius="lg" padding="sm">
      <Table verticalSpacing="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{labels.subject}</Table.Th>
            <Table.Th>{labels.teacher}</Table.Th>
            <Table.Th>{labels.periods}</Table.Th>
            {onRemove && <Table.Th />}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {plan.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.subject.name}</Table.Td>
              <Table.Td>
                {row.teacher?.user.fullName ?? <StatusBadge size="xs">{labels.noTeacher}</StatusBadge>}
              </Table.Td>
              <Table.Td>
                {formatNumber(row.weeklyPeriods)} {labels.weeklyPeriods}
              </Table.Td>
              {onRemove && (
                <Table.Td>
                  <AppIconButton size="sm" variant="danger" label={labels.removeSubject} onClick={() => onRemove(row.subjectId)}>
                    <IconTrash size={16} />
                  </AppIconButton>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </AppSurface>
      )}
    </>
  );
}
