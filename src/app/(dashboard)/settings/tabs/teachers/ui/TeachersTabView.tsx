'use client';

import { useMemo } from 'react';
import { Alert, Stack, Text } from '@mantine/core';
import { IconInfoCircle, IconUserCheck } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers/app-module';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { Teacher } from '@/src/core/api';
import { useTeachersTabMirror } from '../store/useTeachersTabMirror';
import { getTeachersTabColumns } from './TeachersTabColumns';
import { TeachersTabPasswordModal } from './TeachersTabPasswordModal';

interface TeachersTabViewProps {
  onResetPassword: () => void;
  canManage: boolean;
}

export function TeachersTabView({ onResetPassword, canManage }: TeachersTabViewProps) {
  const data = useTeachersTabMirror('data');
  const total = useTeachersTabMirror('total');
  const page = useTeachersTabMirror('page');
  const limit = useTeachersTabMirror('limit');
  const totalPages = useTeachersTabMirror('totalPages');
  const isLoading = useTeachersTabMirror('isLoading');
  const setPage = useTeachersTabMirror('setPage');
  const setSearch = useTeachersTabMirror('setSearch');
  const openPasswordModal = useTeachersTabMirror('openPasswordModal');

  const columns = useMemo(
    () => getTeachersTabColumns(openPasswordModal, canManage),
    [openPasswordModal, canManage],
  );

  return (
    <Stack gap="lg">
      <Alert icon={<IconInfoCircle size={18} />} color="blue" variant="light" radius="xl">
        <Text size="sm">القائمة تتبع الفرع النشط في أعلى الصفحة.</Text>
      </Alert>

      <AppModule exportTitle="حسابات المعلمين">
        <AppModule.Table>
          <DataModuleController
            data={data}
            columns={columns}
            total={total}
            page={page}
            limit={limit}
            totalPages={totalPages}
            isLoading={isLoading}
            searchPlaceholder="بحث عن معلم بالاسم أو الهاتف..."
            emptyMessage="لا يوجد معلمون"
            emptyDescription="لم يتم العثور على أي حسابات معلمين في هذا الفرع"
            keyExtractor={(item: Teacher) => item.id}
            onPageChange={setPage}
            onSearchChange={setSearch}
            selectable
          >
            <DataModuleController.Header>
              <DataModuleController.Title icon={<IconUserCheck size={20} />} badgeLabel="معلم" />
            </DataModuleController.Header>

            <DataModuleController.FilterBar>
              <DataModuleController.SearchInput placeholder="بحث عن معلم بالاسم أو الهاتف..." />
            </DataModuleController.FilterBar>

            <DataModuleController.Content>
              <DataModuleController.Table />
            </DataModuleController.Content>

            <DataModuleController.Footer />
          </DataModuleController>
        </AppModule.Table>
      </AppModule>

      <TeachersTabPasswordModal onSubmit={onResetPassword} />
    </Stack>
  );
}

