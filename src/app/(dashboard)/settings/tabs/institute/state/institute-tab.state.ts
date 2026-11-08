import { InstituteProfile } from '@/src/core/api';

export interface InstituteFormState {
  name: string;
  phone: string;
  address: string;
  timezone: string;
}

export interface InstituteTabState {
  profile: InstituteProfile | null;
  form: InstituteFormState;
  initialTimezone: string;
  isLoading: boolean;
  isSubmitting: boolean;
  generalError: string | null;
  generalSuccess: string | null;
  fieldErrors: Partial<Record<keyof InstituteFormState, string>>;

  syncProfile: (profile: InstituteProfile | null, isLoading: boolean) => void;
  setFormField: <K extends keyof InstituteFormState>(field: K, value: InstituteFormState[K]) => void;
  setFieldError: (field: keyof InstituteFormState, error: string | null) => void;
  setGeneralError: (error: string | null) => void;
  setGeneralSuccess: (success: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;
}

