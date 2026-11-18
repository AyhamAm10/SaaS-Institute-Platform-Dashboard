import { Alert, Center, Checkbox, Group, Loader, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconEye, IconEyeOff, IconTrash } from '@tabler/icons-react';
import { AppButton, AppIconButton, AppInput, AppSurface, StatusBadge } from '@/src/components/controllers';
import type { StudentNote } from '@/src/core/api';
import { formatDate, inputText } from '@/src/core/format';
import { profileLabels as labels } from '../static-data/student-profile.data';

export interface NoteDraft {
  body: string;
  visibleToFamily: boolean;
}

interface Props {
  notes: StudentNote[];
  isLoading: boolean;
  canWrite: boolean;
  canDelete: boolean;
  draft: NoteDraft;
  error: string | null;
  isSaving: boolean;
  onDraftChange: (patch: Partial<NoteDraft>) => void;
  onSubmit: () => void;
  onToggleVisible: (note: StudentNote) => void;
  onDelete: (note: StudentNote) => void;
}

/** Notes for the family: write a note and read the earlier ones. Props only. */
export function StudentNotesTab({
  notes,
  isLoading,
  canWrite,
  canDelete,
  draft,
  error,
  isSaving,
  onDraftChange,
  onSubmit,
  onToggleVisible,
  onDelete,
}: Props) {
  return (
    <Stack gap="md">
      {canWrite && (
        <AppSurface level={2} radius="lg" padding="md">
          <Stack gap="sm">
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
                {error}
              </Alert>
            )}
            <AppInput
              type="textarea"
              label={labels.noteLabel}
              placeholder={labels.notePlaceholder}
              value={draft.body}
              onChange={(e: unknown) => onDraftChange({ body: inputText(e) })}
              rows={3}
              maxLength={1000}
            />
            <Group justify="space-between" wrap="wrap">
              <Checkbox
                label={labels.visibleToFamily}
                checked={draft.visibleToFamily}
                onChange={(e) => onDraftChange({ visibleToFamily: e.currentTarget.checked })}
              />
              <AppButton onClick={onSubmit} loading={isSaving}>
                {labels.addNote}
              </AppButton>
            </Group>
          </Stack>
        </AppSurface>
      )}

      {isLoading ? (
        <Center py="xl">
          <Loader size="sm" color="primary" />
        </Center>
      ) : notes.length === 0 ? (
        <Text ta="center" py="lg" c="var(--app-text-muted)">
          {labels.noNotes}
        </Text>
      ) : (
        notes.map((note) => (
          <AppSurface key={note.id} level={1} radius="lg" padding="md">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={4} style={{ minWidth: 0 }}>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {note.body}
                </Text>
                <Group gap="xs">
                  <Text size="xs" c="var(--app-text-muted)">
                    {formatDate(note.createdAt.slice(0, 10))}
                    {note.author ? ` · ${note.author}` : ''}
                  </Text>
                  <StatusBadge tone={note.visibleToFamily ? 'success' : 'neutral'} size="xs">
                    {note.visibleToFamily ? labels.noteVisible : labels.noteInternal}
                  </StatusBadge>
                </Group>
              </Stack>
              {canWrite && (
                <Group gap={4} wrap="nowrap">
                  <AppIconButton
                    size="sm"
                    variant="ghost"
                    label={note.visibleToFamily ? labels.hideFromFamily : labels.showToFamily}
                    onClick={() => onToggleVisible(note)}
                  >
                    {note.visibleToFamily ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                  </AppIconButton>
                  {canDelete && (
                    <AppIconButton size="sm" variant="danger" label={labels.deleteNote} onClick={() => onDelete(note)}>
                      <IconTrash size={15} />
                    </AppIconButton>
                  )}
                </Group>
              )}
            </Group>
          </AppSurface>
        ))
      )}
    </Stack>
  );
}
