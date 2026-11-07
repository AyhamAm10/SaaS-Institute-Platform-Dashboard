import type { EnrollmentStatus, SectionRosterItem } from '@/src/core/api';

/** The section whose roster is shown (the drawer's section). */
export interface RosterSection {
  id: number;
  academicYearId: number;
  branchId: number;
}

export interface CandidateStudent {
  id: number;
  fullName: string;
  familyName: string | null;
}

export interface NamedOption {
  id: number;
  name: string;
}

export type EnrollmentActionType = 'transfer' | 'withdraw' | 'complete' | 'reactivate' | 'subjects';
export type RosterStatusFilter = EnrollmentStatus | 'ALL';

export interface EnrollResultSummary {
  enrolled: number;
  rejected: { name: string; reason: string }[];
}

/**
 * SectionStudentsState
 *
 * Roster of one section with the add-students modal and one per-student
 * action modal (transfer / status / subjects). role.md §3: isolated store.
 */
export interface SectionStudentsState {
  section: RosterSection;
  roster: SectionRosterItem[];
  isLoading: boolean;
  statusFilter: RosterStatusFilter;

  // Add students modal
  addOpened: boolean;
  candidateSearch: string;
  candidates: CandidateStudent[];
  isLoadingCandidates: boolean;
  selectedIds: number[];
  addError: string | null;
  addResult: EnrollResultSummary | null;
  isEnrolling: boolean;

  // Per-student action modal
  actionType: EnrollmentActionType | null;
  actionItem: SectionRosterItem | null;
  transferSectionId: string | null;
  transferOptions: NamedOption[];
  reason: string;
  sectionSubjects: NamedOption[];
  subjectChoice: number[];
  actionError: string | null;
  isSubmitting: boolean;

  // Actions
  setStatusFilter: (filter: RosterStatusFilter) => void;
  openAdd: () => void;
  closeAdd: () => void;
  setCandidateSearch: (search: string) => void;
  toggleCandidate: (id: number) => void;
  setAddError: (error: string | null) => void;
  setAddResult: (result: EnrollResultSummary | null) => void;
  setIsEnrolling: (value: boolean) => void;

  openAction: (type: EnrollmentActionType, item: SectionRosterItem) => void;
  closeAction: () => void;
  setTransferSectionId: (id: string | null) => void;
  setReason: (reason: string) => void;
  toggleSubject: (id: number) => void;
  selectAllSubjects: () => void;
  setActionError: (error: string | null) => void;
  setIsSubmitting: (value: boolean) => void;

  syncRoster: (roster: SectionRosterItem[], isLoading: boolean) => void;
  syncCandidates: (candidates: CandidateStudent[], isLoading: boolean) => void;
  syncTransferOptions: (options: NamedOption[]) => void;
  syncSectionSubjects: (subjects: NamedOption[]) => void;
}
