import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { sectionsKeys } from './sections.api';
import { studentsKeys } from './students.api';

/**
 * The yearly data of an enrollment (PATCH /enrollments/:id/details): the student's
 * situation this year, his origin and his official exam candidacy. `null` clears a value.
 */
export interface EnrollmentDetailsPayload {
  situationId?: number | null;
  previousSchool?: string | null;
  transferredFrom?: string | null;
  isExamCandidate?: boolean;
  /** Empty: the server uses the student's foreign language for a new candidate. */
  examLanguageId?: number | null;
  candidateNumber?: string | null;
  certificateName?: string | null;
  certificateNumber?: string | null;
  /** YYYY-MM-DD */
  certificateDate?: string | null;
  certificateSource?: string | null;
  certificateGrade?: string | null;
}

async function updateEnrollmentDetails(id: number, payload: EnrollmentDetailsPayload) {
  const { data } = await apiClient.patch(`/enrollments/${id}/details`, payload);
  return data;
}

export function useUpdateEnrollmentDetailsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EnrollmentDetailsPayload }) =>
      updateEnrollmentDetails(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentsKeys.all });
      queryClient.invalidateQueries({ queryKey: sectionsKeys.all });
    },
  });
}
