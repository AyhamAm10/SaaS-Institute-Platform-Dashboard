'use client';

import { Center, Loader, Text } from '@mantine/core';
import {
  IconBook,
  IconCalendarCheck,
  IconCalendarWeek,
  IconCash,
  IconClipboardList,
  IconInfoCircle,
  IconUsers,
} from '@tabler/icons-react';
import { AppButton, ReportMenu } from '@/src/components/controllers';
import { DetailPage, type DetailPageTab } from '@/src/components/controllers/detail-page';
import { useSectionDetailsQuery } from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { ExamsController } from '../../exams/ExamsController';
import { SectionStudentsController } from '../enrollments';
import {
  SectionAttendanceController,
  SectionFinanceController,
  SectionTimetableController,
} from './SectionTabControllers';
import { SectionSubjectsController } from './SectionSubjectsController';
import { sectionDetailLabels as labels } from './static-data/section-detail.data';
import { SectionOverviewTab } from './ui/SectionOverviewTab';
import { SectionSummary } from './ui/SectionSummary';

const size = 16;

/**
 * SectionDetailController
 *
 * Section page: summary strip and the tabs the role may open. Quick actions
 * live inside the tabs through the same controllers as their own pages
 * (students roster, exams with the section preset).
 */
export function SectionDetailController({ sectionId }: { sectionId: number }) {
  const { data: section, isLoading } = useSectionDetailsQuery(sectionId);
  const { can } = useAuth();

  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (!section)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.notFound}
      </Text>
    );

  const tabs: DetailPageTab[] = [
    {
      value: 'overview',
      label: labels.tabOverview,
      icon: <IconInfoCircle size={size} stroke={1.6} />,
      content: <SectionOverviewTab section={section} />,
    },
  ];
  if (can(PERMISSIONS.studentsView))
    tabs.push({
      value: 'students',
      label: labels.tabStudents,
      icon: <IconUsers size={size} stroke={1.6} />,
      count: section._count.studentEnrollments,
      content: (
        <SectionStudentsController
          section={{ id: section.id, academicYearId: section.academicYearId, branchId: section.branchId }}
        />
      ),
    });
  if (can(PERMISSIONS.academicView))
    tabs.push(
      {
        value: 'subjects',
        label: labels.tabSubjects,
        icon: <IconBook size={size} stroke={1.6} />,
        count: section._count.sectionSubjects,
        content: <SectionSubjectsController sectionId={section.id} academicBranchId={section.academicBranchId} />,
      },
      {
        value: 'timetable',
        label: labels.tabTimetable,
        icon: <IconCalendarWeek size={size} stroke={1.6} />,
        content: <SectionTimetableController sectionId={section.id} yearId={section.academicYearId} />,
      },
    );
  if (can(PERMISSIONS.attendanceView))
    tabs.push({
      value: 'attendance',
      label: labels.tabAttendance,
      icon: <IconCalendarCheck size={size} stroke={1.6} />,
      content: <SectionAttendanceController sectionId={section.id} />,
    });
  if (can(PERMISSIONS.examsView))
    tabs.push({
      value: 'exams',
      label: labels.tabExams,
      icon: <IconClipboardList size={size} stroke={1.6} />,
      content: <ExamsController sectionId={section.id} />,
    });
  if (can(PERMISSIONS.feesView))
    tabs.push({
      value: 'finance',
      label: labels.tabFinance,
      icon: <IconCash size={size} stroke={1.6} />,
      content: <SectionFinanceController sectionId={section.id} />,
    });

  return (
    <DetailPage
      icon={<IconUsers size={22} />}
      title={section.name}
      description={[section.branch?.name, section.academicYear?.name, section.academicBranch?.name]
        .filter(Boolean)
        .join(' · ')}
      breadcrumbs={[{ label: labels.list, href: '/sections' }, { label: section.name }]}
      actions={
        <>
          <ReportMenu
            keys={['section-roster', 'section-attendance', 'section-results', 'section-finance']}
            params={{ sectionId: section.id }}
          />
          {can(PERMISSIONS.attendanceManage) && (
            <AppButton variant="outline" href="/attendance">
              {labels.openAttendance}
            </AppButton>
          )}
        </>
      }
      summary={<SectionSummary section={section} />}
      tabs={tabs}
    />
  );
}
