'use client';

import { useMemo } from 'react';
import { Stack, Text } from '@mantine/core';
import { IconPlus, IconUserCog } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers/app-module';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppButton, AppSelect, ReportMenu } from '@/src/components/controllers';
import { AppTabs } from '@/src/components/controllers/tabs';
import type { AccountItem, AccountType } from '@/src/core/api';
import { useAccountsMirror } from '../store/accounts.store';
import { ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS, STATUS_OPTIONS, accountsLabels as labels } from '../static-data/accounts.data';
import type { AccountStatusFilter } from '../utils/accounts.utils';
import { AccountConfirmModal } from './AccountConfirmModal';
import { getAccountColumns } from './AccountsColumns';
import { FamiliesNotice } from './FamiliesNotice';
import { StaffAccountDrawer } from './StaffAccountDrawer';
import { StudentAccountDrawer } from './StudentAccountDrawer';

interface AccountsViewProps {
  currentUserId: number | null;
  submitStaff: () => Promise<void>;
  submitStudent: () => Promise<void>;
  confirmModal: () => Promise<void>;
  syncFamilies: () => Promise<void>;
}

const TAB_ITEMS = ACCOUNT_TYPES.map((value) => ({ value, label: ACCOUNT_TYPE_LABELS[value] }));

/** Accounts screen: sub-tabs by account type over one table. ZERO useState hooks. */
export function AccountsView({ currentUserId, submitStaff, submitStudent, confirmModal, syncFamilies }: AccountsViewProps) {
  const type = useAccountsMirror('type');
  const data = useAccountsMirror('data');
  const total = useAccountsMirror('total');
  const page = useAccountsMirror('page');
  const limit = useAccountsMirror('limit');
  const totalPages = useAccountsMirror('totalPages');
  const isLoading = useAccountsMirror('isLoading');
  const status = useAccountsMirror('status');
  const setType = useAccountsMirror('setType');
  const setPage = useAccountsMirror('setPage');
  const setSearch = useAccountsMirror('setSearch');
  const setStatus = useAccountsMirror('setStatus');
  const openModal = useAccountsMirror('openModal');
  const openStaffEdit = useAccountsMirror('openStaffEdit');
  const openStaffCreate = useAccountsMirror('openStaffCreate');
  const openStudentDrawer = useAccountsMirror('openStudentDrawer');
  const columns = useMemo(
    () => getAccountColumns({ type, currentUserId, onEdit: openStaffEdit, onModal: openModal }),
    [type, currentUserId, openStaffEdit, openModal],
  );

  return (
    <AppModule exportTitle={labels.title}>
      <Stack gap="md">
        <AppTabs value={type} onChange={(v: string | null) => v && setType(v as AccountType)} items={TAB_ITEMS} size="sm">
          <AppTabs.List />
        </AppTabs>
        {type === 'teachers' && (
          <Text size="sm" c="var(--app-text-muted)">
            {labels.teachersHint}
          </Text>
        )}
        {type === 'families' && <FamiliesNotice onSync={syncFamilies} />}
        <AppModule.Table>
          <DataModuleController
            data={data}
            columns={columns}
            total={total}
            page={page}
            limit={limit}
            totalPages={totalPages}
            isLoading={isLoading}
            emptyMessage={labels.emptyMessage}
            searchPlaceholder={labels.searchPlaceholder}
            keyExtractor={(item: AccountItem) => item.id}
            onPageChange={setPage}
            onSearchChange={setSearch}
          >
            <DataModuleController.Header>
              <DataModuleController.Title icon={<IconUserCog size={20} />} badgeLabel="حساب" />
              <DataModuleController.Actions>
                {type === 'staff' && (
                  <>
                    <ReportMenu keys={['staff-activity']} params={{}} />
                    <AppButton leftSection={<IconPlus size={16} />} onClick={openStaffCreate}>
                      {labels.staffCreate}
                    </AppButton>
                  </>
                )}
                {type === 'students' && (
                  <AppButton leftSection={<IconPlus size={16} />} onClick={openStudentDrawer}>
                    {labels.studentCreate}
                  </AppButton>
                )}
              </DataModuleController.Actions>
            </DataModuleController.Header>
            <DataModuleController.FilterBar>
              <DataModuleController.SearchInput placeholder={labels.searchPlaceholder} />
              <DataModuleController.FilterSlot>
                <AppSelect
                  placeholder={labels.statusAll}
                  data={STATUS_OPTIONS}
                  value={status}
                  onChange={(v: string | null) => setStatus(v as AccountStatusFilter)}
                  clearable
                  size="sm"
                  w={150}
                />
              </DataModuleController.FilterSlot>
            </DataModuleController.FilterBar>
            <DataModuleController.Content>
              <DataModuleController.Table />
            </DataModuleController.Content>
            <DataModuleController.Footer />
          </DataModuleController>
        </AppModule.Table>
      </Stack>
      <StaffAccountDrawer onSubmit={submitStaff} currentUserId={currentUserId} />
      <StudentAccountDrawer onSubmit={submitStudent} />
      <AccountConfirmModal onConfirm={confirmModal} />
    </AppModule>
  );
}
