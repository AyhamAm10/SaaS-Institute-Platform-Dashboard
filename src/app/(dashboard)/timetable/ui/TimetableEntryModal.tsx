'use client';

import {
  Alert,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCalendarEvent,
  IconDeviceFloppy,
} from '@tabler/icons-react';
import { AppSelect } from '@/src/components/controllers';
import {
  useRoomsQuery,
  useSectionSubjectsQuery,
  useTeachersQuery,
} from '@/src/core/api';
import { useTimetableMirror } from '../store/useTimetableMirror';

interface TimetableEntryModalProps {
  onSave: () => void;
}

const dayNames: Record<number, string> = {
  0: 'الأحد',
  1: 'الإثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

export function TimetableEntryModal({ onSave }: TimetableEntryModalProps) {
  const sectionId = useTimetableMirror('sectionId');
  const entryModalOpened = useTimetableMirror('entryModalOpened');
  const entryForm = useTimetableMirror('entryForm');
  const entryFormError = useTimetableMirror('entryFormError');
  const isSavingEntry = useTimetableMirror('isSavingEntry');

  const closeEntryModal = useTimetableMirror('closeEntryModal');
  const setEntryFormField = useTimetableMirror('setEntryFormField');

  // Options
  const { data: sectionSubjects } = useSectionSubjectsQuery(sectionId ?? 0);
  const { data: teachersData } = useTeachersQuery({ limit: 100 });
  const { data: roomsData } = useRoomsQuery({ limit: 100 });

  const subjectOptions = (sectionSubjects || []).map((ss: any) => ({
    value: String(ss.subjectId),
    label: `${ss.subject.name} (${ss.weeklyPeriods || 1} حصص أسبوعياً)`,
  }));

  const teacherOptions = (teachersData?.data || []).map((t: any) => ({
    value: String(t.id),
    label: `${t.user.fullName} ${t.specialization ? `(${t.specialization})` : ''}`,
  }));

  const roomOptions = [
    { value: '', label: 'بدون قاعة محددة (افتراضية)' },
    ...(roomsData?.data || []).map((r: any) => ({
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
          <Text fw={700} size="md">
            {isEdit ? 'تعديل الحصة الدراسية' : 'إضافة حصة دراسية جديدة'}
          </Text>
        </Group>
      }
      centered
    >
      <Stack gap="md">
        {entryFormError && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            color="red"
            radius="xl"
            title="تعذر الحفظ"
          >
            {entryFormError}
          </Alert>
        )}

        {/* Slot Info Preview */}
        <Paper p="xs" radius="md" withBorder bg="var(--mantine-color-gray-0)">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              اليوم: {dayNames[entryForm.dayOfWeek] || entryForm.dayOfWeek}
            </Text>
            <Text size="xs" fw={700} dir="ltr">
              الحصة {entryForm.periodNumber} ({entryForm.startTime} - {entryForm.endTime})
            </Text>
          </Group>
        </Paper>

        <AppSelect
          label="المادة الدراسية"
          placeholder="اختر المادة المقررة للشُعبة"
          data={subjectOptions}
          value={entryForm.subjectId ? String(entryForm.subjectId) : null}
          onChange={(val: any) => {
            const sId = val ? Number(val) : null;
            setEntryFormField('subjectId', sId);
            // Pre-select default teacher if assigned in section subject
            const matchingSubject = sectionSubjects?.find((s: any) => s.subjectId === sId);
            if (matchingSubject?.teacherId) {
              setEntryFormField('teacherId', matchingSubject.teacherId);
            }
          }}
          required
        />

        <AppSelect
          label="المعلم المكلّف"
          placeholder="اختر المعلم"
          data={teacherOptions}
          value={entryForm.teacherId ? String(entryForm.teacherId) : null}
          onChange={(val: any) =>
            setEntryFormField('teacherId', val ? Number(val) : null)
          }
          required
        />

        <AppSelect
          label="القاعة / المختبر"
          placeholder="اختر القاعة (اختياري)"
          data={roomOptions}
          value={entryForm.roomId ? String(entryForm.roomId) : ''}
          onChange={(val: any) =>
            setEntryFormField('roomId', val ? Number(val) : null)
          }
        />

        <Switch
          label="تثبيت هذه الحصة (قفل)"
          description="الحصص المثبتة لا تتأثر أو يُعاد جدولتها عند تشغيل التوليد الآلي"
          checked={entryForm.isLocked}
          onChange={(e) => setEntryFormField('isLocked', e.currentTarget.checked)}
        />

        <Group justify="flex-end" mt="lg">
          <Button variant="light" color="gray" radius="xl" onClick={closeEntryModal}>
            إلغاء
          </Button>
          <Button
            leftSection={<IconDeviceFloppy size={18} />}
            radius="xl"
            loading={isSavingEntry}
            onClick={onSave}
          >
            {isEdit ? 'حفظ التعديل' : 'حفظ وإدراج الحصة'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
