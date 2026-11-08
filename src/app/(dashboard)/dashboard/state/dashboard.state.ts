import type { DashboardOverview } from '@/src/core/api';

export interface DashboardState {
  // Real numbers of the home page (GET /dashboard/overview)
  overview: DashboardOverview | null;
  isLoading: boolean;
  syncOverview: (overview: DashboardOverview | null, isLoading: boolean) => void;
}
