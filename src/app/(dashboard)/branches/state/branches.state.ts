import { Branch } from '@/src/core/api';

export interface BranchesState {
  // Data mirror
  branches: Branch[];
  isLoading: boolean;
  search: string;

  // Drawer & Selection
  isDrawerOpen: boolean;
  selectedBranch: Branch | null;

  // Form Fields
  formName: string;
  formPhone: string;
  formAddress: string;
  isSubmitting: boolean;

  // Actions
  setSearch: (search: string) => void;
  syncBranches: (branches: Branch[], isLoading: boolean) => void;
  openCreateDrawer: () => void;
  openEditDrawer: (branch: Branch) => void;
  closeDrawer: () => void;
  setFormField: (field: 'formName' | 'formPhone' | 'formAddress', value: string) => void;
  setSubmitting: (submitting: boolean) => void;
  resetForm: () => void;
}
