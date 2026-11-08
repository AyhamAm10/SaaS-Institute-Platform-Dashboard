import { StudentField } from '@/src/core/api';

export interface StudentFieldsState {
  fields: StudentField[];
  isLoading: boolean;
  search: string;

  isDrawerOpen: boolean;
  selectedField: StudentField | null;

  formName: string;
  formLabel: string;
  formType: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'BOOLEAN';
  formOptionsText: string;
  formOptions: string[];
  /** Option being typed in the options editor (role.md §12.1). */
  optionDraft: string;
  formIsRequired: boolean;
  formDisplayInReport: boolean;
  formSortOrder: number;
  isSubmitting: boolean;

  setSearch: (search: string) => void;
  syncFields: (fields: StudentField[], isLoading: boolean) => void;
  openCreateDrawer: () => void;
  openEditDrawer: (field: StudentField) => void;
  closeDrawer: () => void;
  setFormField: (field: string, value: unknown) => void;
  addOption: (option: string) => void;
  removeOption: (index: number) => void;
  setOptionDraft: (value: string) => void;
  /** Adds the typed option (trimmed, no duplicates) and clears the draft. */
  commitOptionDraft: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
}
