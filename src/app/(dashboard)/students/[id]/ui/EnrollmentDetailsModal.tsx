import { Alert, Checkbox, Divider, SimpleGrid, Stack } from '@mantine/core';
import { IconAlertCircle, IconId } from '@tabler/icons-react';
import { AppButton, AppDatePicker, AppInput, AppModal, AppSelect } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import {
  type EnrollmentDetailsForm,
  type EnrollmentTextField,
  enrollmentDetailsLabels as labels,
} from '../static-data/enrollment-details.data';

interface Option {
  value: string;
  label: string;
}

interface Props {
  title: string | null;
  values: EnrollmentDetailsForm;
  situations: Option[];
  languages: Option[];
  error: string | null;
  isSubmitting: boolean;
  onChange: (patch: Partial<EnrollmentDetailsForm>) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const TEXTS: { field: EnrollmentTextField; label: string }[] = [
  { field: 'certificateName', label: labels.certificateName },
  { field: 'certificateNumber', label: labels.certificateNumber },
  { field: 'certificateSource', label: labels.certificateSource },
  { field: 'certificateGrade', label: labels.certificateGrade },
];

/** The yearly data of one enrollment: situation, origin and exam candidacy. Props only. */
export function EnrollmentDetailsModal({ title, values, situations, languages, error, isSubmitting, onChange, onClose, onSubmit }: Props) {
  if (!title) return null;
  const text = (field: EnrollmentTextField, label: string) => (
    <AppInput key={field} label={label} value={values[field]} onChange={(e: unknown) => onChange({ [field]: inputText(e) })} />
  );
  return (
    <AppModal opened onClose={onClose} size="lg">
      <AppModal.Header>
        <AppModal.Icon icon={<IconId size={22} />} />
        <AppModal.Title>{`${labels.title} - ${title}`}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>
      <AppModal.Content>
        <Stack gap="md">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <AppSelect
              label={labels.situation}
              placeholder={labels.pick}
              data={situations}
              value={values.situationId}
              onChange={(val: string | null) => onChange({ situationId: val })}
              clearable
            />
            {text('previousSchool', labels.previousSchool)}
            {text('transferredFrom', labels.transferredFrom)}
          </SimpleGrid>
          <Divider label={labels.candidacy} labelPosition="center" />
          <Checkbox
            label={labels.isCandidate}
            checked={values.isExamCandidate}
            onChange={(e) => onChange({ isExamCandidate: e.currentTarget.checked })}
          />
          {values.isExamCandidate && (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <AppSelect
                label={labels.examLanguage}
                placeholder={labels.examLanguageDefault}
                data={languages}
                value={values.examLanguageId}
                onChange={(val: string | null) => onChange({ examLanguageId: val })}
                clearable
              />
              {text('candidateNumber', labels.candidateNumber)}
              {TEXTS.map(({ field, label }) => text(field, label))}
              <AppDatePicker
                label={labels.certificateDate}
                value={values.certificateDate}
                onChange={(val: string | null) => onChange({ certificateDate: val })}
                clearable
              />
            </SimpleGrid>
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
