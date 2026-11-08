'use client';

import { Alert, Box, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconUserPlus } from '@tabler/icons-react';
import { AppDrawer, AppTabs } from '@/src/components/controllers';
import { generateSecurePassword } from '@/src/core/auth';
import { useMobileAccountsMirror } from '../store/useMobileAccountsMirror';
import { GuardianAccountForm } from './GuardianAccountForm';
import { StudentAccountForm } from './StudentAccountForm';

export interface MobileAccountDrawerProps {
  familiesData: { value: string; label: string }[];
  eligibleStudentsData: { value: string; label: string; suggestedPhone?: string | null }[];
  onSubmit: () => void;
}

export function MobileAccountDrawer({ familiesData, eligibleStudentsData, onSubmit }: MobileAccountDrawerProps) {
  const opened = useMobileAccountsMirror('drawerOpened');
  const drawerType = useMobileAccountsMirror('drawerType');
  const drawerError = useMobileAccountsMirror('drawerError');
  const isSubmitting = useMobileAccountsMirror('isSubmittingDrawer');
  const setDrawerType = useMobileAccountsMirror('setDrawerType');
  const setGuardianFormField = useMobileAccountsMirror('setGuardianFormField');
  const setStudentFormField = useMobileAccountsMirror('setStudentFormField');
  const close = useMobileAccountsMirror('closeDrawer');

  const isFamily = drawerType === 'FAMILY';

  const handleGeneratePassword = () => {
    const pwd = generateSecurePassword(10);
    if (isFamily) {
      setGuardianFormField('password', pwd);
    } else {
      setStudentFormField('password', pwd);
    }
  };

  return (
    <AppDrawer opened={opened} onClose={close} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconUserPlus size={22} />} color="primary" />
        <AppDrawer.Title>إنشاء حساب تطبيق جديد</AppDrawer.Title>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        <Stack gap="lg">
          {drawerError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {drawerError}
            </Alert>
          )}

          <Box>
            <Text size="xs" fw={500} mb={6} c="var(--app-text-secondary)">
              نوع الحساب
            </Text>
            <AppTabs
              value={drawerType}
              onChange={(val) => setDrawerType((val as 'FAMILY' | 'STUDENT') || 'FAMILY')}
              items={[
                { value: 'FAMILY', label: 'ولي أمر (عائلة)' },
                { value: 'STUDENT', label: 'طالب' },
              ]}
            >
              <AppTabs.List />
            </AppTabs>
          </Box>

          {isFamily ? (
            <GuardianAccountForm
              familiesData={familiesData}
              onGeneratePassword={handleGeneratePassword}
            />
          ) : (
            <StudentAccountForm
              eligibleStudentsData={eligibleStudentsData}
              onGeneratePassword={handleGeneratePassword}
            />
          )}
        </Stack>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>إلغاء</AppDrawer.Cancel>
          <AppDrawer.Submit onClick={onSubmit} loading={isSubmitting}>
            إنشاء الحساب
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
