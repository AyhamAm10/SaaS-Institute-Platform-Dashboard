import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface InstituteProfile {
  id: number;
  code: string;
  name: string;
  phone: string;
  address: string;
  timezone: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateInstituteProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  timezone?: string;
}

export const instituteProfileKeys = {
  all: ['institute-profile'] as const,
  profile: () => [...instituteProfileKeys.all, 'profile'] as const,
};

export async function getInstituteProfile(): Promise<InstituteProfile> {
  const { data } = await apiClient.get<InstituteProfile>('/institute/profile');
  return data;
}

export async function updateInstituteProfile(
  payload: UpdateInstituteProfilePayload,
): Promise<InstituteProfile> {
  const { data } = await apiClient.patch<InstituteProfile>(
    '/institute/profile',
    payload,
  );
  return data;
}

export function useInstituteProfileQuery() {
  return useQuery({
    queryKey: instituteProfileKeys.profile(),
    queryFn: getInstituteProfile,
  });
}

export function useUpdateInstituteProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateInstituteProfilePayload) =>
      updateInstituteProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(instituteProfileKeys.profile(), updated);
    },
  });
}

