'use client';

import { useMemo } from 'react';
import { IconAlarm } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppSelect, ReportMenu } from '@/src/components/controllers';
import { type Currency, type OverdueInstallment } from '@/src/core/api';
import { CURRENCY_OPTIONS } from '@/src/core/format';
import { useOverdueMirror } from '../store/overdue.store';
import { overdueLabels as labels } from '../static-data/overdue.data';
import { OverdueOverview } from './OverdueOverview';
import { getOverdueColumns } from './OverdueColumns';

export function OverdueView() {
  const data = useOverdueMirror('data');
  const total = useOverdueMirror('total');
  const page = useOverdueMirror('page');
  const limit = useOverdueMirror('limit');
  const totalPages = useOverdueMirror('totalPages');
  const isLoading = useOverdueMirror('isLoading');
  const currency = useOverdueMirror('currency');
  const setPage = useOverdueMirror('setPage');
  const setSearch = useOverdueMirror('setSearch');
  const setCurrency = useOverdueMirror('setCurrency');
  const columns = useMemo(() => getOverdueColumns(), []);

  return (
    <AppModule exportTitle="الأقساط المتأخرة">
      <OverdueOverview />

      <AppModule.Table>
        <DataModuleController
          selectable
          title={labels.title}
          description={labels.description}
          data={data}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          emptyMessage={labels.emptyMessage}
          emptyDescription={labels.emptyDescription}
          searchPlaceholder={labels.searchPlaceholder}
          keyExtractor={(item: OverdueInstallment) => item.id}
          onPageChange={setPage}
          onSearchChange={setSearch}
        >
          <DataModuleController.Header>
            <DataModuleController.Title icon={<IconAlarm size={20} />} badgeLabel="قسط" />
            <DataModuleController.Actions>
              <ReportMenu keys={['overdue-aging', 'upcoming-dues', 'students-without-contract']} params={{}} />
            </DataModuleController.Actions>
          </DataModuleController.Header>
          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder={labels.searchPlaceholder} />
            <DataModuleController.FilterSlot>
              <AppSelect
                placeholder={labels.currencyPlaceholder}
                data={CURRENCY_OPTIONS}
                value={currency}
                onChange={(v: string | null) => setCurrency((v as Currency) || '')}
                clearable
                size="sm"
                w={140}
              />
            </DataModuleController.FilterSlot>
          </DataModuleController.FilterBar>
          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>
          <DataModuleController.Footer />
        </DataModuleController>
      </AppModule.Table>
    </AppModule>
  );
}
