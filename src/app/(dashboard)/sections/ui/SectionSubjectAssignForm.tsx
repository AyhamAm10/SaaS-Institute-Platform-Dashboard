'use client';

import { useMemo } from 'react';
import { Alert, Group, Stack } from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { AppButton, AppDrawer, AppInput, AppSelect, StatusBadge } from '@/src/components/controllers';
import { Teacher } from '@/src/core/api';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { sectionDetailsLabels as labels } from '../static-data/sections.data';

export interface SectionSubjectAssignFormProps {
  onAssign: () => Promise<void>;
}

/**
 * SectionSubjectAssignForm
 *
 * Assigns a subject (with optional teacher and weekly periods) to the section.
 * Fields are stacked full-width so labels and options are never truncated.
 * ZERO useState — form state lives in the Sections store (useSectionsMirror).
 */
export function SectionSubjectAssignForm({ onAssign }: SectionSubjectAssignFormProps) {
  const details = useSectionsMirror('detailsData');
  const sectionSubjects = useSectionsMirror('sectionSubjectsData');
  const instituteSubjects = useSectionsMirror('instituteSubjectsData');
  const teachersData = useSectionsMirror('teachersData');
  const assignSubjectId = useSectionsMirror('assignSubjectId');
  const assignWeeklyPeriods = useSectionsMirror('assignWeeklyPeriods');
  const assignTeacherId = useSectionsMirror('assignTeacherId');
  const setAssignSubjectId = useSectionsMirror('setAssignSubjectId');
  const setAssignWeeklyPeriods = useSectionsMirror('setAssignWeeklyPeriods');
  const setAssignTeacherId = useSectionsMirror('setAssignTeacherId');
  const assignSubjectError = useSectionsMirror('assignSubjectError');
  const setAssignSubjectError = useSectionsMirror('setAssignSubjectError');
  const isAssigningSubject = useSectionsMirror('isAssigningSubject');

  // ── Subjects not yet in the section plan ──
  const subjectOptions = useMemo(() => {
    const assigned = new Set(sectionSubjects?.map((s) => s.subjectId) ?? []);
    return (instituteSubjects ?? [])
      .filter((s) => !assigned.has(s.id))
      .map((s) => ({ value: String(s.id), label: s.name }));
  }, [sectionSubjects, instituteSubjects]);

  // ── Teachers qualified for the selected subject in the section's academic branch.
  // Mirrors the backend rule (teacher_assignments), so every option can be saved.
  const teacherOptions = useMemo(() => {
    if (!assignSubjectId || !details) return [];
    const subId = Number(assignSubjectId);
    const qualified = (teachersData ?? []).filter((t: Teacher) =>
      t.assignments?.some((a) => a.subjectId === subId && a.academicBranchId === details.academicBranchId),
    );
    return qualified.map((t: Teacher) => ({
      value: String(t.id),
      label: `${t.user?.fullName}${t.specialization ? ` — ${t.specialization}` : ''}`,
    }));
  }, [assignSubjectId, details, teachersData]);

  const noSubjectsLeft = subjectOptions.length === 0;
  const teacherPlaceholder = !assignSubjectId
    ? labels.teacherPlaceholderNoSubject
    : teacherOptions.length === 0
      ? labels.teacherPlaceholderNone
      : labels.teacherPlaceholder;

  return (
    <AppDrawer.Section
      title={labels.assignTitle}
      description={noSubjectsLeft ? labels.allAssigned : labels.assignDescription}
      action={
        !noSubjectsLeft && (
          <StatusBadge tone="brand" size="xs">
            {subjectOptions.length} {labels.availableCount}
          </StatusBadge>
        )
      }
    >
      <Stack gap="md">
        {assignSubjectError && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="light"
            radius="md"
            withCloseButton
            onClose={() => setAssignSubjectError(null)}
          >
            {assignSubjectError}
          </Alert>
        )}

        <AppSelect
          label={labels.subjectLabel}
          placeholder={labels.subjectPlaceholder}
          data={subjectOptions}
          value={assignSubjectId}
          onChange={(val: string | null) => {
            setAssignSubjectId(val);
            setAssignTeacherId(null);
          }}
          disabled={noSubjectsLeft}
          searchable
          clearable
        />

        <AppSelect
          label={labels.teacherLabel}
          description={labels.teacherDescription}
          placeholder={teacherPlaceholder}
          data={teacherOptions}
          value={assignTeacherId}
          onChange={(val: string | null) => setAssignTeacherId(val)}
          disabled={!assignSubjectId || teacherOptions.length === 0}
          searchable
          clearable
        />

        <Group align="flex-end" gap="sm" wrap="nowrap">
          <AppInput
            type="number"
            label={labels.periodsLabel}
            min={1}
            max={20}
            value={assignWeeklyPeriods || 2}
            onChange={(val) => {
              const parsed = Number(val);
              setAssignWeeklyPeriods(Number.isNaN(parsed) || parsed < 1 ? 1 : parsed);
            }}
            disabled={noSubjectsLeft}
            style={{ flex: 1 }}
          />
          <AppButton
            leftSection={<IconPlus size={16} />}
            onClick={onAssign}
            loading={isAssigningSubject}
            disabled={!assignSubjectId}
            style={{ flex: 1 }}
          >
            {labels.assignButton}
          </AppButton>
        </Group>
      </Stack>
    </AppDrawer.Section>
  );
}
