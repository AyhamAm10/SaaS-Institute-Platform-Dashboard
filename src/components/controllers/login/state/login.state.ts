export interface LoginState {
  phone: string;
  password: string;
  instituteCode: string;
  errorMessage: string | null;
  isSubmitting: boolean;

  // Actions
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;
  setInstituteCode: (instituteCode: string) => void;
  setErrorMessage: (message: string | null) => void;
  submit: () => Promise<void>;
}

export interface LoginInitialProps {
  initialError?: string | null;
  onSuccess?: () => void;
}
