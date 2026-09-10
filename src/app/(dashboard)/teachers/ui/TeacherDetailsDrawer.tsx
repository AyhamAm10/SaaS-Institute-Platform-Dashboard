'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Drawer,
  Grid,
  Group,
  Loader,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconBriefcase,
  IconCalendarTime,
  IconCheck,
  IconClock,
  IconDeviceFloppy,
  IconPlus,
  IconSchool,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { AppInput, AppSelect } from '@/src/components/controllers';
import {
  useAcademicBranchesQuery,
  useSubjectsQuery,
} from '@/src/core/api';
import { useTeachersMirror } from '../store/useTeachersMirror';

const DAYS_OF_WEEK = [
  { value: '0', label: 'الأحد' },
  { value: '1', label: 'الإثنين' },
  { value: '2', label: 'الثلاثاء' },
  { value: '3', label: 'الأربعاء' },
  { value: '4', label: 'الخميس' },
  { value: '5', label: 'الجمعة' },
  { value: '6', label: 'السبت' },
];

const dayNameMap: Record<number, string> = {
  0: 'الأحد',
  1: 'الإثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

interface TeacherDetailsDrawerProps {
  onAssignQualification: (branchId: number, subjectId: number) => Promise<void>;
  onRemoveQualification: (assignmentId: number) => Promise<void>;
  onSaveAvailabilities: () => Promise<void>;
  newAvailDay: string;
  setNewAvailDay: (v: string) => void;
  newAvailStart: string;
  setNewAvailStart: (v: string) => void;
  newAvailEnd: string;
  setNewAvailEnd: (v: string) => void;
  onAddAvailabilityWindow: () => void;
}

export function TeacherDetailsDrawer({
  onAssignQualification,
  onRemoveQualification,
  onSaveAvailabilities,
  newAvailDay,
  setNewAvailDay,
  newAvailStart,
  setNewAvailStart,
  newAvailEnd,
  setNewAvailEnd,
  onAddAvailabilityWindow,
}: TeacherDetailsDrawerProps) {
  const detailsDrawerOpened = useTeachersMirror('detailsDrawerOpened');
  const activeDetailsTab = useTeachersMirror('activeDetailsTab');
  const selectedTeacherDetails = useTeachersMirror('selectedTeacherDetails');
  const isDetailsLoading = useTeachersMirror('isDetailsLoading');
  const isAssigningQualification = useTeachersMirror('isAssigningQualification');
  const stagedAvailabilities = useTeachersMirror('stagedAvailabilities');
  const isSavingAvailabilities = useTeachersMirror('isSavingAvailabilities');

  const newAcademicBranchId = useTeachersMirror('newAcademicBranchId');
  const newSubjectId = useTeachersMirror('newSubjectId');

  const closeDetailsDrawer = useTeachersMirror('closeDetailsDrawer');
  const setActiveDetailsTab = useTeachersMirror('setActiveDetailsTab');
  const setNewAcademicBranchId = useTeachersMirror('setNewAcademicBranchId');
  const setNewSubjectId = useTeachersMirror('setNewSubjectId');
  const removeStagedAvailability = useTeachersMirror('removeStagedAvailability');

  // Query options for academic branches and subjects
  const { data: branchesData } = useAcademicBranchesQuery();
  const { data: subjectsData } = useSubjectsQuery({ limit: 100 });

  const academicBranchOptions = (branchesData?.data || []).map((ab: any) => ({
    value: String(ab.id),
    label: ab.name,
  }));

  const subjectOptions = (subjectsData?.data || []).map((s) => ({
    value: String(s.id),
    label: `${s.name} (${s.code})`,
  }));

  if (!selectedTeacherDetails) return null;

  return (
    <Drawer
      opened={detailsDrawerOpened}
      onClose={closeDetailsDrawer}
      position="right"
      size="xl"
      title={
        <Group gap="xs">
          <IconUser size={20} />
          <Text fw={700} size="md">
            ملف المعلم: {selectedTeacherDetails.user.fullName}
          </Text>
        </Group>
      }
      padding="lg"
      radius="xl"
    >
      <Tabs
        value={activeDetailsTab}
        onChange={(val) => setActiveDetailsTab(val || 'overview')}
      >
        <Tabs.List mb="md">
          <Tabs.Tab
            value="overview"
            leftSection={<IconUser size={16} />}
          >
            نظرة عامة
          </Tabs.Tab>
          <Tabs.Tab
            value="qualifications"
            leftSection={<IconBriefcase size={16} />}
          >
            المواد المعتمدة ({selectedTeacherDetails.assignments?.length || 0})
          </Tabs.Tab>
          <Tabs.Tab
            value="availability"
            leftSection={<IconCalendarTime size={16} />}
          >
            أوقات الدوام الأسبوعي ({stagedAvailabilities.length})
          </Tabs.Tab>
        </Tabs.List>

        {/* ── Tab 1: Overview ── */}
        <Tabs.Panel value="overview">
          <Stack gap="md">
            <Paper p="md" radius="xl" withBorder>
              <SimpleGrid cols={2} spacing="md">
                <div>
                  <Text size="xs" c="dimmed">
                    الاسم الكامل
                  </Text>
                  <Text size="sm" fw={700}>
                    {selectedTeacherDetails.user.fullName}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    رقم الهاتف
                  </Text>
                  <Text size="sm" fw={700} dir="ltr" ta="right">
                    {selectedTeacherDetails.user.phone}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    التخصص الأكاديمي
                  </Text>
                  <Text size="sm" fw={700}>
                    {selectedTeacherDetails.specialization || 'غير محدد'}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    حالة الحساب
                  </Text>
                  <Badge
                    variant="dot"
                    color={selectedTeacherDetails.isActive ? 'teal' : 'red'}
                    radius="xl"
                  >
                    {selectedTeacherDetails.isActive ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
              </SimpleGrid>
            </Paper>

            <Paper p="md" radius="xl" withBorder>
              <Text size="xs" c="dimmed" mb="xs">
                فروع المعهد المنتسب إليها
              </Text>
              <Group gap="xs">
                {selectedTeacherDetails.teacherBranches &&
                selectedTeacherDetails.teacherBranches.length > 0 ? (
                  selectedTeacherDetails.teacherBranches.map((tb) => (
                    <Badge key={tb.branchId} variant="light" color="blue" radius="xl">
                      {tb.branch?.name || `فرع ${tb.branchId}`}
                    </Badge>
                  ))
                ) : (
                  <Text size="xs" c="dimmed">
                    كافة الفروع
                  </Text>
                )}
              </Group>
            </Paper>
          </Stack>
        </Tabs.Panel>

        {/* ── Tab 2: Qualifications ── */}
        <Tabs.Panel value="qualifications">
          <Stack gap="md">
            <Text size="xs" c="dimmed">
              يُحدد المؤهل الأكاديمي المادة والفرع الذي يحق للمعلم تدريسه. تُستخدم هذه المؤهلات للتحقق من سلامة الجداول تلقائياً.
            </Text>

            {/* Add Qualification Bar */}
            <Paper p="md" radius="xl" withBorder bg="var(--mantine-color-gray-0)">
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs">
                <AppSelect
                  placeholder="اختر الفرع الأكاديمي"
                  data={academicBranchOptions}
                  value={newAcademicBranchId ? String(newAcademicBranchId) : null}
                  onChange={(val: any) => setNewAcademicBranchId(val ? Number(val) : undefined)}
                />
                <AppSelect
                  placeholder="اختر المادة الدراسية"
                  data={subjectOptions}
                  value={newSubjectId ? String(newSubjectId) : null}
                  onChange={(val: any) => setNewSubjectId(val ? Number(val) : undefined)}
                />
                <Button
                  leftSection={<IconPlus size={16} />}
                  radius="xl"
                  loading={isAssigningQualification}
                  disabled={!newAcademicBranchId || !newSubjectId}
                  onClick={() => {
                    if (newAcademicBranchId && newSubjectId) {
                      onAssignQualification(newAcademicBranchId, newSubjectId);
                    }
                  }}
                >
                  إضافة مؤهل
                </Button>
              </SimpleGrid>
            </Paper>

            {/* Qualifications List */}
            {(!selectedTeacherDetails.assignments ||
              selectedTeacherDetails.assignments.length === 0) ? (
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
                          <Text size="sm" fw={700}>
                            {assignment.subject?.name || `مادة ${assignment.subjectId}`}
                          </Text>
                          <Text size="xs" c="dimmed">
                            الفرع: {assignment.academicBranch?.name || `فرع ${assignment.academicBranchId}`}
                          </Text>
                        </Stack>
                      </Group>
                      <Tooltip label="حذف المؤهل">
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          radius="xl"
                          onClick={() => onRemoveQualification(assignment.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </Stack>
        </Tabs.Panel>

        {/* ── Tab 3: Availability Windows ── */}
        <Tabs.Panel value="availability">
          <Stack gap="md">
            <Text size="xs" c="dimmed">
              حدد الفترات الزمنية الأسبوعية التي يتواجد فيها المعلم في المعهد. في حال عدم تحديد أي فترات، يُعتبر المعلم متاحاً في كامل أوقات دوام المعهد.
            </Text>

            {/* Add Availability Window Bar */}
            <Paper p="md" radius="xl" withBorder bg="var(--mantine-color-gray-0)">
              <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="xs">
                <AppSelect
                  placeholder="اختر اليوم"
                  data={DAYS_OF_WEEK}
                  value={newAvailDay}
                  onChange={(val: any) => setNewAvailDay(val || '0')}
                />
                <AppInput
                  placeholder="من (08:00)"
                  value={newAvailStart}
                  onChange={(val: any) => setNewAvailStart(val)}
                />
                <AppInput
                  placeholder="إلى (12:00)"
                  value={newAvailEnd}
                  onChange={(val: any) => setNewAvailEnd(val)}
                />
                <Button
                  leftSection={<IconPlus size={16} />}
                  variant="light"
                  color="blue"
                  radius="xl"
                  onClick={onAddAvailabilityWindow}
                  disabled={!newAvailStart || !newAvailEnd}
                >
                  إضافة فترة
                </Button>
              </SimpleGrid>
            </Paper>

            {/* Availability Windows Table */}
            {stagedAvailabilities.length === 0 ? (
              <Center py="xl">
                <Text size="sm" c="dimmed">
                  لا توجد فترات دوام مخصصة (المعلم متاح طيلة الدوام الرسمي)
                </Text>
              </Center>
            ) : (
              <Table.ScrollContainer minWidth={400}>
                <Table verticalSpacing="xs">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>اليوم</Table.Th>
                      <Table.Th>الفترة الزمنية</Table.Th>
                      <Table.Th ta="center">حذف</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {stagedAvailabilities.map((win, idx) => (
                      <Table.Tr key={idx}>
                        <Table.Td>
                          <Badge variant="light" color="blue" radius="xl">
                            {dayNameMap[win.dayOfWeek] || `يوم ${win.dayOfWeek}`}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={600} dir="ltr">
                            {win.startTime} - {win.endTime}
                          </Text>
                        </Table.Td>
                        <Table.Td ta="center">
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            radius="xl"
                            onClick={() => removeStagedAvailability(idx)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            )}

            <Group justify="flex-end" mt="md">
              <Button
                leftSection={<IconDeviceFloppy size={18} />}
                radius="xl"
                loading={isSavingAvailabilities}
                onClick={onSaveAvailabilities}
              >
                حفظ أوقات الدوام
              </Button>
            </Group>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Drawer>
  );
}
