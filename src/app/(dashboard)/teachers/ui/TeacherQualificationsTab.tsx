'use client';

import { Center, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBriefcase, IconPlus, IconTrash } from '@tabler/icons-react';
import { AppSelect } from '@/src/components/controllers';
import { AppButton, AppIconButton } from '@/src/components/controllers/button';
import { useTeachersMirror } from '../store/useTeachersMirror';

interface TeacherQualificationsTabProps {
  onAssignQualification: (branchId: number, subjectId: number) => Promise<void>;
  onRemoveQualification: (assignmentId: number) => Promise<void>;
}

/** The subjects / academic branches the teacher may teach. */
export function TeacherQualificationsTab({
  onAssignQualification,
  onRemoveQualification,
}: TeacherQualificationsTabProps) {
  const selectedTeacherDetails = useTeachersMirror('selectedTeacherDetails');
  const isAssigningQualification = useTeachersMirror('isAssigningQualification');
  const newAcademicBranchId = useTeachersMirror('newAcademicBranchId');
  const newSubjectId = useTeachersMirror('newSubjectId');
  const setNewAcademicBranchId = useTeachersMirror('setNewAcademicBranchId');
  const setNewSubjectId = useTeachersMirror('setNewSubjectId');
  const academicBranchOptions = useTeachersMirror('academicBranchOptions');
  const subjectOptions = useTeachersMirror('subjectOptions');
  if (!selectedTeacherDetails) return null;

  return (
    <Stack gap="md">
      <Text size="xs" c="dimmed">
        يحدد المؤهل الأكاديمي المادة والفرع الذي يحق للمعلم تدريسه. تستخدم هذه المؤهلات للتحقق من سلامة الجداول تلقائيا.
      </Text>

      {/* Add Qualification Bar */}
      <Paper p="md" radius="xl" withBorder bg="var(--app-subtle)">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs">
          <AppSelect
            placeholder="اختر الفرع الأكاديمي"
            data={academicBranchOptions}
            value={newAcademicBranchId ? String(newAcademicBranchId) : null}
            onChange={(val: string | null) => setNewAcademicBranchId(val ? Number(val) : undefined)}
          />
          <AppSelect
            placeholder="اختر المادة الدراسية"
            data={subjectOptions}
            value={newSubjectId ? String(newSubjectId) : null}
            onChange={(val: string | null) => setNewSubjectId(val ? Number(val) : undefined)}
          />
          <AppButton
            leftSection={<IconPlus size={16} />}
            loading={isAssigningQualification}
            disabled={!newAcademicBranchId || !newSubjectId}
            onClick={() => {
              if (newAcademicBranchId && newSubjectId) {
                onAssignQualification(newAcademicBranchId, newSubjectId);
              }
            }}
          >
            إضافة مؤهل
          </AppButton>
        </SimpleGrid>
      </Paper>

      {/* Qualifications List */}
      {!selectedTeacherDetails.assignments || selectedTeacherDetails.assignments.length === 0 ? (
        <Center py="xl">
          <Text size="sm" c="dimmed">
            لم يتم إضافة أي مؤهلات لهذا المعلم حتى الآن
          </Text>
        </Center>
      ) : (
        <Stack gap="xs">
          {selectedTeacherDetails.assignments.map((assignment) => (
            <Paper key={assignment.id} p="sm" radius="lg" withBorder>
              <Group justify="space-between" align="center">
                <Group gap="sm">
                  <ThemeIcon color="indigo" variant="light" radius="xl">
                    <IconBriefcase size={16} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>
                      {assignment.subject?.name || `مادة ${assignment.subjectId}`}
                    </Text>
                    <Text size="xs" c="dimmed">
                      الفرع: {assignment.academicBranch?.name || `فرع ${assignment.academicBranchId}`}
                    </Text>
                  </Stack>
                </Group>

                <AppIconButton variant="danger" label="حذف المؤهل" onClick={() => onRemoveQualification(assignment.id)}>
                  <IconTrash size={16} />
                </AppIconButton>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
