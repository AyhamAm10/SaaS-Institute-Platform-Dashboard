'use client';

import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useStudentContractsQuery, useStudentFinancialSummaryQuery } from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import {
  createStudentFinanceStore,
  StudentFinanceContext,
  StudentFinanceStore,
} from './store/student-finance.store';
import { FinanceStudent } from './state/student-finance.state';
import { useFinanceActions } from './useFinanceActions';
import { StudentFinanceDrawer } from './ui/StudentFinanceDrawer';
import { StudentFinancePanel } from './ui/StudentFinancePanel';

/** Contracts + summary of the student → store. */
function FinanceSync({ store }: { store: StudentFinanceStore }) {
  const studentId = useStore(store, (s) => s.student.id);
  const syncFinance = useStore(store, (s) => s.syncFinance);
  const contracts = useStudentContractsQuery(studentId);
  const summary = useStudentFinancialSummaryQuery(studentId);

  useEffect(() => {
    syncFinance(contracts.data ?? [], summary.data ?? [], contracts.isLoading);
  }, [contracts.data, contracts.isLoading, summary.data, syncFinance]);

  return null;
}

export interface StudentFinanceControllerProps {
  student: FinanceStudent;
  /** Drawer mode (students list). Omit with `embedded` for the profile tab. */
  onClose?: () => void;
  /** Render the panel inline (student profile) instead of a drawer. */
  embedded?: boolean;
}

/**
 * StudentFinanceController
 *
 * "المالية" drawer of one student (E10): summary per currency, contract per
 * enrollment with its installments and payments, and the contract / payment
 * modals. Own isolated store per student (role.md §3).
 */
export function StudentFinanceController({ student, onClose, embedded }: StudentFinanceControllerProps) {
  const { can } = useAuth();
  const [store] = useState(() => createStudentFinanceStore(student, can(PERMISSIONS.feesManage)));
  const actions = useFinanceActions(store);

  return (
    <StudentFinanceContext.Provider value={store}>
      <FinanceSync store={store} />
      {embedded || !onClose ? (
        <StudentFinancePanel actions={actions} />
      ) : (
        <StudentFinanceDrawer onClose={onClose} actions={actions} />
      )}
    </StudentFinanceContext.Provider>
  );
}
