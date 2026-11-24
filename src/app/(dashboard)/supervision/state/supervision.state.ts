import type { MySupervision } from '@/src/core/api';

/** The signed-in supervisor's own exams (today and later), as the server sends them. */
export interface SupervisionState {
  /** The institute's today (YYYY-MM-DD): the server's, not the browser's. */
  today: string;
  data: MySupervision[];
  isLoading: boolean;
  syncQueryData: (payload: { today: string; data: MySupervision[]; isLoading: boolean }) => void;
}
