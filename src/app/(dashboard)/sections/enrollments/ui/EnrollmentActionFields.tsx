'use client';

import { Checkbox, Group, Stack, Text } from '@mantine/core';
import { AppButton, AppInput, AppSelect } from '@/src/components/controllers';
import { useSectionStudentsMirror } from '../store/useSectionStudentsMirror';
import { inputText } from '../utils/section-students.utils';
import { sectionStudentsLabels as labels } from '../static-data/section-students.data';

/** Target section of a transfer (same year and branch). ZERO useState hooks. */
export function TransferFields() {
  const options = useSectionStudentsMirror('transferOptions');
  const value = useSectionStudentsMirror('transferSectionId');
  const setValue = useSectionStudentsMirror('setTransferSectionId');

  return (
    <Stack gap="xs">
      <AppSelect
        label={labels.transferSection}
        placeholder={options.length === 0 ? labels.noOtherSections : undefined}
        data={options.map((o) => ({ value: String(o.id), label: o.name }))}
        value={value}
        onChange={(val: string | null) => setValue(val)}
        searchable
      />
      <Text size="xs" c="var(--app-text-muted)">
        {labels.transferHint}
      </Text>
    </Stack>
  );
}

/** Reason of a status change (required when withdrawing). ZERO useState hooks. */
export function ReasonField({ required }: { required: boolean }) {
  const reason = useSectionStudentsMirror('reason');
  const setReason = useSectionStudentsMirror('setReason');

  return (
    <AppInput
      type="textarea"
      label={labels.reasonLabel}
      placeholder={labels.reasonPlaceholder}
      value={reason}
      onChange={(e: unknown) => setReason(inputText(e))}
      required={required}
      rows={3}
    />
  );
}

/** Subject subset of the student, picked from the section plan. ZERO useState hooks. */
export function SubjectsFields() {
  const plan = useSectionStudentsMirror('sectionSubjects');
  const choice = useSectionStudentsMirror('subjectChoice');
  const toggleSubject = useSectionStudentsMirror('toggleSubject');
  const selectAll = useSectionStudentsMirror('selectAllSubjects');
  const takesAll = choice.length === 0;

  if (plan.length === 0) {
    return (
      <Text size="sm" c="var(--app-text-muted)">
        {labels.noPlanSubjects}
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <Text size="xs" c="var(--app-text-muted)" style={{ flex: 1 }}>
          {labels.subjectsAllHint}
        </Text>
        <AppButton size="xs" variant={takesAll ? 'accent' : 'outline'} onClick={selectAll}>
          {labels.selectAll}
        </AppButton>
      </Group>
      <Stack gap={6}>
        {plan.map((subject) => (
          <Checkbox
            key={subject.id}
            label={subject.name}
            checked={takesAll || choice.includes(subject.id)}
            onChange={() => toggleSubject(subject.id)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
