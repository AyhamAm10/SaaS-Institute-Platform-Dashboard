import { GuardianRelationship, MobileAccountRole } from '@/src/core/api';

export const MOBILE_ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'جميع الأدوار' },
  { value: 'FAMILY', label: 'أولياء الأمور' },
  { value: 'STUDENT', label: 'الطلاب' },
];

export const GUARDIAN_RELATIONSHIP_OPTIONS: { value: GuardianRelationship; label: string }[] = [
  { value: 'FATHER', label: 'أب' },
  { value: 'MOTHER', label: 'أم' },
  { value: 'GUARDIAN', label: 'ولي أمر' },
  { value: 'OTHER', label: 'آخر' },
];

export const RELATIONSHIP_LABELS: Record<GuardianRelationship, string> = {
  FATHER: 'أب',
  MOTHER: 'أم',
  GUARDIAN: 'ولي أمر',
  OTHER: 'آخر',
};

export const MOBILE_ROLE_LABELS: Record<MobileAccountRole, string> = {
  FAMILY: 'ولي أمر',
  STUDENT: 'طالب',
};

