'use client';

export interface AddedQualification {
  academicBranchId: number;
  academicBranchName: string;
  subjectId: number;
  subjectName: string;
}

export interface AddedAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface TeacherRegistrationState {
  activeStep: number;
  isSubmitting: boolean;
  stepErrors: Record<number, string | null>;

  // Step 1: Basic Info
  fullName: string;
  phone: string;
  password: string;
  specialization: string;
  branchIds: number[];
  isActive: boolean;

  // Step 2: Qualifications
  qualifications: AddedQualification[];
  stagedAcademicBranchId?: number;
  stagedSubjectId?: number;

  // Step 3: Availability
  availabilities: AddedAvailability[];
  stagedDayOfWeek: string;
  stagedStartTime: string;
  stagedEndTime: string;

  // Actions
  setActiveStep: (step: number) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setStepError: (step: number, error: string | null) => void;

  setBasicField: <K extends 'fullName' | 'phone' | 'password' | 'specialization' | 'isActive'>(
    field: K,
    value: TeacherRegistrationState[K],
  ) => void;
  setBranchIds: (branchIds: number[]) => void;

  setStagedAcademicBranchId: (id?: number) => void;
  setStagedSubjectId: (id?: number) => void;
  addQualification: (academicBranchName: string, subjectName: string) => boolean;
  removeQualification: (index: number) => void;

  setStagedDayOfWeek: (day: string) => void;
  setStagedStartTime: (time: string) => void;
  setStagedEndTime: (time: string) => void;
  addAvailability: () => boolean;
  removeAvailability: (index: number) => void;

  validateCurrentStep: () => boolean;
  resetForm: () => void;
}
