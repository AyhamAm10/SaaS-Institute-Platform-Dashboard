'use client';

import { useMemo } from 'react';
import { IconPlus, IconUsersGroup } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers/app-module';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppButton, AppSelect, ReportMenu } from '@/src/components/controllers';
import type { StaffMember, StaffRole } from '@/src/core/api';
import { useStaffMirror } from '../store/staff.store';
import { STAFF_ROLE_OPTIONS, staffLabels as labels } from '../static-data/staff.data';
import { getStaffColumns } from './StaffColumns';
import { StaffDrawer } from './StaffDrawer';
import { type StaffModalActions, StaffModals } from './StaffModals';

interface StaffViewProps extends StaffModalActions {
  onSubmit: () => Promise<void>;
  currentUserId: number | null;
  hideHeader?: boolean;
}

/** Staff page: filtered table, drawer and member modals. ZERO useState hooks. */
export function StaffView({ onSubmit, onResetPassword, onDeactivate, currentUserId, hideHeader }: StaffViewProps) {
  const data = useStaffMirror('data');
  const total = useStaffMirror('total');
  const page = useStaffMirror('page');
  const limit = useStaffMirror('limit');
  const totalPages = useStaffMirror('totalPages');
  const isLoading = useStaffMirror('isLoading');
  const roleFilter = useStaffMirror('roleFilter');
  const setPage = useStaffMirror('setPage');
  const setSearch = useStaffMirror('setSearch');
  const setRoleFilter = useStaffMirror('setRoleFilter');
  const openCreate = useStaffMirror('openCreate');
  const openEdit = useStaffMirror('openEdit');
  const openModal = useStaffMirror('openModal');
  const columns = useMemo(
    () => getStaffColumns(openEdit, openModal, currentUserId),
    [openEdit, openModal, currentUserId],
  );

  return (
    <AppModule exportTitle="الموظفون">
      <AppModule.Table>
        <DataModuleController
          title={hideHeader ? undefined : labels.title}
          description={hideHeader ? undefined : labels.description}
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
          keyExtractor={(item: StaffMember) => item.id}
          onPageChange={setPage}
          onSearchChange={setSearch}
          selectable
        >
          <DataModuleController.Header>
            {!hideHeader && <DataModuleController.Title icon={<IconUsersGroup size={20} />} badgeLabel="موظف" />}
            <DataModuleController.Actions>
              <ReportMenu keys={['staff-activity']} params={{}} />
              <AppButton leftSection={<IconPlus size={16} />} onClick={openCreate}>
                {labels.create}
              </AppButton>
            </DataModuleController.Actions>
          </DataModuleController.Header>
          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder={labels.searchPlaceholder} />
            <DataModuleController.FilterSlot>
              <AppSelect
                placeholder={labels.roleFilter}
                data={STAFF_ROLE_OPTIONS}
                value={roleFilter}
                onChange={(v: string | null) => setRoleFilter(v as StaffRole | null)}
                clearable
                size="sm"
                w={170}
              />
            </DataModuleController.FilterSlot>
          </DataModuleController.FilterBar>
          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>
          <DataModuleController.Footer />
        </DataModuleController>
      </AppModule.Table>
      <StaffDrawer onSubmit={onSubmit} currentUserId={currentUserId} />
      <StaffModals onResetPassword={onResetPassword} onDeactivate={onDeactivate} />
    </AppModule>
  );
}
