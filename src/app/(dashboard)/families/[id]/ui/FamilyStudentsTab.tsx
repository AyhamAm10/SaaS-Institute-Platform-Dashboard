import Link from 'next/link';
import { Table, Text } from '@mantine/core';
import { AppSurface } from '@/src/components/controllers';
import type { FamilyDetails } from '@/src/core/api';
import { formatDate } from '@/src/core/format';
import { familyDetailLabels as labels } from '../static-data/family-detail.data';

/** The children of the family, each linking to the student page. Props only. */
export function FamilyStudentsTab({ family }: { family: FamilyDetails }) {
  if (family.students.length === 0)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.noStudents}
      </Text>
    );
  return (
    <AppSurface level={1} radius="lg" padding="sm">
      <Table verticalSpacing="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{labels.student}</Table.Th>
            <Table.Th>{labels.gender}</Table.Th>
            <Table.Th>{labels.birthDate}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {family.students.map((s) => (
            <Table.Tr key={s.id}>
              <Table.Td>
                <Text component={Link} href={`/students/${s.id}`} size="sm" fw={500} c="inherit">
                  {s.fullName}
                </Text>
              </Table.Td>
              <Table.Td>{s.gender === 'MALE' ? labels.male : labels.female}</Table.Td>
              <Table.Td>{s.birthDate ? formatDate(s.birthDate.slice(0, 10)) : '—'}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </AppSurface>
  );
}
