'use client';

import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { StatusBadge } from '@/src/components/controllers';
import { formatDate } from '@/src/core/format';
import { RESULT_BADGES, resultsLabels as labels } from '../static-data/portal.data';
import { percentText } from '../utils/portal.utils';

/** One exam of one subject, flattened for the table. */
export interface ResultRow {
  key: string;
  subject: string;
  title: string;
  date: string;
  score: number | null;
  max: number;
  percent: number | null;
  status: string;
}

const badge = (status: string) => RESULT_BADGES[status] ?? { label: status, tone: 'neutral' as const };

export function getResultsColumns(): DataModuleColumn<ResultRow>[] {
  return [
    { key: 'subject', title: labels.colSubject, exportValue: (r) => r.subject, exportKind: 'text', render: (r) => r.subject },
    { key: 'exam', title: labels.colExam, exportValue: (r) => r.title, exportKind: 'text', render: (r) => r.title },
    { key: 'date', title: labels.colDate, exportValue: (r) => r.date, exportKind: 'date', render: (r) => formatDate(r.date) },
    {
      key: 'mark',
      title: labels.colMark,
      exportValue: (r) => (r.score === null ? '' : `${r.score}/${r.max}`),
      exportKind: 'text',
      render: (r) => (r.score === null ? '—' : `${r.score} / ${r.max}`),
    },
    { key: 'percent', title: labels.colPercent, exportValue: (r) => percentText(r.percent), exportKind: 'text', render: (r) => percentText(r.percent) },
    {
      key: 'status',
      title: labels.colStatus,
      exportValue: (r) => badge(r.status).label,
      exportKind: 'text',
      render: (r) => (
        <StatusBadge tone={badge(r.status).tone} size="xs">
          {badge(r.status).label}
        </StatusBadge>
      ),
    },
  ];
}
