import { BreakConfig, ScheduleSlot } from '@/src/core/api';

export interface ScheduleSettingsFormState {
  workingDays: number[];
  dayStartTime: string;
  dayEndTime: string;
  periodDurationMinutes: number;
  breaks: BreakConfig[];
}

export interface ScheduleSettingsState {
  // ── Form State ──
  form: ScheduleSettingsFormState;
  formErrors: Partial<Record<keyof ScheduleSettingsFormState, string>>;
  generalError: string | null;
  generalSuccess: string | null;
  isSubmitting: boolean;
  isLoading: boolean;

  // ── Server-derived Live Slots Preview ──
  slots: ScheduleSlot[];

  // ── Actions ──
  setWorkingDays: (days: number[]) => void;
  setDayStartTime: (time: string) => void;
  setDayEndTime: (time: string) => void;
  setPeriodDurationMinutes: (minutes: number) => void;
  addBreak: (item: BreakConfig) => void;
  removeBreak: (index: number) => void;
  updateBreak: (index: number, item: BreakConfig) => void;

  setFieldError: (field: keyof ScheduleSettingsFormState, error: string | null) => void;
  setGeneralError: (error: string | null) => void;
  setGeneralSuccess: (message: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;

  syncConfigData: (payload: {
    workingDays: number[];
    dayStartTime: string;
    dayEndTime: string;
    periodDurationMinutes: number;
    breaks: BreakConfig[];
    slots: ScheduleSlot[];
    isLoading: boolean;
  }) => void;
}
