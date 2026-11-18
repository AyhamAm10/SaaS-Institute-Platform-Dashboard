'use client';

import { Center, Loader, Text } from '@mantine/core';
import { IconCalendarTime, IconCertificate, IconInfoCircle, IconSchool, IconUserStar } from '@tabler/icons-react';
import { AppButton, StatusBadge } from '@/src/components/controllers';
import { DetailPage, type DetailPageTab } from '@/src/components/controllers/detail-page';
import { useTeacherDetailsQuery, useTeacherSectionsQuery } from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { teacherDetailLabels as labels } from './static-data/teacher-detail.data';
import {
  TeacherAvailabilityTab,
  TeacherOverviewTab,
  TeacherQualificationsTab,
  TeacherSectionsTab,
} from './ui/TeacherTabs';

const icon = { size: 16, stroke: 1.6 };

/** Sections tab: its own query, loaded only when opened. */
function TeacherSectionsController({ teacherId }: { teacherId: number }) {
  const { data, isLoading } = useTeacherSectionsQuery(teacherId);
  return <TeacherSectionsTab rows={data ?? []} isLoading={isLoading} />;
}

/**
 * TeacherDetailController
 *
 * Teacher page: identity, the sections and subjects taught (each a link to
 * its section page), qualifications and availability.
 */
export function TeacherDetailController({ teacherId }: { teacherId: number }) {
  const { data: teacher, isLoading } = useTeacherDetailsQuery(teacherId);
  const { can } = useAuth();

  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (!teacher)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.notFound}
      </Text>
    );

  const tabs: DetailPageTab[] = [
    {
      value: 'overview',
      label: labels.tabOverview,
      icon: <IconInfoCircle {...icon} />,
      content: <TeacherOverviewTab teacher={teacher} />,
    },
    {
      value: 'sections',
      label: labels.tabSections,
      icon: <IconSchool {...icon} />,
      content: <TeacherSectionsController teacherId={teacher.id} />,
    },
    {
      value: 'qualifications',
      label: labels.tabQualifications,
      icon: <IconCertificate {...icon} />,
      count: teacher.assignments?.length ?? 0,
      content: <TeacherQualificationsTab teacher={teacher} />,
    },
    {
      value: 'availability',
      label: labels.tabAvailability,
      icon: <IconCalendarTime {...icon} />,
      content: <TeacherAvailabilityTab teacher={teacher} />,
    },
  ];

  return (
    <DetailPage
      icon={<IconUserStar size={22} />}
      title={teacher.user.fullName}
      description={[teacher.specialization, teacher.user.phone].filter(Boolean).join(' · ')}
      badge={
        <StatusBadge tone={teacher.isActive ? 'success' : 'danger'} size="sm">
          {teacher.isActive ? labels.active : labels.inactive}
        </StatusBadge>
      }
      breadcrumbs={[{ label: labels.list, href: '/teachers' }, { label: teacher.user.fullName }]}
      actions={
        can(PERMISSIONS.staffManage) && (
          <AppButton variant="outline" href="/settings?tab=accounts">
            {labels.manageAccount}
          </AppButton>
        )
      }
      tabs={tabs}
    />
  );
}
