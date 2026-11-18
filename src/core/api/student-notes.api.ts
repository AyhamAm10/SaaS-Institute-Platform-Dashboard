import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

/** Notes for the families (ملاحظات للأهالي), written on the student page. */
export interface StudentNote {
  id: number;
  studentId: number;
  body: string;
  /** Shown in the parents app; false keeps the note internal. */
  visibleToFamily: boolean;
  createdAt: string;
  updatedAt: string;
  author: string | null;
}

export interface StudentNotePayload {
  body?: string;
  visibleToFamily?: boolean;
}

export const studentNotesKeys = {
  list: (studentId: number) => ['student-notes', studentId] as const,
};

export function useStudentNotesQuery(studentId: number) {
  return useQuery({
    queryKey: studentNotesKeys.list(studentId),
    queryFn: async () => (await apiClient.get<StudentNote[]>(`/students/${studentId}/notes`)).data,
    enabled: studentId > 0,
  });
}

function useNotesMutation<TVars>(studentId: number, fn: (vars: TVars) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studentNotesKeys.list(studentId) }),
  });
}

export const useCreateStudentNoteMutation = (studentId: number) =>
  useNotesMutation(studentId, (payload: StudentNotePayload) =>
    apiClient.post<StudentNote>(`/students/${studentId}/notes`, payload),
  );

export const useUpdateStudentNoteMutation = (studentId: number) =>
  useNotesMutation(studentId, ({ id, payload }: { id: number; payload: StudentNotePayload }) =>
    apiClient.patch<StudentNote>(`/student-notes/${id}`, payload),
  );

export const useDeleteStudentNoteMutation = (studentId: number) =>
  useNotesMutation(studentId, (id: number) => apiClient.delete(`/student-notes/${id}`));
