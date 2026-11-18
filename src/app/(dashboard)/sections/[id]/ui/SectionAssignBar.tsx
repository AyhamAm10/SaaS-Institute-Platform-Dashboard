import { Alert, Group } from '@mantine/core';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import { AppButton, AppInput, AppSelect } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { sectionDetailLabels as labels } from '../static-data/section-detail.data';

export interface AssignValues {
  subjectId: string | null;
  teacherId: string | null;
  periods: string;
}

interface Props {
  values: AssignValues;
  subjectOptions: { value: string; label: string }[];
  teacherOptions: { value: string; label: string }[];
  error: string | null;
  isSubmitting: boolean;
  onChange: (patch: Partial<AssignValues>) => void;
  onSubmit: () => void;
}

/** Add a subject (with its teacher and weekly periods) to the section plan. Props only. */
export function SectionAssignBar({ values, subjectOptions, teacherOptions, error, isSubmitting, onChange, onSubmit }: Props) {
  return (
    <>
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md" mb="sm">
          {error}
        </Alert>
      )}
      <Group gap="xs" align="flex-end" wrap="wrap" mb="md">
        <AppSelect
          label={labels.subject}
          data={subjectOptions}
          value={values.subjectId}
          onChange={(v: string | null) => onChange({ subjectId: v, teacherId: null })}
          searchable
          w={200}
        />
        <AppSelect
          label={labels.teacher}
          placeholder={values.subjectId ? undefined : labels.pickSubjectFirst}
          data={teacherOptions}
          value={values.teacherId}
          onChange={(v: string | null) => onChange({ teacherId: v })}
          disabled={!values.subjectId}
          clearable
          searchable
          w={220}
        />
        <AppInput
          type="number"
          label={labels.periods}
          value={values.periods}
          onChange={(e: unknown) => onChange({ periods: inputText(e) })}
          w={100}
        />
        <AppButton leftSection={<IconPlus size={16} />} onClick={onSubmit} loading={isSubmitting}>
          {labels.addSubject}
        </AppButton>
      </Group>
    </>
  );
}
