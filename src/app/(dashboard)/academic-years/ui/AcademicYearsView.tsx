'use client';

import { useCallback } from 'react';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AcademicYear } from '@/src/core/api';
import { academicYearsPageMetadata } from '../static-data/academic-years.data';
import { AcademicYearModal } from './AcademicYearModal';
import { AcademicYearsActions } from './AcademicYearsActions';
import { useAcademicYearsColumns } from './AcademicYearsTable';
import { useAcademicYearsMirror, useAcademicYearsMirrorSelector } from '../store/useAcademicYearsMirror';

interface AcademicYearsViewProps {
  onFormSubmit: (formData: {
    name: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  }) => Promise<void>;
  onSetCurrent: (year: AcademicYear) => Promise<void>;
}

/**
 * AcademicYearsView
 *
 * Pure presentation layout assembling the Academic Years page.
 * Reads ALL state via useMirror hooks — contains ZERO useState.
 */
export function AcademicYearsView({ onFormSubmit, onSetCurrent }: AcademicYearsViewProps) {
  // ── Read state via mirror ──
  const data = useAcademicYearsMirror('data');
  const total = useAcademicYearsMirror('total');
  const page = useAcademicYearsMirror('page');
  const limit = useAcademicYearsMirror('limit');
  const totalPages = useAcademicYearsMirror('totalPages');
  const isLoading = useAcademicYearsMirror('isLoading');
  const isFetching = useAcademicYearsMirror('isFetching');
  const setPage = useAcademicYearsMirror('setPage');
  const setSearch = useAcademicYearsMirror('setSearch');

  // ── Modal state via mirror ──
  const modalOpened = useAcademicYearsMirror('modalOpened');
  const selectedYear = useAcademicYearsMirror('selectedYear');
  const closeModal = useAcademicYearsMirror('closeModal');
  const formSubmitting = useAcademicYearsMirror('formSubmitting');

  // ── Open edit action (passed to column definitions) ──
  const openEdit = useAcademicYearsMirror('openEdit');

  const handleSetCurrent = useCallback(
    (year: AcademicYear) => {
      if (year.isCurrent) return;
      onSetCurrent(year);
    },
    [onSetCurrent],
  );

  // ── Column definitions via hook ──
  const columns = useAcademicYearsColumns(openEdit, handleSetCurrent);

  return (
    <>
      <DataModuleController
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
          <DataModuleController.Actions>
            <AcademicYearsActions />
          </DataModuleController.Actions>
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

      <AcademicYearModal
        opened={modalOpened}
        onClose={closeModal}
        year={selectedYear}
        onSubmit={onFormSubmit}
        isLoading={formSubmitting}
      />
    </>
  );
}
