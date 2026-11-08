export type MobileAccountRole = 'FAMILY' | 'STUDENT';
export type MobileAccountStatus = 'ACTIVE' | 'DEACTIVATED';
export type GuardianRelationship = 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';

export interface MobileAccountItem {
  id: number;
  fullName: string;
  phone: string;
  role: MobileAccountRole;
  status: MobileAccountStatus;
  createdAt: string;
  familyId?: number | null;
  familyName?: string | null;
  relationship?: GuardianRelationship | null;
  studentId?: number | null;
  studentName?: string | null;
}

export interface EligibleStudentItem {
  id: number;
  fullName: string;
  familyId: number;
  familyName: string;
  suggestedPhone?: string | null;
}

export interface CreateGuardianAccountPayload {
  familyId: number;
  fullName: string;
  phone: string;
  relationship: GuardianRelationship;
  password: string;
}

export interface CreateStudentAccountPayload {
  studentId: number;
  phone: string;
  password: string;
}

export interface MobileAccountQueryParams {
  page?: number;
  limit?: number;
  role?: MobileAccountRole;
  search?: string;
}

