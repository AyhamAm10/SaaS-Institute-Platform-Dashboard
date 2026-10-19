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
  formIsRequired: boolean;
  formDisplayInReport: boolean;
  formSortOrder: number;
  isSubmitting: boolean;

  setSearch: (search: string) => void;
  syncFields: (fields: StudentField[], isLoading: boolean) => void;
  openCreateDrawer: () => void;
  openEditDrawer: (field: StudentField) => void;
  closeDrawer: () => void;
  setFormField: (field: string, value: any) => void;
  addOption: (option: string) => void;
  removeOption: (index: number) => void;
  setSubmitting: (isSubmitting: boolean) => void;
}
