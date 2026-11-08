'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import { useStudentFieldsQuery } from '@/src/core/api';
import { useStudentReferenceOptions } from '../../students/utils/useStudentReferenceOptions';
import type { ReportWorkspaceStore } from './store/report-workspace.store';

/**
 * ReferenceOptionsReportSync
 *
 * Synchronizes reference data (statuses, cities, schools, buses, knowWays)
 * and custom fields into the report workspace store for directory / student reports.
 */
export function ReferenceOptionsReportSync({ store }: { store: ReportWorkspaceStore }) {
  const syncOptions = useStore(store, (s) => s.syncOptions);
  const syncStudentFields = useStore(store, (s) => s.syncStudentFields);
  const options = useStudentReferenceOptions();
  const { data: fields } = useStudentFieldsQuery();

  useEffect(() => {
    syncOptions('statuses', options.statuses);
    syncOptions('cities', options.cities);
    syncOptions('schools', options.schools);
    syncOptions('buses', options.buses);
    syncOptions('knowWays', options.knowWays);
  }, [options, syncOptions]);

  useEffect(() => {
    syncStudentFields((fields ?? []).filter((f) => f.isActive));
  }, [fields, syncStudentFields]);

  return null;
}

