'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { getApiErrorMessage, useExamSheetQuery, useSaveExamResultsMutation } from '@/src/core/api';
import { createMarkSheetStore, MarkSheetContext, MarkSheetStore } from './store/mark-sheet.store';
import { markError, toResultEntries } from '../../utils/exams.utils';
import { sheetLabels as labels } from '../../static-data/exams.data';
import { MarkSheetView } from './ui/MarkSheetView';

function SheetSync({ store, examId }: { store: MarkSheetStore; examId: number }) {
  const syncSheet = useStore(store, (s) => s.syncSheet);
  const { data, isLoading } = useExamSheetQuery(examId);
  useEffect(() => {
    syncSheet(data ?? null, isLoading);
  }, [data, isLoading, syncSheet]);
  return null;
}

/**
 * MarkSheetController
 *
 * Bulk mark entry of one exam (E9): eligible students, mark + absent per
 * student, live status and statistics, one save (server computes statuses).
 */
export function MarkSheetController({ examId }: { examId: number }) {
  const [store] = useState(createMarkSheetStore);
  const saveMutation = useSaveExamResultsMutation();

  const handleSave = useCallback(async () => {
    const { sheet, entries, setIsSaving, setNotice, syncSheet } = store.getState();
    if (!sheet) return;
    const maxMark = Number(sheet.exam.maxMark);
    if (Object.values(entries).some((e) => markError(e, maxMark))) {
      return setNotice({ tone: 'error', text: labels.fixErrors });
    }
    setIsSaving(true);
    try {
      const saved = await saveMutation.mutateAsync({
        id: examId,
        results: toResultEntries(entries),
      });
      syncSheet(saved, false, true);
      setNotice({ tone: 'success', text: labels.saved });
    } catch (err: unknown) {
      setNotice({
        tone: 'error',
        text: getApiErrorMessage(err, labels.saveError),
      });
    } finally {
      setIsSaving(false);
    }
  }, [store, examId, saveMutation]);

  return (
    <MarkSheetContext.Provider value={store}>
      <SheetSync store={store} examId={examId} />
      <MarkSheetView onSave={handleSave} />
    </MarkSheetContext.Provider>
  );
}
