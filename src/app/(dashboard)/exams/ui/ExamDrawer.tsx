'use client';

import { Alert, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconClipboardList } from '@tabler/icons-react';
import { AppButton, AppDatePicker, AppDrawer, AppInput, AppSelect } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { useExamsMirror } from '../store/exams.store';
import { examsLabels as labels } from '../static-data/exams.data';

/** Create / edit an exam. Section and subject are fixed once created. ZERO useState hooks. */
export function ExamDrawer({ onSubmit }: { onSubmit: () => Promise<void> }) {
  const opened = useExamsMirror('drawerOpened');
  const editing = useExamsMirror('editing');
  const form = useExamsMirror('form');
  const errors = useExamsMirror('formErrors');
  const generalError = useExamsMirror('generalError');
  const isSubmitting = useExamsMirror('isSubmitting');
  const setField = useExamsMirror('setField');
  const closeDrawer = useExamsMirror('closeDrawer');
  const sections = useExamsMirror('sectionOptions');
  const types = useExamsMirror('examTypeOptions');
  const subjects = useExamsMirror('subjectOptions');

  return (
    <AppDrawer opened={opened} onClose={closeDrawer} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconClipboardList size={20} />} color="primary" />
        <Stack gap={2} style={{ flex: 1 }}>
          <AppDrawer.Title>{editing ? labels.editTitle : labels.createTitle}</AppDrawer.Title>
          <AppDrawer.Description>{labels.drawerDescription}</AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <Stack gap="md">
          {generalError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {generalError}
            </Alert>
          )}
          <AppSelect
            label={labels.section}
            data={sections}
            value={form.sectionId}
            onChange={(v: string | null) => setField('sectionId', v)}
            error={errors.sectionId}
            disabled={Boolean(editing)}
            searchable
            required
          />
          <AppSelect
            label={labels.subject}
            description={labels.subjectHint}
            placeholder={form.sectionId ? undefined : labels.pickSectionFirst}
            data={
              editing
                ? [
                    {
                      value: String(editing.subjectId),
                      label: editing.subject.name,
                    },
                  ]
                : subjects
            }
            value={form.subjectId}
            onChange={(v: string | null) => setField('subjectId', v)}
            error={errors.subjectId}
            disabled={Boolean(editing) || !form.sectionId}
            required
          />
          {editing && (
            <Text size="xs" c="var(--app-text-muted)">
              {labels.lockedHint}
            </Text>
          )}
          <AppInput
            label={labels.examTitle}
            value={form.title}
            onChange={(e: unknown) => setField('title', inputText(e))}
            error={errors.title}
            required
          />
          <SimpleGrid cols={2} spacing="sm">
            <AppSelect
              label={labels.examType}
              data={types}
              value={form.examTypeId}
              onChange={(v: string | null) => setField('examTypeId', v)}
              clearable
            />
            <AppDatePicker
              label={labels.examDate}
              value={form.examDate || null}
              onChange={(v) => setField('examDate', v ?? '')}
              error={errors.examDate}
              required
            />
            <AppInput
              type="number"
              label={labels.maxMark}
              value={form.maxMark}
              onChange={(e: unknown) => setField('maxMark', inputText(e))}
              error={errors.maxMark}
              required
            />
            <AppInput
              type="number"
              label={labels.passMark}
              value={form.passMark}
              onChange={(e: unknown) => setField('passMark', inputText(e))}
              error={errors.passMark}
              required
            />
          </SimpleGrid>
        </Stack>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>{labels.cancel}</AppDrawer.Cancel>
          <AppButton onClick={onSubmit} loading={isSubmitting}>
            {labels.save}
          </AppButton>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
