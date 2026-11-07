'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import {
  useAcademicYearsQuery,
  useDashboardOverviewQuery,
  Student,
  useDeleteStudentMutation,
  useFamiliesSearchQuery,
  useStudentDeletionReportQuery,
  useStudentFieldsQuery,
  useStudentsQuery,
  useUpdateStudentMutation,
} from '@/src/core/api';
import { useOperationalContext } from '@/src/core/context';
import { createStudentsStore, StudentsContext } from './store/students.store';
import { StudentsView } from './ui/StudentsView';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { useStudentReferenceOptions } from './utils/useStudentReferenceOptions';
import {
  extractErrorMessage,
  toUpdateStudentPayload,
  validateStudentEditForm,
} from './utils/student-edit.utils';

type Store = ReturnType<typeof createStudentsStore>;

/**
 * QuerySync
 *
 * Bridges React Query data for students into the isolated Zustand store.
 * Strictly adheres to QuerySync pattern from Section 9 & 12 of role.md.
 */
function QuerySync({ store }: { store: Store }) {
  const { activeBranchId } = useOperationalContext();
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const filters = useStore(store, (s) => s.filters);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const { data: paginatedData, isLoading } = useStudentsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    branchId: activeBranchId || undefined,
    statusId: filters.statusId ?? undefined,
    busId: filters.busId ?? undefined,
    cityId: filters.cityId ?? undefined,
    unassignedYearId: filters.unassignedYearId ?? undefined,
  });

  useEffect(() => {
    syncQueryData({
      data: paginatedData?.data ?? [],
      total: paginatedData?.total ?? 0,
      totalPages: paginatedData?.totalPages ?? 1,
      isLoading,
    });
  }, [paginatedData, isLoading, syncQueryData]);

  return null;
}

/**
 * EditLookupsSync
 *
 * While the edit drawer is open, loads family search results and the
 * institute's custom student fields into the store.
 */
function EditLookupsSync({ store }: { store: Store }) {
  const opened = useStore(store, (s) => s.editDrawerOpened);
  const familySearch = useStore(store, (s) => s.familySearch);
  const syncEditLookups = useStore(store, (s) => s.syncEditLookups);

  const { data: families, isLoading: isLoadingFamilies } = useFamiliesSearchQuery(
    familySearch.trim() ? familySearch.trim() : undefined,
    opened,
  );
  const { data: fields } = useStudentFieldsQuery();

  useEffect(() => {
    syncEditLookups({
      families: families ?? [],
      isLoadingFamilies: opened && isLoadingFamilies,
      fields: (fields ?? []).filter((f) => f.isActive),
    });
  }, [opened, families, isLoadingFamilies, fields, syncEditLookups]);

  return null;
}

/**
 * ReferenceOptionsSync
 *
 * Loads the reference tables (statuses, cities, schools, buses, know-ways)
 * and the academic years (unassigned filter)
 * used by the list filters and the edit drawer into the store.
 */
function ReferenceOptionsSync({ store }: { store: Store }) {
  const syncReferenceOptions = useStore(store, (s) => s.syncReferenceOptions);
  const syncYearOptions = useStore(store, (s) => s.syncYearOptions);
  const options = useStudentReferenceOptions();
  const { data: years } = useAcademicYearsQuery({ limit: 100 });

  useEffect(() => {
    syncReferenceOptions(options);
  }, [options, syncReferenceOptions]);

  useEffect(() => {
    syncYearOptions((years?.data ?? []).map((y) => ({ value: String(y.id), label: y.name })));
  }, [years, syncYearOptions]);

  return null;
}

/** Real KPIs of the cards above the table (same numbers as the dashboard home). */
function OverviewSync({ store }: { store: Store }) {
  const syncOverview = useStore(store, (s) => s.syncOverview);
  const { data } = useDashboardOverviewQuery();

  useEffect(() => {
    syncOverview(data ?? null);
  }, [data, syncOverview]);

  return null;
}

/**
 * DeletionReportSync
 *
 * Loads what is attached to the student selected for deletion into the store.
 */
function DeletionReportSync({ store }: { store: Store }) {
  const studentId = useStore(store, (s) => s.studentToDelete?.id ?? null);
  const syncDeletionReport = useStore(store, (s) => s.syncDeletionReport);

  const { data, isLoading } = useStudentDeletionReportQuery(studentId);

  useEffect(() => {
    syncDeletionReport({
      report: studentId ? (data ?? null) : null,
      isLoading: Boolean(studentId) && isLoading,
    });
  }, [studentId, data, isLoading, syncDeletionReport]);

  return null;
}

/**
 * StudentsController
 *
 * Root Controller Component for Students Management.
 * Owns isolated Zustand store per Section 3 & 9 of role.md.
 */
export function StudentsController() {
  const [store] = useState(() => createStudentsStore());
  const { can } = useAuth();
  // Buttons follow the role; the server enforces the same rules (role.md §8.6)
  const access = {
    canManage: can(PERMISSIONS.studentsManage),
    canSeeFees: can(PERMISSIONS.feesView),
  };
  const updateMutation = useUpdateStudentMutation();
  const deleteMutation = useDeleteStudentMutation();

  const handleSubmitEdit = useCallback(async () => {
    const { form, selectedStudent, studentFields } = store.getState();
    if (!selectedStudent) return;
    store.getState().setGeneralError(null);

    // ── Client-side validation ──
    const errors = validateStudentEditForm(form, studentFields);
    Object.entries(errors).forEach(([field, msg]) => store.getState().setFieldError(field, msg));
    if (Object.keys(errors).length > 0) return;

    store.getState().setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        id: selectedStudent.id,
        payload: toUpdateStudentPayload(form, selectedStudent),
      });
      store.getState().closeEditDrawer();
    } catch (err: unknown) {
      store
        .getState()
        .setGeneralError(extractErrorMessage(err, 'حدث خطأ أثناء حفظ بيانات الطالب'));
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, updateMutation]);

  const handleConfirmDelete = useCallback(
    async (student: Student) => {
      store.getState().setDeleteError(null);
      store.getState().setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(student.id);
        store.getState().closeDeleteModal();
      } catch (err: unknown) {
        store.getState().setDeleteError(extractErrorMessage(err, 'حدث خطأ أثناء حذف الطالب'));
      } finally {
        store.getState().setIsDeleting(false);
      }
    },
    [store, deleteMutation],
  );

  return (
    <StudentsContext.Provider value={store}>
      <QuerySync store={store} />
      <EditLookupsSync store={store} />
      <ReferenceOptionsSync store={store} />
      <DeletionReportSync store={store} />
      <OverviewSync store={store} />
      <StudentsView access={access} onSubmitEdit={handleSubmitEdit} onConfirmDelete={handleConfirmDelete} />
    </StudentsContext.Provider>
  );
}
