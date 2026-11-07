'use client';

import { useStudentsMirror } from '../store/useStudentsMirror';
import { StudentFinanceController } from '../finance/StudentFinanceController';

/** Mounts the finance drawer controller for the selected student (one store per student). */
export function StudentFinanceSlot() {
  const student = useStudentsMirror('financeStudent');
  const closeFinance = useStudentsMirror('closeFinance');
  if (!student) return null;
  return <StudentFinanceController key={student.id} student={student} onClose={closeFinance} />;
}
