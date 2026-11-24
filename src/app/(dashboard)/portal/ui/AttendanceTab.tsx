'use client';

import { useMemo } from 'react';
import { SimpleGrid, Stack } from '@mantine/core';
import { AppSelect, InfoTile } from '@/src/components/controllers';
import { usePortalMirror } from '../store/portal.store';
import { attendanceLabels as labels, portalLabels } from '../static-data/portal.data';
import { monthOptions, percentText } from '../utils/portal.utils';
import { getAttendanceColumns } from './AttendanceColumns';
import { PortalTable } from './PortalTable';

const MONTHS = [{ value: '', label: labels.currentMonth }, ...monthOptions(12).slice(1)];

/** One month of his attendance: counts, the rate and day by day with the entry and exit times. ZERO useState hooks. */
export function AttendanceTab() {
  const slot = usePortalMirror('slots').attendance;
  const month = usePortalMirror('month');
  const setMonth = usePortalMirror('setMonth');
  const timeZone = usePortalMirror('timeZone');
  const columns = useMemo(() => getAttendanceColumns(timeZone), [timeZone]);
  const data = slot.data?.days ?? [];
  const c = slot.data?.counts;

  return (
    <Stack gap="md">
      <AppSelect label={labels.month} data={MONTHS} value={month} onChange={(v: string | null) => setMonth(v ?? '')} w={240} />
      <SimpleGrid cols={{ base: 2, sm: 5 }} spacing="md">
        <InfoTile label={labels.present} value={c?.present ?? 0} tone="success" />
        <InfoTile label={labels.late} value={c?.late ?? 0} tone="brand" />
        <InfoTile label={labels.absent} value={c?.absent ?? 0} tone="danger" />
        <InfoTile label={labels.excused} value={c?.excused ?? 0} tone="neutral" />
        <InfoTile label={labels.rate} value={percentText(slot.data?.ratePercent)} tone="ink" />
      </SimpleGrid>
      <PortalTable
        title={portalLabels.tabAttendance}
        data={data}
        columns={columns}
        isLoading={slot.isLoading}
        emptyMessage={labels.empty}
        keyOf={(d) => d.date}
      />
    </Stack>
  );
}
