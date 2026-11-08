'use client';

import { Stack } from '@mantine/core';
import { IconBook, IconInfoCircle, IconUsers } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers';
import { AppTabs } from '@/src/components/controllers/tabs';
import { sectionDetailsLabels as labels, sectionFormLabels } from '../static-data/sections.data';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { SectionSubjectsSummary } from './SectionSubjectsSummary';
import { SectionSubjectAssignForm } from './SectionSubjectAssignForm';
import { SectionSubjectsPlanList } from './SectionSubjectsPlanList';
import { SectionInfoTab } from './SectionInfoTab';
import { SectionStudentsController } from '../enrollments';

const TAB_HEADERS: Record<string, { icon: React.ReactNode; description: string }> = {
  subjects: { icon: <IconBook size={20} />, description: labels.subjectsDescription },
  students: { icon: <IconUsers size={20} />, description: labels.studentsDescription },
  info: { icon: <IconInfoCircle size={20} />, description: labels.infoDescription },
};

export interface SectionDetailsDrawerProps {
  opened: boolean;
  onClose: () => void;
  sectionId: number | null;
  onAssignSubject?: (
    sectionId: number,
    subjectId: number,
    weeklyPeriods?: number,
    teacherId?: number | null,
  ) => Promise<void>;
  onRemoveSubject?: (sectionId: number, subjectId: number) => Promise<void>;
  canManage?: boolean;
}

/**
 * SectionDetailsDrawer
 *
 * Section plan, enrolled students (own controller) and section info, in tabs.
 * Composition only — ZERO useState (role.md §12.1).
 */
export function SectionDetailsDrawer({
  opened,
  onClose,
  sectionId,
  onAssignSubject,
  onRemoveSubject,
  canManage = true,
}: SectionDetailsDrawerProps) {
  const details = useSectionsMirror('detailsData');
  const isLoading = useSectionsMirror('isLoadingDetails');
  const sectionSubjects = useSectionsMirror('sectionSubjectsData');
  const assignSubjectId = useSectionsMirror('assignSubjectId');
  const assignWeeklyPeriods = useSectionsMirror('assignWeeklyPeriods');
  const assignTeacherId = useSectionsMirror('assignTeacherId');
  const detailsActiveTab = useSectionsMirror('detailsActiveTab') || 'subjects';
  const setDetailsActiveTab = useSectionsMirror('setDetailsActiveTab');

  const isSubjectsTab = detailsActiveTab === 'subjects';
  const isStudentsTab = detailsActiveTab === 'students';
  const header = TAB_HEADERS[detailsActiveTab] ?? TAB_HEADERS.info;

  const handleAssign = async () => {
    if (!sectionId || !assignSubjectId || !onAssignSubject) return;
    await onAssignSubject(
      sectionId,
      Number(assignSubjectId),
      assignWeeklyPeriods || 2,
      assignTeacherId ? Number(assignTeacherId) : null,
    );
  };

  const handleRemove = onRemoveSubject
    ? async (subjectId: number) => {
        if (sectionId) await onRemoveSubject(sectionId, subjectId);
      }
    : undefined;

  return (
    <AppDrawer opened={opened} onClose={onClose} size="lg" loading={isLoading}>
      <AppDrawer.Header>
        <AppDrawer.Icon icon={header.icon} color="primary" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>{details?.name ?? sectionFormLabels.detailsTitle}</AppDrawer.Title>
          <AppDrawer.Description>{header.description}</AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        {details && (
          <Stack gap="lg">
            <AppTabs
              fullWidth
              value={detailsActiveTab}
              onChange={setDetailsActiveTab}
              items={[
                {
                  value: 'subjects',
                  label: labels.tabSubjects,
                  icon: <IconBook size={16} stroke={1.6} />,
                  count: sectionSubjects?.length ?? 0,
                },
                {
                  value: 'students',
                  label: labels.tabStudents,
                  icon: <IconUsers size={16} stroke={1.6} />,
                  count: details._count?.studentEnrollments ?? 0,
                },
                {
                  value: 'info',
                  label: labels.tabInfo,
                  icon: <IconInfoCircle size={16} stroke={1.6} />,
                },
              ]}
            >
              <AppTabs.List />
            </AppTabs>

            {isSubjectsTab ? (
              <Stack gap="md">
                <SectionSubjectsSummary />
                {canManage && onAssignSubject && <SectionSubjectAssignForm onAssign={handleAssign} />}
                <SectionSubjectsPlanList onRemove={canManage ? handleRemove : undefined} />
              </Stack>
            ) : isStudentsTab ? (
              <SectionStudentsController
                key={details.id}
                section={{
                  id: details.id,
                  academicYearId: details.academicYearId,
                  branchId: details.branchId,
                }}
              />
            ) : (
              <SectionInfoTab />
            )}
          </Stack>
        )}
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>{labels.close}</AppDrawer.Cancel>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
