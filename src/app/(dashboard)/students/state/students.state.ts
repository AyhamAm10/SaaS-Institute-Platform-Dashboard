import { Student } from '@/src/core/api';

export interface StudentsState {
  students: Student[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  search: string;
  selectedBranchId: number | null;
  isLoading: boolean;

  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setSelectedBranchId: (branchId: number | null) => void;
  syncQueryData: (payload: {
    data: Student[];
    total: number;
    totalPages: number;
    isLoading: boolean;
  }) => void;
}
