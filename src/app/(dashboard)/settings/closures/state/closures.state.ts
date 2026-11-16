import type { Closure } from '@/src/core/api';
import type { ClosureForm, ClosureFormErrors } from '../utils/closures.utils';

export interface ClosureOption {
  value: string;
  label: string;
}

/**
 * ClosuresState
 *
 * Closures (holidays) tab: the institute's closures, the create / edit drawer
 * (branch and section options come from the header context) and the delete modal.
 */
export interface ClosuresState {
  data: Closure[];
  isLoading: boolean;
  branches: ClosureOption[];
  sections: ClosureOption[];
  canManage: boolean;
  today: string;

  drawerOpened: boolean;
  editing: Closure | null;
  form: ClosureForm;
  formErrors: ClosureFormErrors;
  generalError: string | null;
  isSubmitting: boolean;

  deleteTarget: Closure | null;
  deleteError: string | null;
  isDeleting: boolean;

  openCreate: () => void;
  openEdit: (closure: Closure) => void;
  closeDrawer: () => void;
  setField: <K extends keyof ClosureForm>(key: K, value: ClosureForm[K]) => void;
  toggleSection: (id: number) => void;
  setFormErrors: (errors: ClosureFormErrors) => void;
  setGeneralError: (error: string | null) => void;
  setIsSubmitting: (value: boolean) => void;
  openDelete: (closure: Closure) => void;
  closeDelete: () => void;
  setDeleteError: (error: string | null) => void;
  setIsDeleting: (value: boolean) => void;
  syncQueryData: (payload: Partial<Pick<ClosuresState, 'data' | 'isLoading' | 'branches' | 'sections' | 'canManage' | 'today'>>) => void;
}
