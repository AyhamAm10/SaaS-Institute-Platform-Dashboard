import type { Family } from '@/src/core/api';

/** The parents' jobs and own mobiles (the family phone stays the guardian login). */
export interface ParentDetails {
  fatherJob: string;
  motherJob: string;
  fatherPhone: string;
  motherPhone: string;
}

export const PARENT_DETAIL_FIELDS: (keyof ParentDetails)[] = ['fatherJob', 'motherJob', 'fatherPhone', 'motherPhone'];

export const EMPTY_PARENT_DETAILS: ParentDetails = { fatherJob: '', motherJob: '', fatherPhone: '', motherPhone: '' };

export function parentDetailsFrom(family: Family): ParentDetails {
  return {
    fatherJob: family.fatherJob ?? '',
    motherJob: family.motherJob ?? '',
    fatherPhone: family.fatherPhone ?? '',
    motherPhone: family.motherPhone ?? '',
  };
}

/** Trimmed values for the API (an empty text clears the field on update). */
export function parentDetailsPayload(values: ParentDetails): ParentDetails {
  return {
    fatherJob: values.fatherJob.trim(),
    motherJob: values.motherJob.trim(),
    fatherPhone: values.fatherPhone.trim(),
    motherPhone: values.motherPhone.trim(),
  };
}
