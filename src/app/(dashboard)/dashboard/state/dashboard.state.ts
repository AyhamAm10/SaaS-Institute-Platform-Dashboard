import type { DashboardOverview } from '@/src/core/api';

export type DashboardPeriod = 'semester' | 'month' | 'today';

export interface DashboardState {
  // Real numbers of the home page (GET /dashboard/overview)
  overview: DashboardOverview | null;
  isLoading: boolean;
  syncOverview: (overview: DashboardOverview | null, isLoading: boolean) => void;

  // Period filter
  selectedPeriod: DashboardPeriod;
  setSelectedPeriod: (period: DashboardPeriod) => void;

  // Selected stage filter for distribution
  selectedStageFilter: string;
  setSelectedStageFilter: (stage: string) => void;
}
