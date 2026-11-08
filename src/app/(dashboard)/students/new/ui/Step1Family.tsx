'use client';

import { Alert, Group, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconSearch, IconUserPlus } from '@tabler/icons-react';
import { AppTabs } from '@/src/components/controllers';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';
import { Family } from '@/src/core/api';
import { Step1FamilySearch } from './Step1FamilySearch';
import { Step1NewFamily } from './Step1NewFamily';

export interface Step1FamilyProps {
  families: Family[];
  isLoadingFamilies?: boolean;
}

export function Step1Family({ families, isLoadingFamilies }: Step1FamilyProps) {
  const familyMode = useStudentRegistrationMirror('familyMode');
  const setFamilyMode = useStudentRegistrationMirror('setFamilyMode');
  const stepErrors = useStudentRegistrationMirror('stepErrors');

  const error = stepErrors[0];

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Stack gap={4}>
          <Text size="md" fw={500}>
            تحديد عائلة الطالب
          </Text>
          <Text size="xs" fw={300} c="var(--app-text-muted)">
            اربط الطالب بعائلة موجودة مسبقا أو سجل عائلة جديدة
          </Text>
        </Stack>

        <AppTabs
          value={familyMode}
          onChange={(val) => setFamilyMode(val as 'search' | 'create')}
          items={[
            {
              value: 'search',
              label: 'عائلة مسجلة',
              icon: <IconSearch size={15} stroke={1.7} />,
              count: families.length,
            },
            { value: 'create', label: 'عائلة جديدة', icon: <IconUserPlus size={15} stroke={1.7} /> },
          ]}
        >
          <AppTabs.List />
        </AppTabs>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="danger" radius="lg" variant="light">
          {error}
        </Alert>
      )}

      {familyMode === 'search' ? (
        <Step1FamilySearch families={families} isLoadingFamilies={isLoadingFamilies} />
      ) : (
        <Step1NewFamily />
      )}
    </Stack>
  );
}
