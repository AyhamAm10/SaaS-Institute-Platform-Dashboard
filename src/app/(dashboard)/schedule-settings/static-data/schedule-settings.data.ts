import { WEEK_DAY_NAMES, WEEK_ORDER } from '@/src/core/format';

/** Working-day toggles in the institute's week order (Saturday first). */
export const DAYS_OF_WEEK = WEEK_ORDER.map((value) => ({ value, label: WEEK_DAY_NAMES[value] }));
