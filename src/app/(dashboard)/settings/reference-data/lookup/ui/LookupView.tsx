'use client';

import { useMemo } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers/app-module';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppButton } from '@/src/components/controllers/button';
import { LookupItem } from '@/src/core/api';
import { useLookupMirror } from '../store/useLookupMirror';
import { getLookupColumns } from './LookupColumns';
import { LookupDrawer } from './LookupDrawer';
import { LookupDeleteModal } from './LookupDeleteModal';

export interface LookupViewProps {
  onSubmit: () => Promise<void>;
  onConfirmDelete: (item: LookupItem) => Promise<void>;
  canManage?: boolean;
}

/**
 * LookupView
 *
 * Paginated table of one reference table with its drawer and delete modal.
 * ZERO useState hooks — everything comes from useLookupMirror.
 */
export function LookupView({ onSubmit, onConfirmDelete, canManage = true }: LookupViewProps) {
  const config = useLookupMirror('config');
  const data = useLookupMirror('data');
  const total = useLookupMirror('total');
  const page = useLookupMirror('page');
  const limit = useLookupMirror('limit');
  const totalPages = useLookupMirror('totalPages');
  const isLoading = useLookupMirror('isLoading');
  const isFetching = useLookupMirror('isFetching');
  const options = useLookupMirror('options');
  const setPage = useLookupMirror('setPage');
  const setSearch = useLookupMirror('setSearch');
  const openCreate = useLookupMirror('openCreate');
  const openEdit = useLookupMirror('openEdit');
  const openDelete = useLookupMirror('openDelete');

  const columns = useMemo(
    () => getLookupColumns(config, options, openEdit, openDelete, { canManage }),
    [config, options, openEdit, openDelete, canManage],
  );
  const Icon = config.icon;

  return (
    <AppModule exportTitle={config.title}>
      <AppModule.Table>
        <DataModuleController
          title={config.title}
          description={config.description}
          data={data}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyMessage={`لا توجد ${config.title} بعد`}
          emptyDescription={`أضف ${config.singular} جديدة لتظهر هنا`}
          searchPlaceholder="ابحث بالاسم..."
          keyExtractor={(item: LookupItem) => item.id}
          onPageChange={setPage}
          onSearchChange={setSearch}
          selectable
        >
          <DataModuleController.Header>
            <DataModuleController.Title icon={<Icon size={18} />} badgeLabel="عنصر" />
            {canManage && (
              <DataModuleController.Actions>
                <AppButton leftSection={<IconPlus size={16} />} onClick={openCreate}>
                  إضافة {config.singular}
                </AppButton>
              </DataModuleController.Actions>
            )}
          </DataModuleController.Header>

          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder="ابحث بالاسم..." />
          </DataModuleController.FilterBar>

          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>

          <DataModuleController.Footer />
        </DataModuleController>
      </AppModule.Table>

      {canManage && (
        <>
          <LookupDrawer onSubmit={onSubmit} />
          <LookupDeleteModal onConfirmDelete={onConfirmDelete} />
        </>
      )}
    </AppModule>
  );
}
