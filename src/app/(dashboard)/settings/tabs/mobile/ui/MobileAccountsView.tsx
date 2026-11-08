'use client';

import { useMemo } from 'react';
import { IconDeviceMobile, IconPlus } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers/app-module';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppButton, AppSelect } from '@/src/components/controllers';
import { MobileAccountItem, MobileAccountRole } from '@/src/core/api';
import { MOBILE_ROLE_OPTIONS } from '../static-data/mobile-accounts.data';
import { useMobileAccountsMirror } from '../store/useMobileAccountsMirror';
import { getMobileAccountsColumns } from './MobileAccountsColumns';
import { MobileAccountDrawer } from './MobileAccountDrawer';
import { MobileAccountPasswordModal } from './MobileAccountPasswordModal';
import { MobileAccountDeactivateModal } from './MobileAccountDeactivateModal';

interface MobileAccountsViewProps {
  canManage: boolean;
  familiesData: { value: string; label: string }[];
  eligibleStudentsData: { value: string; label: string; suggestedPhone?: string | null }[];
  onSubmitDrawer: () => void;
  onResetPassword: () => void;
  onDeactivate: () => void;
}

export function MobileAccountsView({
  canManage,
  familiesData,
  eligibleStudentsData,
  onSubmitDrawer,
  onResetPassword,
  onDeactivate,
}: MobileAccountsViewProps) {
  const data = useMobileAccountsMirror('data');
  const total = useMobileAccountsMirror('total');
  const page = useMobileAccountsMirror('page');
  const limit = useMobileAccountsMirror('limit');
  const totalPages = useMobileAccountsMirror('totalPages');
  const isLoading = useMobileAccountsMirror('isLoading');
  const roleFilter = useMobileAccountsMirror('roleFilter');
  const setPage = useMobileAccountsMirror('setPage');
  const setSearch = useMobileAccountsMirror('setSearch');
  const setRoleFilter = useMobileAccountsMirror('setRoleFilter');
  const openDrawer = useMobileAccountsMirror('openDrawer');
  const openPasswordModal = useMobileAccountsMirror('openPasswordModal');
  const openDeactivateModal = useMobileAccountsMirror('openDeactivateModal');

  const columns = useMemo(
    () => getMobileAccountsColumns(openPasswordModal, openDeactivateModal, canManage),
    [openPasswordModal, openDeactivateModal, canManage],
  );

  return (
    <>
      <AppModule exportTitle="حسابات التطبيق">
        <AppModule.Table>
          <DataModuleController
            data={data}
            columns={columns}
            total={total}
            page={page}
            limit={limit}
            totalPages={totalPages}
            isLoading={isLoading}
            searchPlaceholder="بحث عن حساب بالاسم أو الهاتف..."
            emptyMessage="لا توجد حسابات تطبيق"
            emptyDescription="لم يتم العثور على أي حسابات تطبيق مسجلة"
            keyExtractor={(item: MobileAccountItem) => item.id}
            onPageChange={setPage}
            onSearchChange={setSearch}
            selectable
          >
            <DataModuleController.Header>
              <DataModuleController.Title icon={<IconDeviceMobile size={20} />} badgeLabel="حساب" />
              {canManage && (
                <DataModuleController.Actions>
                  <AppButton leftSection={<IconPlus size={16} />} onClick={() => openDrawer('FAMILY')}>
                    حساب جديد
                  </AppButton>
                </DataModuleController.Actions>
              )}
            </DataModuleController.Header>

            <DataModuleController.FilterBar>
              <DataModuleController.SearchInput placeholder="بحث بالاسم أو رقم الهاتف..." />
              <DataModuleController.FilterSlot>
                <AppSelect
                  placeholder="تصفية حسب نوع الحساب"
                  data={MOBILE_ROLE_OPTIONS}
                  value={roleFilter || ''}
                  onChange={(val: string | null) => setRoleFilter((val as MobileAccountRole) || null)}
                  clearable
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

      <MobileAccountDrawer
        familiesData={familiesData}
        eligibleStudentsData={eligibleStudentsData}
        onSubmit={onSubmitDrawer}
      />
      <MobileAccountPasswordModal onSubmit={onResetPassword} />
      <MobileAccountDeactivateModal onConfirm={onDeactivate} />
    </>
  );
}
