'use client';

import { useMemo } from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconBook,
  IconBriefcase,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { AppSelect } from '@/src/components/controllers';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';
import { AcademicBranch, Subject } from '@/src/core/api';

export interface Step2QualificationsProps {
  academicBranches: AcademicBranch[];
  subjects: Subject[];
}

export function Step2Qualifications({
  academicBranches,
  subjects,
}: Step2QualificationsProps) {
  const qualifications = useTeacherRegistrationMirror('qualifications');
  const stagedAcademicBranchId = useTeacherRegistrationMirror('stagedAcademicBranchId');
  const stagedSubjectId = useTeacherRegistrationMirror('stagedSubjectId');
  const setStagedAcademicBranchId = useTeacherRegistrationMirror('setStagedAcademicBranchId');
  const setStagedSubjectId = useTeacherRegistrationMirror('setStagedSubjectId');
  const addQualification = useTeacherRegistrationMirror('addQualification');
  const removeQualification = useTeacherRegistrationMirror('removeQualification');
  const stepErrors = useTeacherRegistrationMirror('stepErrors');

  const error = stepErrors[1];

  const academicBranchOptions = useMemo(
    () => academicBranches.map((ab) => ({ value: String(ab.id), label: ab.name })),
    [academicBranches],
  );

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ value: String(s.id), label: s.name })),
    [subjects],
  );

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
        <Text size="md" fw={700}>
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
        تعتمد خوارزمية إنشاء الجدول الذكي على هذه المؤهلات لمعرفة المعلمين المؤهلين لتدريس مواد كل
        شعبة دراسية، وتمنع تلقائياً إسناد مادة لمعلم غير مسجل كمؤهل لتدريسها.
      </Alert>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" radius="xl" variant="light">
          {error}
        </Alert>
      )}

      {/* Adding Qualification Bar */}
      <Paper p="lg" radius="xl" withBorder bg="var(--mantine-color-gray-0)">
        <Stack gap="md">
          <Text size="sm" fw={700} c="primary.8">
            إضافة مادة وفرع تدريسي جديد
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
            <AppSelect
              label="الفرع الأكاديمي / المرحلة"
              placeholder="اختر الفرع الأكاديمي..."
              data={academicBranchOptions}
              value={stagedAcademicBranchId ? String(stagedAcademicBranchId) : null}
              onChange={(val: any) =>
                setStagedAcademicBranchId(val ? Number(val) : undefined)
              }
              searchable
              clearable
            />

            <AppSelect
              label="المادة الدراسية (من جدول المواد)"
              placeholder="اختر المادة من القائمة..."
              data={subjectOptions}
              value={stagedSubjectId ? String(stagedSubjectId) : null}
              onChange={(val: any) => setStagedSubjectId(val ? Number(val) : undefined)}
              searchable
              clearable
            />

            <Stack justify="flex-end">
              <Button
                leftSection={<IconPlus size={16} />}
                radius="xl"
                color="primary"
                onClick={handleAdd}
                disabled={!stagedAcademicBranchId || !stagedSubjectId}
              >
                إضافة المؤهل للقائمة
              </Button>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Paper>

      <Divider my="xs" />

      {/* List of Added Qualifications */}
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={700} c="primary.8">
            المواد المعتمدة المضافة ({qualifications.length})
          </Text>
          {qualifications.length > 0 && (
            <Badge variant="light" color="teal" radius="xl">
              تم إدراج {qualifications.length} مادة
            </Badge>
          )}
        </Group>

        {qualifications.length === 0 ? (
          <Paper p="xl" radius="xl" withBorder style={{ borderStyle: 'dashed' }}>
            <Center>
              <Stack align="center" gap="xs">
                <ThemeIcon color="gray" variant="light" size="xl" radius="xl">
                  <IconBook size={22} />
                </ThemeIcon>
                <Text size="sm" fw={600} c="dimmed">
                  لم يتم إضافة أي مواد لهذا المعلم بعد
                </Text>
                <Text size="xs" c="dimmed" ta="center">
                  اختر الفرع الأكاديمي والمادة من الأعلى واضغط &quot;إضافة المؤهل&quot;. (يمكنك
                  أيضاً المتابعة وإضافتها لاحقاً من ملف المعلم).
                </Text>
              </Stack>
            </Center>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {qualifications.map((q, idx) => (
              <Paper key={`${q.academicBranchId}-${q.subjectId}`} p="md" radius="xl" withBorder>
                <Group justify="space-between" align="center" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon color="indigo" variant="light" radius="xl" size="lg">
                      <IconBriefcase size={18} />
                    </ThemeIcon>
                    <Stack gap={2}>
                      <Text size="sm" fw={700}>
                        {q.subjectName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        الفرع: {q.academicBranchName}
                      </Text>
                    </Stack>
                  </Group>

                  <Tooltip label="إزالة المؤهل" withArrow>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      radius="xl"
                      onClick={() => removeQualification(idx)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Stack>
  );
}
