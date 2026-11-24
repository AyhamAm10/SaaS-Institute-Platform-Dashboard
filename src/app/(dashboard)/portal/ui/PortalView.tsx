'use client';

import { Center, Loader } from '@mantine/core';
import { IconUserHeart } from '@tabler/icons-react';
import { AppEmptyState, DetailPage, StatusBadge } from '@/src/components/controllers';
import { AttendanceSync, FinanceSync, NotesSync, OverviewSync, ResultsSync, TimetableSync } from '../PortalQuerySync';
import { usePortalMirror } from '../store/portal.store';
import { portalLabels as labels } from '../static-data/portal.data';
import { AttendanceTab } from './AttendanceTab';
import { ChildSwitcher } from './ChildSwitcher';
import { FinanceTab } from './FinanceTab';
import { NotesTab } from './NotesTab';
import { ResultsTab } from './ResultsTab';
import { TimetableTab } from './TimetableTab';
import { TodayTab } from './TodayTab';

/**
 * PortalView
 *
 * One detail page for the chosen child, on the same DetailPage as the staff pages: his name and
 * section, the child switcher (a guardian with several children), and the tabs. A student has no
 * finance or notes tab (the server refuses them too). ZERO useState hooks.
 */
export function PortalView() {
  const me = usePortalMirror('me');
  const meLoading = usePortalMirror('meLoading');
  const childId = usePortalMirror('childId');
  const child = me?.children.find((c) => c.id === childId) ?? null;

  if (meLoading) {
    return (
      <Center py={80}>
        <Loader size="sm" color="primary" />
      </Center>
    );
  }
  if (!me || !child) {
    return <AppEmptyState title={labels.noChildren} description={labels.noChildrenHint} icon={<IconUserHeart size={28} />} />;
  }

  const isFamily = me.role === 'FAMILY';
  const tabs = [
    { value: 'today', label: labels.tabToday, content: <><OverviewSync /><TodayTab /></> },
    { value: 'attendance', label: labels.tabAttendance, content: <><AttendanceSync /><AttendanceTab /></> },
    { value: 'timetable', label: labels.tabTimetable, content: <><TimetableSync /><TimetableTab /></> },
    { value: 'results', label: labels.tabResults, content: <><ResultsSync /><ResultsTab /></> },
    ...(isFamily
      ? [
          { value: 'finance', label: labels.tabFinance, content: <><FinanceSync /><FinanceTab /></> },
          { value: 'notes', label: labels.tabNotes, content: <><NotesSync /><NotesTab /></> },
        ]
      : []),
  ];

  return (
    <DetailPage
      title={child.fullName}
      description={[child.section?.name, child.branch.name].filter(Boolean).join(' · ')}
      icon={<IconUserHeart size={22} />}
      badge={child.statusName ? <StatusBadge size="sm">{child.statusName}</StatusBadge> : undefined}
      breadcrumbs={[{ label: isFamily ? labels.title : labels.titleStudent }]}
      actions={<ChildSwitcher />}
      tabs={tabs}
    />
  );
}
