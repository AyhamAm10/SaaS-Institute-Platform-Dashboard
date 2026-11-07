'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useDebouncedValue } from '@mantine/hooks';
import {
  getApiErrorMessage,
  useChangeEnrollmentStatusMutation,
  useEnrollStudentsMutation,
  useSectionRosterQuery,
  useSectionSubjectsQuery,
  useSectionsQuery,
  useSetEnrollmentSubjectsMutation,
  useStudentsQuery,
  useTransferEnrollmentMutation,
} from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import {
  createSectionStudentsStore,
  SectionStudentsContext,
  SectionStudentsStore,
} from './store/section-students.store';
import { RosterSection } from './state/section-students.state';
import { summarizeEnrollResult } from './utils/section-students.utils';
import { sectionStudentsLabels as labels } from './static-data/section-students.data';
import { useEnrollmentActions } from './useEnrollmentActions';
import { SectionStudentsView } from './ui/SectionStudentsView';

type SyncProps = { store: SectionStudentsStore };

/** Roster + section plan → store. */
function RosterSync({ store }: SyncProps) {
  const section = useStore(store, (s) => s.section);
  const syncRoster = useStore(store, (s) => s.syncRoster);
  const syncSectionSubjects = useStore(store, (s) => s.syncSectionSubjects);
  const roster = useSectionRosterQuery(section.id);
  const plan = useSectionSubjectsQuery(section.id);

  useEffect(() => {
    syncRoster(roster.data ?? [], roster.isLoading);
  }, [roster.data, roster.isLoading, syncRoster]);

  useEffect(() => {
    syncSectionSubjects((plan.data ?? []).map((p) => ({ id: p.subject.id, name: p.subject.name })));
  }, [plan.data, syncSectionSubjects]);

  return null;
}

/** Unassigned students of the section's branch (mounted while the add modal is open). */
function CandidatesSync({ store }: SyncProps) {
  const section = useStore(store, (s) => s.section);
  const search = useStore(store, (s) => s.candidateSearch);
  const syncCandidates = useStore(store, (s) => s.syncCandidates);
  const [debounced] = useDebouncedValue(search.trim(), 300);
  const { data, isFetching } = useStudentsQuery({
    unassignedYearId: section.academicYearId,
    branchId: section.branchId,
    search: debounced || undefined,
    limit: 50,
  });

  useEffect(() => {
    syncCandidates(
      (data?.data ?? []).map((s) => ({
        id: s.id,
        fullName: s.fullName,
        familyName: s.family?.familyName ?? null,
      })),
      isFetching,
    );
  }, [data, isFetching, syncCandidates]);

  return null;
}

/** Other sections of the same year and branch (mounted while transferring). */
function TransferOptionsSync({ store }: SyncProps) {
  const section = useStore(store, (s) => s.section);
  const syncTransferOptions = useStore(store, (s) => s.syncTransferOptions);
  const { data } = useSectionsQuery({
    academicYearId: section.academicYearId,
    branchId: section.branchId,
    limit: 100,
  });

  useEffect(() => {
    syncTransferOptions(
      (data?.data ?? []).filter((s) => s.id !== section.id).map((s) => ({ id: s.id, name: s.name })),
    );
  }, [data, section.id, syncTransferOptions]);

  return null;
}

/**
 * SectionStudentsController
 *
 * "Students" tab of the section drawer: roster, bulk enrollment, transfer,
 * withdraw / complete / re-activate and subject subsets (E5).
 * Own isolated store per section (role.md §3).
 */
export function SectionStudentsController({ section }: { section: RosterSection }) {
  const [store] = useState(() => createSectionStudentsStore(section));
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.studentsManage);
  const addOpened = useStore(store, (s) => s.addOpened);
  const actionType = useStore(store, (s) => s.actionType);
  const enrollMutation = useEnrollStudentsMutation();
  const actions = useEnrollmentActions(store, {
    transfer: useTransferEnrollmentMutation(),
    status: useChangeEnrollmentStatusMutation(),
    subjects: useSetEnrollmentSubjectsMutation(),
  });

  const handleEnroll = useCallback(async () => {
    const { selectedIds, candidates, setAddError, setAddResult, setIsEnrolling } = store.getState();
    if (selectedIds.length === 0) return;
    setAddError(null);
    setIsEnrolling(true);
    try {
      const result = await enrollMutation.mutateAsync({ sectionId: section.id, studentIds: selectedIds });
      setAddResult(summarizeEnrollResult(result, candidates));
      store.setState({ selectedIds: [] });
    } catch (err: unknown) {
      setAddError(getApiErrorMessage(err, labels.enrollError));
    } finally {
      setIsEnrolling(false);
    }
  }, [store, section.id, enrollMutation]);

  return (
    <SectionStudentsContext.Provider value={store}>
      <RosterSync store={store} />
      {addOpened && <CandidatesSync store={store} />}
      {actionType === 'transfer' && <TransferOptionsSync store={store} />}
      <SectionStudentsView onEnroll={handleEnroll} onSubmitAction={actions.submit} canManage={canManage} />
    </SectionStudentsContext.Provider>
  );
}
