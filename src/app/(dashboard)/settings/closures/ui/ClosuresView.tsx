'use client';

import { useMemo } from 'react';
import { IconCalendarOff, IconPlus } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers/app-module';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppButton } from '@/src/components/controllers';
import type { Closure } from '@/src/core/api';
import { useClosuresMirror } from '../store/closures.store';
import { closureLabels as labels } from '../static-data/closures.data';
import { getClosuresColumns } from './ClosuresColumns';
import { ClosureDeleteModal } from './ClosureDeleteModal';
import { ClosureDrawer } from './ClosureDrawer';

interface ClosuresViewProps {
  onSubmit: () => Promise<void>;
  onDelete: () => Promise<void>;
  hideHeader?: boolean;
}

/** Closures tab: table of closures, create / edit drawer, delete modal. ZERO useState hooks. */
export function ClosuresView({ onSubmit, onDelete, hideHeader }: ClosuresViewProps) {
  const data = useClosuresMirror('data');
  const isLoading = useClosuresMirror('isLoading');
  const canManage = useClosuresMirror('canManage');
  const today = useClosuresMirror('today');
  const openCreate = useClosuresMirror('openCreate');
  const openEdit = useClosuresMirror('openEdit');
  const openDelete = useClosuresMirror('openDelete');
  const columns = useMemo(
    () => getClosuresColumns(openEdit, openDelete, canManage, today),
    [openEdit, openDelete, canManage, today],
  );

  return (
    <AppModule exportTitle={labels.title}>
      <AppModule.Table>
        <DataModuleController
          title={hideHeader ? undefined : labels.title}
          description={hideHeader ? undefined : labels.description}
          data={data}
          columns={columns}
          total={data.length}
          page={1}
          limit={Math.max(data.length, 10)}
          totalPages={1}
          isLoading={isLoading}
          emptyMessage={labels.emptyMessage}
          emptyDescription={labels.emptyDescription}
          keyExtractor={(item: Closure) => item.id}
          onPageChange={() => undefined}
        >
          <DataModuleController.Header>
            {!hideHeader && <DataModuleController.Title icon={<IconCalendarOff size={20} />} badgeLabel="عطلة" />}
            <DataModuleController.Actions>
              {canManage && (
                <AppButton leftSection={<IconPlus size={16} />} onClick={openCreate}>
                  {labels.create}
                </AppButton>
              )}
            </DataModuleController.Actions>
          </DataModuleController.Header>
          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>
        </DataModuleController>
      </AppModule.Table>
      <ClosureDrawer onSubmit={onSubmit} />
      <ClosureDeleteModal onDelete={onDelete} />
    </AppModule>
  );
}
