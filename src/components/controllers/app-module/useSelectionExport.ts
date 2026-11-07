'use client';

import { useStore } from 'zustand';
import { downloadDocumentExcel } from '@/src/core/api';
import { useAppModuleStoreContext } from './store/app-module.store';
import { buildSelectionDocument } from './init/selection-document';

export function useSelectionExport() {
  const store = useAppModuleStoreContext();
  const selection = useStore(store, (s) => s.selection);
  const isExporting = useStore(store, (s) => s.isExporting);
  const exportError = useStore(store, (s) => s.exportError);
  const exportTitle = useStore(store, (s) => s.exportTitle);
  const setExporting = store.getState().setExporting;
  const setExportError = store.getState().setExportError;

  const handlePrint = () => {
    if (selection.rows.length === 0) return;
    const title = exportTitle || 'السجلات المحددة';
    const now = new Date().toISOString();
    const doc = buildSelectionDocument(title, selection.rows, selection.columns, now);
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    try {
      localStorage.setItem(`print-selection:${id}`, JSON.stringify(doc));
      window.open(`/reports/selection/print?doc=${encodeURIComponent(id)}&autoprint=1`, '_blank');
    } catch {
      setExportError('تعذر فتح صفحة الطباعة');
    }
  };

  const handleExcel = async () => {
    if (selection.rows.length === 0 || isExporting) return;
    setExporting(true);
    setExportError(null);
    try {
      const title = exportTitle || 'السجلات المحددة';
      const now = new Date().toISOString();
      const doc = buildSelectionDocument(title, selection.rows, selection.columns, now);
      await downloadDocumentExcel(doc);
    } catch {
      setExportError('حدث خطأ أثناء تصدير ملف Excel');
    } finally {
      setExporting(false);
    }
  };

  return {
    rowsCount: selection.rows.length,
    hasColumns: selection.columns.length > 0,
    isExporting,
    exportError,
    handlePrint,
    handleExcel,
  };
}
