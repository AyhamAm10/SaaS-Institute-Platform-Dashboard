import { Teacher } from '@/src/core/api';

export interface TeachersTabState {
  data: Teacher[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  isLoading: boolean;

  // Password reset modal
  passwordModalOpened: boolean;
  selectedTeacher: Teacher | null;
  newPassword: string;
  passwordError: string | null;
  isPasswordSubmitting: boolean;

  // Actions
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  syncData: (payload: { data: Teacher[]; total: number; totalPages: number; isLoading: boolean }) => void;
  openPasswordModal: (teacher: Teacher) => void;
  closePasswordModal: () => void;
  setNewPassword: (password: string) => void;
  setPasswordError: (error: string | null) => void;
  setIsPasswordSubmitting: (submitting: boolean) => void;
}

