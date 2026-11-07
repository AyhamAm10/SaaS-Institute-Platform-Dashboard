'use client';

import { useMemo } from 'react';
import { AppModule } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AcademicYear } from '@/src/core/api';
import { academicYearsPageMetadata } from '../static-data/academic-years.data';
import { AcademicYearDrawer } from './AcademicYearDrawer';
import { SetCurrentAcademicYearModal } from './SetCurrentAcademicYearModal';
import { AcademicYearsActions } from './AcademicYearsActions';
import { useAcademicYearsColumns } from './AcademicYearsTable';
import { useAcademicYearsMirror } from '../store/useAcademicYearsMirror';

interface AcademicYearsViewProps {
  onFormSubmit: (formData: {
    name: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  }) => Promise<void>;
  onSetCurrent: (year: AcademicYear) => Promise<void>;
  canManage?: boolean;
}

export function AcademicYearsView({ onFormSubmit, onSetCurrent, canManage = true }: AcademicYearsViewProps) {
  const data = useAcademicYearsMirror('data');
  const total = useAcademicYearsMirror('total');
  const page = useAcademicYearsMirror('page');
  const limit = useAcademicYearsMirror('limit');
  const totalPages = useAcademicYearsMirror('totalPages');
  const isLoading = useAcademicYearsMirror('isLoading');
  const isFetching = useAcademicYearsMirror('isFetching');
  const setPage = useAcademicYearsMirror('setPage');
  const setSearch = useAcademicYearsMirror('setSearch');

  const modalOpened = useAcademicYearsMirror('modalOpened');
  const selectedYear = useAcademicYearsMirror('selectedYear');
  const closeModal = useAcademicYearsMirror('closeModal');
  const formSubmitting = useAcademicYearsMirror('formSubmitting');

  const setCurrentDrawerOpened = useAcademicYearsMirror('setCurrentDrawerOpened');
  const selectedYearForSetCurrent = useAcademicYearsMirror('selectedYearForSetCurrent');
  const closeSetCurrentDrawer = useAcademicYearsMirror('closeSetCurrentDrawer');
  const openSetCurrentDrawer = useAcademicYearsMirror('openSetCurrentDrawer');
  const setCurrentPending = useAcademicYearsMirror('setCurrentPending');
  const openEdit = useAcademicYearsMirror('openEdit');

  const currentActiveYear = useMemo(
    () => data.find((y) => y.isCurrent) ?? null,
    [data],
  );

  const columns = useAcademicYearsColumns(openEdit, openSetCurrentDrawer, { canManage });

  return (
    <AppModule exportTitle="السنوات الدراسية">
      <AppModule.Table>
        <DataModuleController
          selectable
          title={academicYearsPageMetadata.title}
          description={academicYearsPageMetadata.description}
          data={data}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          isFetching={isFetching}
          searchPlaceholder={academicYearsPageMetadata.searchPlaceholder}
          emptyMessage={academicYearsPageMetadata.emptyMessage}
          emptyDescription={academicYearsPageMetadata.emptyDescription}
          onPageChange={setPage}
          onSearchChange={setSearch}
        >
          <DataModuleController.Header>
            <DataModuleController.Title />
            {canManage && (
              <DataModuleController.Actions>
                <AcademicYearsActions />
              </DataModuleController.Actions>
            )}
          </DataModuleController.Header>

          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput />
            <DataModuleController.ResetButton />
          </DataModuleController.FilterBar>

          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>

          <DataModuleController.Footer />
        </DataModuleController>
      </AppModule.Table>

      {canManage && (
        <>
          <AcademicYearDrawer
            opened={modalOpened}
            onClose={closeModal}
            year={selectedYear}
            onSubmit={onFormSubmit}
            isLoading={formSubmitting}
          />

          <SetCurrentAcademicYearModal
            opened={setCurrentDrawerOpened}
            onClose={closeSetCurrentDrawer}
            targetYear={selectedYearForSetCurrent}
            currentActiveYear={currentActiveYear}
            onConfirm={onSetCurrent}
            isLoading={setCurrentPending}
          />
        </>
      )}
    </AppModule>
  );
}
