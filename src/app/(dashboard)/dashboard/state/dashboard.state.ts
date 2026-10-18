export type DashboardPeriod = 'semester' | 'month' | 'today';

export interface DashboardState {
  // Period filter
  selectedPeriod: DashboardPeriod;
  setSelectedPeriod: (period: DashboardPeriod) => void;

  // Selected stage filter for distribution
  selectedStageFilter: string;
  setSelectedStageFilter: (stage: string) => void;
}
