'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useDebouncedValue } from '@mantine/hooks';
import {
  downloadReportExcel,
  getApiErrorMessage,
  useExamsQuery,
  useReportCatalogQuery,
  useReportQuery,
  useSectionsQuery,
  useStudentDetailQuery,
  useStudentsQuery,
  useTeachersQuery,
} from '@/src/core/api';
import { createReportWorkspaceStore, ReportWorkspaceContext, type ReportWorkspaceStore } from './store/report-workspace.store';
import { reportsLabels as labels } from '../static-data/reports.data';
import { reportPrintHref, type ReportForm } from '../utils/reports.utils';
import { ReferenceOptionsReportSync } from './ReferenceOptionsReportSync';
import { ReportWorkspaceView } from './ui/ReportWorkspaceView';

type SyncProps = { store: ReportWorkspaceStore };

/** Catalog → this report's definition (null when unknown or not allowed). */
function DefinitionSync({ store }: SyncProps) {
  const key = useStore(store, (s) => s.reportKey);
  const syncDefinition = useStore(store, (s) => s.syncDefinition);
  const { data, isLoading } = useReportCatalogQuery();
  useEffect(() => {
    syncDefinition(data?.find((r) => r.key === key) ?? null, isLoading);
  }, [data, isLoading, key, syncDefinition]);
  return null;
}

/** Submitted parameters → server document. */
function DocumentSync({ store }: SyncProps) {
  const key = useStore(store, (s) => s.reportKey);
  const submitted = useStore(store, (s) => s.submitted);
  const syncDocument = useStore(store, (s) => s.syncDocument);
  const { data, isFetching, error } = useReportQuery(key, submitted ?? {}, submitted !== null);
  useEffect(() => {
    syncDocument(data ?? null, isFetching, error ? getApiErrorMessage(error, labels.loadError) : null);
  }, [data, isFetching, error, syncDocument]);
  return null;
}

/** Sections list (section and exam parameters). */
function SectionsSync({ store }: SyncProps) {
  const syncOptions = useStore(store, (s) => s.syncOptions);
  const { data } = useSectionsQuery({ limit: 100 });
  useEffect(() => {
    syncOptions('sections', (data?.data ?? []).map((s) => ({ value: String(s.id), label: s.name })));
  }, [data, syncOptions]);
  return null;
}

/** Teachers list (timetable of a teacher). */
function TeachersSync({ store }: SyncProps) {
  const syncOptions = useStore(store, (s) => s.syncOptions);
  const { data } = useTeachersQuery({ limit: 100 });
  useEffect(() => {
    syncOptions('teachers', (data?.data ?? []).map((t) => ({ value: String(t.id), label: t.user.fullName })));
  }, [data, syncOptions]);
  return null;
}

/** Exams of the chosen section (or the latest ones). */
function ExamsSync({ store }: SyncProps) {
  const sectionId = useStore(store, (s) => s.form.section);
  const syncOptions = useStore(store, (s) => s.syncOptions);
  const { data } = useExamsQuery({ sectionId: sectionId ? Number(sectionId) : undefined, limit: 100 });
  useEffect(() => {
    syncOptions(
      'exams',
      (data?.data ?? []).map((e) => ({ value: String(e.id), label: `${e.title} · ${e.subject.name} · ${e.section.name}` })),
    );
  }, [data, syncOptions]);
  return null;
}

/** Student search (debounced) + the label of a student given in the URL. */
function StudentsSync({ store }: SyncProps) {
  const search = useStore(store, (s) => s.studentSearch);
  const selectedId = useStore(store, (s) => s.form.student);
  const syncOptions = useStore(store, (s) => s.syncOptions);
  const setSelectedStudent = useStore(store, (s) => s.setSelectedStudent);
  const [debounced] = useDebouncedValue(search.trim(), 300);
  const { data } = useStudentsQuery({ search: debounced || undefined, limit: 20 });
  const prefilled = useStudentDetailQuery(Number(selectedId ?? 0));
  useEffect(() => {
    syncOptions('students', (data?.data ?? []).map((s) => ({ value: String(s.id), label: s.fullName })));
  }, [data, syncOptions]);
  useEffect(() => {
    if (prefilled.data) setSelectedStudent({ value: String(prefilled.data.id), label: prefilled.data.fullName });
  }, [prefilled.data, setSelectedStudent]);
  return null;
}

/**
 * ReportWorkspaceController
 *
 * One report (D3): parameters → server document → on-screen paper preview,
 * then print (A4 / PDF from the browser) or Excel. Contextual buttons open
 * it with parameters in the URL, and it then builds at once.
 */
export function ReportWorkspaceController({ reportKey, initialForm }: { reportKey: string; initialForm: ReportForm }) {
  const [store] = useState(() => createReportWorkspaceStore(reportKey, initialForm));
  const definition = useStore(store, (s) => s.definition);
  const kinds = new Set(definition?.params.map((p) => p.kind) ?? []);
  const needsReferences =
    kinds.has('status') ||
    kinds.has('city') ||
    kinds.has('school') ||
    kinds.has('bus') ||
    kinds.has('knowWay') ||
    kinds.has('customFilters');

  const handlePrint = useCallback(() => {
    const { submitted } = store.getState();
    if (submitted) window.open(reportPrintHref(reportKey, submitted), '_blank');
  }, [store, reportKey]);

  const handleExcel = useCallback(async () => {
    const { submitted, setExporting } = store.getState();
    if (!submitted) return;
    setExporting(true);
    try {
      await downloadReportExcel(reportKey, submitted);
      setExporting(false);
    } catch (err: unknown) {
      setExporting(false, getApiErrorMessage(err, labels.excelError));
    }
  }, [store, reportKey]);

  return (
    <ReportWorkspaceContext.Provider value={store}>
      <DefinitionSync store={store} />
      <DocumentSync store={store} />
      {(kinds.has('section') || kinds.has('exam')) && <SectionsSync store={store} />}
      {kinds.has('teacher') && <TeachersSync store={store} />}
      {kinds.has('exam') && <ExamsSync store={store} />}
      {kinds.has('student') && <StudentsSync store={store} />}
      {needsReferences && <ReferenceOptionsReportSync store={store} />}
      <ReportWorkspaceView onPrint={handlePrint} onExcel={handleExcel} />
    </ReportWorkspaceContext.Provider>
  );
}
