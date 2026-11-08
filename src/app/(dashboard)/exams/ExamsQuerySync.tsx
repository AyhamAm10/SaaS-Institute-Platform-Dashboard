'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import {
  examTypesResource,
  useDashboardOverviewQuery,
  useExamsQuery,
  useSectionSubjectsQuery,
  useSectionsQuery,
} from '@/src/core/api';
import { ExamsStore } from './store/exams.store';

type SyncProps = { store: ExamsStore };

export function QuerySync({ store }: SyncProps) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const f = useStore(store, (s) => s.filters);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);
  const { data, isLoading } = useExamsQuery({
    page,
    limit,
    search: search.trim() || undefined,
    sectionId: f.sectionId ? Number(f.sectionId) : undefined,
    examTypeId: f.examTypeId ? Number(f.examTypeId) : undefined,
    from: f.from ?? undefined,
    to: f.to ?? undefined,
  });

  useEffect(() => {
    syncQueryData({
      data: data?.data ?? [],
      total: data?.total ?? 0,
      totalPages: data?.totalPages ?? 1,
      isLoading,
    });
  }, [data, isLoading, syncQueryData]);
  return null;
}

/** KPI / chart numbers of the page (role.md §12.1: no query in ui/). */
export function OverviewSync({ store }: { store: ExamsStore }) {
  const syncOverview = useStore(store, (s) => s.syncOverview);
  const { data } = useDashboardOverviewQuery();
  useEffect(() => {
    syncOverview(data ?? null);
  }, [data, syncOverview]);
  return null;
}

/** Sections and exam types (filters + drawer). */
export function OptionsSync({ store }: SyncProps) {
  const syncOptions = useStore(store, (s) => s.syncOptions);
  const sections = useSectionsQuery({ limit: 100 });
  const types = examTypesResource.useList({ limit: 100 });

  useEffect(() => {
    syncOptions(
      'sectionOptions',
      (sections.data?.data ?? []).map((s) => ({
        value: String(s.id),
        label: s.name,
      })),
    );
  }, [sections.data, syncOptions]);
  useEffect(() => {
    syncOptions(
      'examTypeOptions',
      (types.data?.data ?? []).map((t) => ({
        value: String(t.id),
        label: t.name,
      })),
    );
  }, [types.data, syncOptions]);
  return null;
}

/** Plan subjects of the section chosen in the drawer. */
export function SubjectsSync({ store }: SyncProps) {
  const sectionId = useStore(store, (s) => s.form.sectionId);
  const syncOptions = useStore(store, (s) => s.syncOptions);
  const { data } = useSectionSubjectsQuery(Number(sectionId ?? 0));

  useEffect(() => {
    syncOptions(
      'subjectOptions',
      (data ?? []).map((p) => ({
        value: String(p.subject.id),
        label: p.subject.name,
      })),
    );
  }, [data, syncOptions]);
  return null;
}
