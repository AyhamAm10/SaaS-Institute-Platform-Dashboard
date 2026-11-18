'use client';

import { useMemo } from 'react';
import { Box, Stack } from '@mantine/core';
import { AppPageHeader } from '@/src/components/controllers/page-header';
import { AppTabs } from '@/src/components/controllers/tabs';
import { SETTINGS_TABS } from '../static-data/settings-tabs.data';
import { useSettingsMirror } from '../store/useSettingsMirror';
import { InstituteTabController } from '../tabs/institute';
import { ScheduleSettingsController } from '../../schedule-settings/ScheduleSettingsController';
import { AccountsController } from '../accounts';
import { AuditController } from '../audit/AuditController';
import { ClosuresController } from '../closures/ClosuresController';
import { StudentFieldsController } from '../student-fields/StudentFieldsController';
import { ReferenceDataController } from '../reference-data/ReferenceDataController';

interface SettingsViewProps {
  onTabChange: (value: string | null) => void;
}

export function SettingsView({ onTabChange }: SettingsViewProps) {
  const activeTab = useSettingsMirror('activeTab');
  const permittedTabs = useSettingsMirror('permittedTabs');

  const tabItems = useMemo(() => {
    return SETTINGS_TABS.filter((t) => permittedTabs.includes(t.key)).map((t) => {
      const Icon = t.icon;
      return {
        value: t.key,
        label: t.label,
        icon: <Icon size={16} stroke={1.6} />,
      };
    });
  }, [permittedTabs]);

  return (
    <Stack gap="lg">
      <AppPageHeader
        title="الإعدادات"
        description="إدارة إعدادات المعهد، الحسابات، والجداول المرجعية"
      />

      <AppTabs value={activeTab} onChange={onTabChange} items={tabItems}>
        <Box>
          <AppTabs.List />
        </Box>

        {permittedTabs.includes('institute') && (
          <AppTabs.Panel value="institute" keepMounted>
            <InstituteTabController />
          </AppTabs.Panel>
        )}

        {permittedTabs.includes('schedule') && (
          <AppTabs.Panel value="schedule" keepMounted>
            <ScheduleSettingsController hideHeader />
          </AppTabs.Panel>
        )}

        {permittedTabs.includes('closures') && (
          <AppTabs.Panel value="closures" keepMounted>
            <ClosuresController hideHeader />
          </AppTabs.Panel>
        )}

        {permittedTabs.includes('accounts') && (
          <AppTabs.Panel value="accounts" keepMounted>
            <AccountsController />
          </AppTabs.Panel>
        )}

        {permittedTabs.includes('audit') && (
          <AppTabs.Panel value="audit">
            <AuditController />
          </AppTabs.Panel>
        )}

        {permittedTabs.includes('student-fields') && (
          <AppTabs.Panel value="student-fields" keepMounted>
            <StudentFieldsController hideHeader />
          </AppTabs.Panel>
        )}

        {permittedTabs.includes('reference-data') && (
          <AppTabs.Panel value="reference-data" keepMounted>
            <ReferenceDataController hideHeader />
          </AppTabs.Panel>
        )}
      </AppTabs>
    </Stack>
  );
}
