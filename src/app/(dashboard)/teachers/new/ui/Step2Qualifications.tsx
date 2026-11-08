'use client';

import { useMemo } from 'react';
import { Alert, Divider, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconInfoCircle, IconPlus } from '@tabler/icons-react';
import { AppSelect } from '@/src/components/controllers';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';
import { AcademicBranch, Subject } from '@/src/core/api';
import { AppButton } from '@/src/components/controllers/button';
import { Step2QualificationList } from './Step2QualificationList';

export interface Step2QualificationsProps {
  academicBranches: AcademicBranch[];
  subjects: Subject[];
}

export function Step2Qualifications({ academicBranches, subjects }: Step2QualificationsProps) {
  const stagedAcademicBranchId = useTeacherRegistrationMirror('stagedAcademicBranchId');
  const stagedSubjectId = useTeacherRegistrationMirror('stagedSubjectId');
  const setStagedAcademicBranchId = useTeacherRegistrationMirror('setStagedAcademicBranchId');
  const setStagedSubjectId = useTeacherRegistrationMirror('setStagedSubjectId');
  const addQualification = useTeacherRegistrationMirror('addQualification');
  const stepErrors = useTeacherRegistrationMirror('stepErrors');

  const error = stepErrors[1];

  const academicBranchOptions = useMemo(
    () => academicBranches.map((ab) => ({ value: String(ab.id), label: ab.name })),
    [academicBranches],
  );

  const subjectOptions = useMemo(() => subjects.map((s) => ({ value: String(s.id), label: s.name })), [subjects]);

  const handleAdd = () => {
    if (!stagedAcademicBranchId || !stagedSubjectId) return;

    const branch = academicBranches.find((b) => b.id === stagedAcademicBranchId);
    const subject = subjects.find((s) => s.id === stagedSubjectId);

    if (branch && subject) {
      addQualification(branch.name, subject.name);
    }
  };

  return (
    <Stack gap="xl">
      <Stack gap={3}>
        <Text size="md" fw={500}>
          الخطوة الثانية: المواد والمؤهلات الأكاديمية المعتمدة
        </Text>
        <Text size="xs" c="dimmed">
          اربط المعلم بالمواد الرسمية من جدول المواد والفروع الأكاديمية التي يستطيع تدريسها
        </Text>
      </Stack>

      {/* Info Callout */}
      <Alert
        icon={<IconInfoCircle size={18} />}
        color="blue"
        radius="xl"
        variant="light"
        title="الربط مع الجدول الأوتوماتيكي"
      >
        تعتمد خوارزمية إنشاء الجدول الذكي على هذه المؤهلات لمعرفة المعلمين المؤهلين لتدريس مواد كل شعبة دراسية، وتمنع
        تلقائياً إسناد مادة لمعلم غير مسجل كمؤهل لتدريسها.
      </Alert>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" radius="xl" variant="light">
          {error}
        </Alert>
      )}

      {/* Adding Qualification Bar */}
      <Paper p="lg" radius="xl" withBorder bg="var(--app-subtle)">
        <Stack gap="md">
          <Text size="sm" fw={500} c="primary.8">
            إضافة مادة وفرع تدريسي جديد
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <AppSelect
              label="الفرع الأكاديمي / المرحلة"
              placeholder="اختر الفرع الأكاديمي..."
              data={academicBranchOptions}
              value={stagedAcademicBranchId ? String(stagedAcademicBranchId) : null}
              onChange={(val: string | null) => setStagedAcademicBranchId(val ? Number(val) : undefined)}
              searchable
              clearable
            />

            <AppSelect
              label="المادة الدراسية (من جدول المواد)"
              placeholder="اختر المادة من القائمة..."
              data={subjectOptions}
              value={stagedSubjectId ? String(stagedSubjectId) : null}
              onChange={(val: string | null) => setStagedSubjectId(val ? Number(val) : undefined)}
              searchable
              clearable
            />

            <Stack justify="flex-end">
              <AppButton
                leftSection={<IconPlus size={16} />}
                onClick={handleAdd}
                disabled={!stagedAcademicBranchId || !stagedSubjectId}
              >
                إضافة المؤهل للقائمة
              </AppButton>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Paper>

      <Divider my="xs" />
      <Step2QualificationList />
    </Stack>
  );
}
