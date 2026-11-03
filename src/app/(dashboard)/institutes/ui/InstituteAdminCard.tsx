'use client';

import { Avatar, Card, Group, Paper, Stack, Text } from '@mantine/core';
import { StatusBadge } from '@/src/components/controllers';
import { IconUserCheck } from '@tabler/icons-react';
import { institutesLabels } from '../static-data/institutes.data';
import { useInstitutesMirror } from '../store/useInstitutesMirror';

/**
 * InstituteAdminCard
 *
 * Responsible administrator of the selected institute.
 * Pure presentation — reads selectedInstitute from useInstitutesMirror.
 */
export function InstituteAdminCard() {
  const selectedInstitute = useInstitutesMirror('selectedInstitute');
  if (!selectedInstitute) return null;
  const adminUser = selectedInstitute.instituteAdmins?.[0]?.user;

  return (
    <>
      {/* Responsible Administrator Card */}
      <Stack gap="xs">
        <Text fw={500} size="sm" c="dimmed">
          المدير المسؤول عن المعهد:
        </Text>
  
        {adminUser ? (
          <Card radius="lg" withBorder p="md" bg="var(--mantine-color-gray-0)">
            <Group justify="space-between" align="center">
              <Group gap="md">
                <Avatar color="teal" size="md" radius="xl">
                  <IconUserCheck size={20} />
                </Avatar>
                <Stack gap={2}>
                  <Text size="sm" fw={500}>
                    {adminUser.fullName}
                  </Text>
                  <Group gap="xs">
                    <Text size="xs" c="dimmed" dir="ltr">
                      {adminUser.phone}
                    </Text>
                    <StatusBadge tone="success" size="xs">
                      مدير المعهد
                    </StatusBadge>
                  </Group>
                </Stack>
              </Group>
            </Group>
          </Card>
        ) : (
          <Paper p="md" radius="lg" withBorder>
            <Text size="sm" c="dimmed">
              {institutesLabels.noAdminAssigned}
            </Text>
          </Paper>
        )}
      </Stack>
    </>
  );
}
