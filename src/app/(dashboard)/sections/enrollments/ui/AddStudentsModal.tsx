'use client';

import { Alert, Center, Checkbox, Group, Loader, ScrollArea, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCircleCheck, IconUserPlus } from '@tabler/icons-react';
import { AppButton, AppInput, AppModal, StatusBadge } from '@/src/components/controllers';
import { useSectionStudentsMirror } from '../store/useSectionStudentsMirror';
import { inputText } from '../utils/section-students.utils';
import { sectionStudentsLabels as labels } from '../static-data/section-students.data';

export interface AddStudentsModalProps {
  onEnroll: () => Promise<void>;
}

/**
 * AddStudentsModal
 *
 * Multi-select of unassigned students (same branch, no enrollment this year)
 * with search; shows the enrolled / rejected summary. ZERO useState hooks.
 */
export function AddStudentsModal({ onEnroll }: AddStudentsModalProps) {
  const opened = useSectionStudentsMirror('addOpened');
  const closeAdd = useSectionStudentsMirror('closeAdd');
  const search = useSectionStudentsMirror('candidateSearch');
  const setSearch = useSectionStudentsMirror('setCandidateSearch');
  const candidates = useSectionStudentsMirror('candidates');
  const isLoading = useSectionStudentsMirror('isLoadingCandidates');
  const selectedIds = useSectionStudentsMirror('selectedIds');
  const toggleCandidate = useSectionStudentsMirror('toggleCandidate');
  const addError = useSectionStudentsMirror('addError');
  const addResult = useSectionStudentsMirror('addResult');
  const isEnrolling = useSectionStudentsMirror('isEnrolling');

  if (!opened) return null;

  return (
    <AppModal opened onClose={closeAdd} size="md">
      <AppModal.Header>
        <AppModal.Icon icon={<IconUserPlus size={22} />} />
        <AppModal.Title>{labels.addTitle}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <Stack gap="sm">
          <Text size="xs" c="var(--app-text-muted)">
            {labels.addDescription}
          </Text>
          {addError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {addError}
            </Alert>
          )}
          {addResult && (
            <Alert icon={<IconCircleCheck size={16} />} color={addResult.rejected.length ? 'yellow' : 'green'} variant="light" radius="md">
              <Stack gap={4}>
                <Text size="sm">{labels.enrolledSummary(addResult.enrolled)}</Text>
                {addResult.rejected.length > 0 && (
                  <>
                    <Text size="sm" fw={500}>{labels.rejectedTitle}</Text>
                    {addResult.rejected.map((r) => (
                      <Text key={r.name} size="xs">
                        {r.name}: {r.reason}
                      </Text>
                    ))}
                  </>
                )}
              </Stack>
            </Alert>
          )}
          <AppInput
            placeholder={labels.searchPlaceholder}
            value={search}
            onChange={(e: unknown) => setSearch(inputText(e))}
          />
          <ScrollArea.Autosize mah={320}>
            {isLoading && candidates.length === 0 ? (
              <Center py="md">
                <Loader size="sm" color="primary" />
              </Center>
            ) : candidates.length === 0 ? (
              <Text size="sm" c="var(--app-text-muted)" ta="center" py="md">
                {labels.noCandidates}
              </Text>
            ) : (
              <Stack gap={6}>
                {candidates.map((c) => (
                  <Checkbox
                    key={c.id}
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggleCandidate(c.id)}
                    label={c.familyName ? `${c.fullName} — ${c.familyName}` : c.fullName}
                  />
                ))}
              </Stack>
            )}
          </ScrollArea.Autosize>
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <Group gap="xs">
          {selectedIds.length > 0 && <StatusBadge size="xs">{labels.selectedCount(selectedIds.length)}</StatusBadge>}
        </Group>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{addResult ? labels.done : labels.cancel}</AppModal.Cancel>
          <AppButton
            onClick={onEnroll}
            loading={isEnrolling}
            disabled={selectedIds.length === 0}
            leftSection={<IconUserPlus size={16} />}
          >
            {labels.enrollButton(selectedIds.length)}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
