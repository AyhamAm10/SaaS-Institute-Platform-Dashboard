'use client';

import { Center, Loader, Text } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
import { AppButton, StatusBadge } from '@/src/components/controllers';
import { DetailPage } from '@/src/components/controllers/detail-page';
import { useContractQuery } from '@/src/core/api';
import { CONTRACT_STATUS_META } from '../../students/finance/static-data/student-finance.data';
import { contractDetailLabels as labels } from './static-data/contract-detail.data';
import { ContractBody } from './ui/ContractBody';

/**
 * ContractDetailController
 *
 * One contract: terms, installment schedule and payments. Editing and taking
 * payments stay on the student's finance tab (linked in the header).
 */
export function ContractDetailController({ id }: { id: number }) {
  const { data: contract, isLoading } = useContractQuery(id);
  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (!contract)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.notFound}
      </Text>
    );
  const status = CONTRACT_STATUS_META[contract.status];

  return (
    <DetailPage
      icon={<IconFileText size={22} />}
      title={`${labels.contract} #${contract.id}`}
      description={`${contract.section.name} · ${contract.academicYear.name}`}
      badge={
        <StatusBadge tone={status.tone} size="sm">
          {status.label}
        </StatusBadge>
      }
      breadcrumbs={[{ label: labels.students, href: '/students' }, { label: `${labels.contract} #${contract.id}` }]}
      actions={
        <AppButton variant="outline" href={`/students/${contract.studentId}?tab=finance`}>
          {labels.openFinance}
        </AppButton>
      }
    >
      <ContractBody contract={contract} />
    </DetailPage>
  );
}
