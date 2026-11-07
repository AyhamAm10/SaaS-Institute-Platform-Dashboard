'use client';

import { Alert, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconEdit, IconNotes } from '@tabler/icons-react';
import { AppButton, AppInput, AppModal, AppSelect } from '@/src/components/controllers';
import type { AttendanceStatus } from '@/src/core/api';
import { inputText } from '@/src/core/format';
import { useAttendanceMirror } from '../store/attendance.store';
import type { AttendanceActions } from '../useAttendanceActions';
import { ATTENDANCE_STATUS_OPTIONS, attendanceLabels as labels } from '../static-data/attendance.data';

function ModalError() {
  const error = useAttendanceMirror('modalError');
  if (!error) return null;
  return (
    <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
      {error}
    </Alert>
  );
}

/** Excuse and correction modals of the attendance page. ZERO useState hooks. */
export function AttendanceModals({ actions }: { actions: AttendanceActions }) {
  const excuseRow = useAttendanceMirror('excuseRow');
  const excuseNote = useAttendanceMirror('excuseNote');
  const setExcuseNote = useAttendanceMirror('setExcuseNote');
  const editRecord = useAttendanceMirror('editRecord');
  const form = useAttendanceMirror('editForm');
  const setField = useAttendanceMirror('setEditField');
  const isSubmitting = useAttendanceMirror('isSubmitting');
  const closeModals = useAttendanceMirror('closeModals');
  const day = useAttendanceMirror('day');

  if (excuseRow) {
    return (
      <AppModal opened onClose={closeModals} size="sm">
        <AppModal.Header>
          <AppModal.Icon icon={<IconNotes size={22} />} />
          <AppModal.Title>{labels.excuseTitle}</AppModal.Title>
          <AppModal.Close />
        </AppModal.Header>
        <AppModal.Content>
          <Stack gap="md">
            <Text size="sm" fw={500}>
              {excuseRow.student.fullName}
            </Text>
            <ModalError />
            <AppInput type="textarea" label={labels.excuseNote} value={excuseNote} onChange={(e: unknown) => setExcuseNote(inputText(e))} rows={2} />
          </Stack>
        </AppModal.Content>
        <AppModal.Footer>
          <AppModal.FooterEnd>
            <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
            <AppButton onClick={actions.submitExcuse} loading={isSubmitting}>
              {labels.save}
            </AppButton>
          </AppModal.FooterEnd>
        </AppModal.Footer>
      </AppModal>
    );
  }

  if (!editRecord) return null;
  const name = day?.rows.find((r) => r.student.id === editRecord.studentId)?.student.fullName;

  return (
    <AppModal opened onClose={closeModals} size="md">
      <AppModal.Header>
        <AppModal.Icon icon={<IconEdit size={22} />} />
        <AppModal.Title>{labels.editTitle}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>
      <AppModal.Content>
        <Stack gap="md">
          {name && (
            <Text size="sm" fw={500}>
              {name}
            </Text>
          )}
          <ModalError />
          <SimpleGrid cols={2} spacing="sm">
            <AppInput label={labels.checkInTime} placeholder="08:00" value={form.checkIn} onChange={(e: unknown) => setField('checkIn', inputText(e))} />
            <AppInput label={labels.checkOutTime} placeholder="14:00" value={form.checkOut} onChange={(e: unknown) => setField('checkOut', inputText(e))} />
          </SimpleGrid>
          <AppSelect
            label={labels.status}
            data={ATTENDANCE_STATUS_OPTIONS}
            value={form.status}
            onChange={(v: string | null) => v && setField('status', v as AttendanceStatus)}
          />
          <AppInput label={labels.note} value={form.note} onChange={(e: unknown) => setField('note', inputText(e))} />
          <Text size="xs" c="var(--app-text-muted)">
            {labels.editHint}
          </Text>
        </Stack>
      </AppModal.Content>
      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          <AppButton onClick={actions.submitEdit} loading={isSubmitting}>
            {labels.save}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
