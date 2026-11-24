'use client';

import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { StatusBadge } from '@/src/components/controllers';
import type { PortalAttendanceMonth } from '@/src/core/api';
import { formatDate } from '@/src/core/format';
import { ATTENDANCE_BADGES, attendanceLabels as labels } from '../static-data/portal.data';
import { clockOf } from '../utils/portal.utils';

type Day = PortalAttendanceMonth['days'][number];

export function getAttendanceColumns(timeZone: string): DataModuleColumn<Day>[] {
  return [
    { key: 'date', title: labels.colDate, exportValue: (d) => d.date, exportKind: 'date', render: (d) => formatDate(d.date) },
    {
      key: 'status',
      title: labels.colStatus,
      exportValue: (d) => ATTENDANCE_BADGES[d.status].label,
      exportKind: 'text',
      render: (d) => (
        <StatusBadge tone={ATTENDANCE_BADGES[d.status].tone} size="xs">
          {ATTENDANCE_BADGES[d.status].label}
        </StatusBadge>
      ),
    },
    { key: 'in', title: labels.colIn, exportValue: (d) => clockOf(d.checkInAt, timeZone), exportKind: 'text', render: (d) => clockOf(d.checkInAt, timeZone) },
    { key: 'out', title: labels.colOut, exportValue: (d) => clockOf(d.checkOutAt, timeZone), exportKind: 'text', render: (d) => clockOf(d.checkOutAt, timeZone) },
    { key: 'note', title: labels.colNote, exportValue: (d) => d.note ?? '', exportKind: 'text', render: (d) => d.note ?? '—' },
  ];
}
