import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export type ScheduleSlotType = 'LESSON' | 'BREAK';

export interface ScheduleSlot {
  type: ScheduleSlotType;
  periodNumber?: number;
  name?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface BreakConfig {
  name: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleConfig {
  id: number;
  instituteId: number;
  workingDays: number[];
  dayStartTime: string;
  dayEndTime: string;
  periodDurationMinutes: number;
  breaks: BreakConfig[];
  slots: ScheduleSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateScheduleConfigPayload {
  workingDays?: number[];
  dayStartTime?: string;
  dayEndTime?: string;
  periodDurationMinutes?: number;
  breaks?: BreakConfig[];
}

// --------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------

export async function getScheduleConfig(): Promise<ScheduleConfig> {
  const { data } = await apiClient.get<ScheduleConfig>('/institute-schedule-config');
  return data;
}

export async function updateScheduleConfig(
  payload: UpdateScheduleConfigPayload,
): Promise<ScheduleConfig> {
  const { data } = await apiClient.put<ScheduleConfig>(
    '/institute-schedule-config',
    payload,
  );
  return data;
}

// --------------------------------------------------------------------------
// React Query Hooks
// --------------------------------------------------------------------------

export const scheduleConfigKeys = {
  all: ['schedule-config'] as const,
  current: () => [...scheduleConfigKeys.all, 'current'] as const,
};

export function useScheduleConfigQuery() {
  return useQuery({
    queryKey: scheduleConfigKeys.current(),
    queryFn: getScheduleConfig,
  });
}

export function useUpdateScheduleConfigMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateScheduleConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleConfigKeys.all });
    },
  });
}
