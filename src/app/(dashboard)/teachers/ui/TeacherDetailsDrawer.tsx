'use client';

import { Box } from '@mantine/core';
import { IconBriefcase, IconCalendarTime, IconUser } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers/drawer';
import { AppTabs } from '@/src/components/controllers/tabs';
import { useTeachersMirror } from '../store/useTeachersMirror';
import { TeacherOverviewTab } from './TeacherOverviewTab';
import { TeacherQualificationsTab } from './TeacherQualificationsTab';
import { TeacherAvailabilityTab, TeacherAvailabilityTabProps } from './TeacherAvailabilityTab';

interface TeacherDetailsDrawerProps extends TeacherAvailabilityTabProps {
  onAssignQualification: (branchId: number, subjectId: number) => Promise<void>;
  onRemoveQualification: (assignmentId: number) => Promise<void>;
}

/** Teacher profile drawer: overview, qualifications and availability tabs. */
export function TeacherDetailsDrawer({
  onAssignQualification,
  onRemoveQualification,
  ...availability
}: TeacherDetailsDrawerProps) {
  const detailsDrawerOpened = useTeachersMirror('detailsDrawerOpened');
  const activeDetailsTab = useTeachersMirror('activeDetailsTab');
  const selectedTeacherDetails = useTeachersMirror('selectedTeacherDetails');
  const stagedAvailabilities = useTeachersMirror('stagedAvailabilities');
  const closeDetailsDrawer = useTeachersMirror('closeDetailsDrawer');
  const setActiveDetailsTab = useTeachersMirror('setActiveDetailsTab');

  if (!selectedTeacherDetails) return null;

  return (
    <AppDrawer
      opened={detailsDrawerOpened}
      onClose={closeDetailsDrawer}
      size="xl"
      icon={<IconUser size={20} />}
      title={`ملف المعلم: ${selectedTeacherDetails.user.fullName}`}
    >
      <AppTabs
        value={activeDetailsTab || 'overview'}
        onChange={(val) => setActiveDetailsTab(val || 'overview')}
        items={[
          { value: 'overview', label: 'نظرة عامة', icon: <IconUser size={16} stroke={1.6} /> },
          {
            value: 'qualifications',
            label: 'المواد المعتمدة',
            icon: <IconBriefcase size={16} stroke={1.6} />,
            count: selectedTeacherDetails.assignments?.length || 0,
          },
          {
            value: 'availability',
            label: 'أوقات الدوام',
            icon: <IconCalendarTime size={16} stroke={1.6} />,
            count: stagedAvailabilities.length,
          },
        ]}
      >
        <Box mb="md">
          <AppTabs.List />
        </Box>

        {/* ── Tab 1: Overview ── */}
        <AppTabs.Panel value="overview">
          <TeacherOverviewTab />
        </AppTabs.Panel>
        <AppTabs.Panel value="qualifications">
          <TeacherQualificationsTab
            onAssignQualification={onAssignQualification}
            onRemoveQualification={onRemoveQualification}
          />
        </AppTabs.Panel>
        <AppTabs.Panel value="availability">
          <TeacherAvailabilityTab {...availability} />
        </AppTabs.Panel>
      </AppTabs>
    </AppDrawer>
  );
}
