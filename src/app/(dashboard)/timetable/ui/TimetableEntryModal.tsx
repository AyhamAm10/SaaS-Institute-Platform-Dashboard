'use client';

import { Alert, Group, Modal, Paper, Stack, Switch, Text } from '@mantine/core';
import { IconAlertCircle, IconCalendarEvent, IconDeviceFloppy } from '@tabler/icons-react';
import { AppSelect } from '@/src/components/controllers';
import { useTimetableMirror } from '../store/useTimetableMirror';
import { weekDayName } from '@/src/core/format';
import { AppButton } from '@/src/components/controllers/button';

interface TimetableEntryModalProps {
  onSave: () => void;
}

export function TimetableEntryModal({ onSave }: TimetableEntryModalProps) {
  const entryModalOpened = useTimetableMirror('entryModalOpened');
  const entryForm = useTimetableMirror('entryForm');
  const entryFormError = useTimetableMirror('entryFormError');
  const isSavingEntry = useTimetableMirror('isSavingEntry');

  const closeEntryModal = useTimetableMirror('closeEntryModal');
  const setEntryFormField = useTimetableMirror('setEntryFormField');

  // Options
  const sectionSubjects = useTimetableMirror('sectionSubjects');
  const teachers = useTimetableMirror('teachers');
  const rooms = useTimetableMirror('rooms');

  const subjectOptions = (sectionSubjects || []).map((ss) => ({
    value: String(ss.subjectId),
    label: `${ss.subject.name} (${ss.weeklyPeriods || 1} حصص أسبوعيا)`,
  }));

  const teacherOptions = teachers.map((t) => ({
    value: String(t.id),
    label: `${t.user.fullName} ${t.specialization ? `(${t.specialization})` : ''}`,
  }));

  const roomOptions = [
    { value: '', label: 'بدون قاعة محددة (افتراضية)' },
    ...rooms.map((r) => ({
      value: String(r.id),
      label: `${r.name} (${r.capacity} مقعد)`,
    })),
  ];

  const isEdit = Boolean(entryForm.id);

  return (
    <Modal
      opened={entryModalOpened}
      onClose={closeEntryModal}
      radius="xl"
      title={
        <Group gap="xs">
          <IconCalendarEvent size={20} />
          <Text fw={500} size="md">
            {isEdit ? 'تعديل الحصة الدراسية' : 'إضافة حصة دراسية جديدة'}
          </Text>
        </Group>
      }
      centered
    >
      <Stack gap="md">
        {entryFormError && (
          <Alert icon={<IconAlertCircle size={18} />} color="red" radius="xl" title="تعذر الحفظ">
            {entryFormError}
          </Alert>
        )}

        {/* Slot Info Preview */}
        <Paper p="xs" radius="md" withBorder bg="var(--app-subtle)">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              اليوم: {weekDayName(entryForm.dayOfWeek)}
            </Text>
            <Text size="xs" fw={500} dir="ltr">
              الحصة {entryForm.periodNumber} ({entryForm.startTime} - {entryForm.endTime})
            </Text>
          </Group>
        </Paper>

        <AppSelect
          label="المادة الدراسية"
          placeholder="اختر المادة المقررة للشعبة"
          data={subjectOptions}
          value={entryForm.subjectId ? String(entryForm.subjectId) : null}
          onChange={(val: string | null) => {
            const sId = val ? Number(val) : null;
            setEntryFormField('subjectId', sId);
            // Pre-select default teacher if assigned in section subject
            const matchingSubject = sectionSubjects?.find((s) => s.subjectId === sId);
            if (matchingSubject?.teacherId) {
              setEntryFormField('teacherId', matchingSubject.teacherId);
            }
          }}
          required
        />

        <AppSelect
          label="المعلم المكلف"
          placeholder="اختر المعلم"
          data={teacherOptions}
          value={entryForm.teacherId ? String(entryForm.teacherId) : null}
          onChange={(val: string | null) => setEntryFormField('teacherId', val ? Number(val) : null)}
          required
        />

        <AppSelect
          label="القاعة / المختبر"
          placeholder="اختر القاعة (اختياري)"
          data={roomOptions}
          value={entryForm.roomId ? String(entryForm.roomId) : ''}
          onChange={(val: string | null) => setEntryFormField('roomId', val ? Number(val) : null)}
        />

        <Switch
          label="تثبيت هذه الحصة (قفل)"
          description="الحصص المثبتة لا تتأثر أو يعاد جدولتها عند تشغيل التوليد الآلي"
          checked={entryForm.isLocked}
          onChange={(e) => setEntryFormField('isLocked', e.currentTarget.checked)}
        />

        <Group justify="flex-end" mt="lg">
          <AppButton variant="outline" onClick={closeEntryModal}>
            إلغاء
          </AppButton>
          <AppButton leftSection={<IconDeviceFloppy size={18} />} loading={isSavingEntry} onClick={onSave}>
            {isEdit ? 'حفظ التعديل' : 'حفظ وإدراج الحصة'}
          </AppButton>
        </Group>
      </Stack>
    </Modal>
  );
}
