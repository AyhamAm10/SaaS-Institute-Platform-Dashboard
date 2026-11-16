/** Props of the forced password change (the server has marked the account as "default password"). */
export interface PasswordChangeInitialProps {
  onSuccess?: () => void | Promise<void>;
}

export interface PasswordChangeState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  errorMessage: string | null;
  isSubmitting: boolean;

  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  submit: () => Promise<void>;
}
