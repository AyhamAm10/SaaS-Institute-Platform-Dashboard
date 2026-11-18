'use client';

import { Center, Loader, Text } from '@mantine/core';
import { IconCalendarCheck, IconCash, IconClipboardList, IconInfoCircle, IconMessage, IconUser } from '@tabler/icons-react';
import { AppButton, ReportMenu, StatusBadge } from '@/src/components/controllers';
import { DetailPage, type DetailPageTab } from '@/src/components/controllers/detail-page';
import type { Student } from '@/src/core/api';
import { STATUS_TONES } from '../../../settings/reference-data/static-data/reference-data.data';
import { StudentFinanceController } from '../../finance/StudentFinanceController';
import { financeStudentFrom } from '../../finance/utils/student-finance.utils';
import { StudentQuickActionsController } from '../StudentQuickActionsController';
import { StudentAttendanceController } from '../StudentAttendanceController';
import { StudentNotesController } from '../StudentNotesController';
import { StudentResultsController } from '../StudentResultsController';
import { profileLabels as labels } from '../static-data/student-profile.data';
import { StudentOverviewTab } from './StudentOverviewTab';

export type ProfileTab = 'finance' | 'attendance' | 'results' | 'notes';

const icon = { size: 16, stroke: 1.6 };

interface StudentProfileViewProps {
  student: Student | null;
  isLoading: boolean;
  /** Tabs the user may open (role.md §8.6), in display order. */
  tabs: ProfileTab[];
}

/** Student page: DetailPage with the overview and the permitted tabs. Props only. */
export function StudentProfileView({ student, isLoading, tabs }: StudentProfileViewProps) {
  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  }
  if (!student) {
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.notFound}
      </Text>
    );
  }

  const all: Record<ProfileTab, DetailPageTab> = {
    finance: {
      value: 'finance',
      label: labels.tabFinance,
      icon: <IconCash {...icon} />,
      content: <StudentFinanceController embedded student={financeStudentFrom(student)} />,
    },
    attendance: {
      value: 'attendance',
      label: labels.tabAttendance,
      icon: <IconCalendarCheck {...icon} />,
      content: <StudentAttendanceController studentId={student.id} />,
    },
    notes: {
      value: 'notes',
      label: labels.tabNotes,
      icon: <IconMessage {...icon} />,
      content: <StudentNotesController studentId={student.id} />,
    },
    results: {
      value: 'results',
      label: labels.tabResults,
      icon: <IconClipboardList {...icon} />,
      content: <StudentResultsController studentId={student.id} />,
    },
  };
  const items: DetailPageTab[] = [
    {
      value: 'overview',
      label: labels.tabOverview,
      icon: <IconInfoCircle {...icon} />,
      content: <StudentOverviewTab student={student} />,
    },
    ...tabs.map((t) => all[t]),
  ];

  return (
    <DetailPage
      icon={<IconUser size={22} />}
      title={student.fullName}
      description={[student.family?.familyName && `${labels.family}: ${student.family.familyName}`, student.branch?.name]
        .filter(Boolean)
        .join(' · ')}
      badge={
        student.status && (
          <StatusBadge tone={STATUS_TONES[student.status.tone].badge} size="sm">
            {student.status.name}
          </StatusBadge>
        )
      }
      breadcrumbs={[{ label: labels.back, href: '/students' }, { label: student.fullName }]}
      actions={
        <>
          <StudentQuickActionsController studentId={student.id} />
          <ReportMenu
            keys={['student-monthly', 'student-statement', 'student-transcript', 'student-attendance', 'student-card']}
            params={{ studentId: student.id }}
          />
          <AppButton variant="outline" href="/students">
            {labels.back}
          </AppButton>
        </>
      }
      tabs={items}
    />
  );
}
