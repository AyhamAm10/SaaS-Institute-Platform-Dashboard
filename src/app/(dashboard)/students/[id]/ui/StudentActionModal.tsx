import { Alert, Stack } from '@mantine/core';
import { IconAlertCircle, IconCalendarOff, IconSchool } from '@tabler/icons-react';
import { AppButton, AppDatePicker, AppInput, AppModal, AppSelect } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { profileLabels as labels } from '../static-data/student-profile.data';

export type StudentActionKind = 'enroll' | 'excuse';

export interface StudentActionValues {
  sectionId: string | null;
  date: string | null;
  note: string;
}

interface Props {
  kind: StudentActionKind | null;
  values: StudentActionValues;
  sectionOptions: { value: string; label: string }[];
  error: string | null;
  isSubmitting: boolean;
  onChange: (patch: Partial<StudentActionValues>) => void;
  onClose: () => void;
  onSubmit: () => void;
}

/** Quick-action form of the student page: enroll in a section or excuse an absence. Props only. */
export function StudentActionModal({
  kind,
  values,
  sectionOptions,
  error,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: Props) {
  if (!kind) return null;
  const enroll = kind === 'enroll';
  return (
    <AppModal opened onClose={onClose} size="md">
      <AppModal.Header>
        <AppModal.Icon icon={enroll ? <IconSchool size={22} /> : <IconCalendarOff size={22} />} />
        <AppModal.Title>{enroll ? labels.enrollTitle : labels.excuseTitle}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>
      <AppModal.Content>
        <Stack gap="sm">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          {enroll ? (
            <AppSelect
              label={labels.section}
              data={sectionOptions}
              value={values.sectionId}
              onChange={(v: string | null) => onChange({ sectionId: v })}
              searchable
              required
            />
          ) : (
            <>
              <AppDatePicker
                label={labels.excuseDate}
                value={values.date}
                onChange={(v) => onChange({ date: v })}
                required
              />
              <AppInput
                label={labels.note}
                value={values.note}
                onChange={(e: unknown) => onChange({ note: inputText(e) })}
              />
            </>
          )}
        </Stack>
      </AppModal.Content>
      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          <AppButton onClick={onSubmit} loading={isSubmitting}>
            {labels.save}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
