'use client';

import { Center, Loader, Text } from '@mantine/core';
import { IconCash, IconHome, IconInfoCircle, IconUsers } from '@tabler/icons-react';
import { AppButton } from '@/src/components/controllers';
import { DetailPage, type DetailPageTab } from '@/src/components/controllers/detail-page';
import { useFamilyQuery } from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { familyDetailLabels as labels } from './static-data/family-detail.data';
import { FamilyFinanceController } from './FamilyFinanceController';
import { FamilyInfoTab } from './ui/FamilyInfoTab';
import { FamilyStudentsTab } from './ui/FamilyStudentsTab';

const icon = { size: 16, stroke: 1.6 };

/**
 * FamilyDetailController
 *
 * Family page: the children (each linking to its student page), the finances
 * of the whole family per currency, and the family's data.
 */
export function FamilyDetailController({ familyId }: { familyId: number }) {
  const { data: family, isLoading } = useFamilyQuery(familyId);
  const { can } = useAuth();

  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (!family)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.notFound}
      </Text>
    );

  const tabs: DetailPageTab[] = [
    {
      value: 'students',
      label: labels.tabStudents,
      icon: <IconUsers {...icon} />,
      count: family.students.length,
      content: <FamilyStudentsTab family={family} />,
    },
  ];
  if (can(PERMISSIONS.feesView))
    tabs.push({
      value: 'finance',
      label: labels.tabFinance,
      icon: <IconCash {...icon} />,
      content: <FamilyFinanceController familyId={family.id} />,
    });
  tabs.push({
    value: 'info',
    label: labels.tabInfo,
    icon: <IconInfoCircle {...icon} />,
    content: <FamilyInfoTab family={family} />,
  });

  return (
    <DetailPage
      icon={<IconHome size={22} />}
      title={family.familyName.startsWith(labels.familyPrefix) ? family.familyName : `${labels.familyPrefix} ${family.familyName}`}
      description={[family.phone, `${labels.studentsCount}: ${family.students.length}`].filter(Boolean).join(' · ')}
      breadcrumbs={[{ label: labels.list, href: '/families' }, { label: family.familyName }]}
      actions={
        can(PERMISSIONS.studentsManage) && (
          <AppButton variant="outline" href={`/students/new?familyId=${family.id}`}>
            {labels.addStudent}
          </AppButton>
        )
      }
      tabs={tabs}
    />
  );
}
