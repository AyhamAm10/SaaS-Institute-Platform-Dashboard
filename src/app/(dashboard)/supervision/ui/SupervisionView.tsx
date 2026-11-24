'use client';

import { useMemo } from 'react';
import { IconEyeCheck } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import type { MySupervision } from '@/src/core/api';
import { useSupervisionMirror } from '../store/supervision.store';
import { supervisionLabels as labels } from '../static-data/supervision.data';
import { getSupervisionColumns } from './SupervisionColumns';

/** The supervisor's exams as a table (no paging: a supervisor has a handful). ZERO useState hooks. */
export function SupervisionView() {
  const data = useSupervisionMirror('data');
  const today = useSupervisionMirror('today');
  const isLoading = useSupervisionMirror('isLoading');
  const columns = useMemo(() => getSupervisionColumns(today), [today]);

  return (
    <AppModule exportTitle={labels.title}>
      <AppModule.Table>
        <DataModuleController
          title={labels.title}
          description={labels.description}
          data={data}
          columns={columns}
          total={data.length}
          page={1}
          limit={Math.max(data.length, 1)}
          totalPages={1}
          isLoading={isLoading}
          emptyMessage={labels.emptyMessage}
          emptyDescription={labels.emptyDescription}
          keyExtractor={(item: MySupervision) => item.examId}
          onPageChange={() => undefined}
          onSearchChange={() => undefined}
        >
          <DataModuleController.Header>
            <DataModuleController.Title icon={<IconEyeCheck size={20} />} badgeLabel={labels.badge} />
          </DataModuleController.Header>
          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>
        </DataModuleController>
      </AppModule.Table>
    </AppModule>
  );
}
