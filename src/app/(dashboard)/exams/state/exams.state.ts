import type { Exam } from '@/src/core/api';
import type { ExamForm } from '../utils/exams.utils';

export interface Option {
  value: string;
  label: string;
}

export interface ExamFilters {
  sectionId: string | null;
  examTypeId: string | null;
  from: string | null;
  to: string | null;
}

/**
 * ExamsState
 *
 * Exams page: filtered list, the create / edit drawer (with the section
 * plan subjects) and the delete modal (force when the exam has marks).
 */
export interface ExamsState {
  page: number;
  limit: number;
  search: string;
  filters: ExamFilters;
  data: Exam[];
  total: number;
  totalPages: number;
  isLoading: boolean;

  sectionOptions: Option[];
  examTypeOptions: Option[];
  subjectOptions: Option[];

  drawerOpened: boolean;
  editing: Exam | null;
  form: ExamForm;
  formErrors: Partial<Record<keyof ExamForm, string>>;
  generalError: string | null;
  isSubmitting: boolean;

  deleteTarget: Exam | null;
  deleteError: string | null;
  isDeleting: boolean;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setFilter: <K extends keyof ExamFilters>(key: K, value: ExamFilters[K]) => void;
  openCreate: () => void;
  openEdit: (exam: Exam) => void;
  closeDrawer: () => void;
  setField: <K extends keyof ExamForm>(key: K, value: ExamForm[K]) => void;
  setFormErrors: (errors: Partial<Record<keyof ExamForm, string>>) => void;
  setGeneralError: (error: string | null) => void;
  setIsSubmitting: (value: boolean) => void;
  openDelete: (exam: Exam) => void;
  closeDelete: () => void;
  setDeleteError: (error: string | null) => void;
  setIsDeleting: (value: boolean) => void;
  syncQueryData: (payload: { data: Exam[]; total: number; totalPages: number; isLoading: boolean }) => void;
  syncOptions: (key: 'sectionOptions' | 'examTypeOptions' | 'subjectOptions', options: Option[]) => void;
}
