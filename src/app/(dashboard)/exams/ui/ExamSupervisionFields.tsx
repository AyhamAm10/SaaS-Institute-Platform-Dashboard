'use client';

import { Checkbox, Stack, Text } from '@mantine/core';
import { useExamsMirror } from '../store/exams.store';
import { examsLabels as labels } from '../static-data/exams.data';

/**
 * ExamSupervisionFields
 *
 * "تحتاج مراقبة" and, when ticked, the supervisors to choose from. Administration only
 * (the drawer shows it only for them). ZERO useState hooks.
 */
export function ExamSupervisionFields() {
  const form = useExamsMirror('form');
  const options = useExamsMirror('supervisorOptions');
  const setField = useExamsMirror('setField');

  return (
    <Stack gap="xs">
      <Checkbox
        label={labels.needsSupervision}
        description={labels.needsSupervisionHint}
        checked={form.needsSupervision}
        onChange={(e) => setField('needsSupervision', e.currentTarget.checked)}
      />
      {form.needsSupervision &&
        (options.length === 0 ? (
          <Text size="xs" c="var(--app-text-muted)">
            {labels.noSupervisors}
          </Text>
        ) : (
          <Checkbox.Group label={labels.supervisors} value={form.supervisorIds} onChange={(v) => setField('supervisorIds', v)}>
            <Stack gap={6} mt="xs">
              {options.map((o) => (
                <Checkbox key={o.value} value={o.value} label={o.label} />
              ))}
            </Stack>
          </Checkbox.Group>
        ))}
    </Stack>
  );
}
