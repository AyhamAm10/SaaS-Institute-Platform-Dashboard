import { Family, StudentField } from '@/src/core/api';
import type {
  StudentReferenceField,
  StudentReferenceValues,
} from '../../utils/student-references.utils';

export interface NewFamilyForm {
  familyName: string;
  fatherName: string;
  motherName: string;
  phone: string;
}

export interface StudentRegistrationState {
  // Navigation
  activeStep: number;
  isSubmitting: boolean;
  stepErrors: Record<number, string | null>;

  // Step 1: Family
  familyMode: 'search' | 'create';
  selectedFamily: Family | null;
  familySearchQuery: string;
  newFamily: NewFamilyForm;

  // Step 2: Basic & Academic Details
  fullName: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  branchId: number | null;
  sectionId: number | null;
  academicYearId: number | null;
  references: StudentReferenceValues;

  // Step 3: Dynamic Custom Fields
  customFields: Record<string, any>;

  // Actions
  setActiveStep: (step: number) => void;
  setFamilyMode: (mode: 'search' | 'create') => void;
  setSelectedFamily: (family: Family | null) => void;
  setFamilySearchQuery: (query: string) => void;
  setNewFamilyField: (field: keyof NewFamilyForm, value: string) => void;
  setStudentField: (
    field: 'fullName' | 'birthDate' | 'gender' | 'branchId' | 'sectionId' | 'academicYearId',
    value: string | number | null,
  ) => void;
  setCustomFieldValue: (fieldName: string, value: unknown) => void;
  setReference: (field: StudentReferenceField, value: number | null) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setStepError: (step: number, error: string | null) => void;
  validateCurrentStep: (configuredFields?: StudentField[]) => boolean;
  reset: () => void;
}
