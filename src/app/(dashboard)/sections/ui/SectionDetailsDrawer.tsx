'use client';

import { useMemo } from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconBook,
  IconCalendar,
  IconCalendarTime,
  IconCoin,
  IconInfoCircle,
  IconMapPin,
  IconPlus,
  IconSchool,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react';
import { AppDrawer, AppInput, AppSelect } from '@/src/components/controllers';
import { Teacher } from '@/src/core/api';
import { sectionFormLabels } from '../static-data/sections.data';
import { useSectionsMirror } from '../store/useSectionsMirror';

export interface SectionDetailsDrawerProps {
  opened: boolean;
  onClose: () => void;
  sectionId: number | null;
  onAssignSubject?: (
    sectionId: number,
    subjectId: number,
    weeklyPeriods?: number,
    teacherId?: number | null,
  ) => Promise<void>;
  onRemoveSubject?: (sectionId: number, subjectId: number) => Promise<void>;
}

/**
 * SectionDetailsDrawer
 *
 * Displays full section details, counts, and allows managing assigned subjects.
 * Strictly adheres to role.md.
 * ZERO React Query hooks — all data and query states read from useSectionsMirror.
 */
export function SectionDetailsDrawer({
  opened,
  onClose,
  sectionId,
  onAssignSubject,
  onRemoveSubject,
}: SectionDetailsDrawerProps) {
  const details = useSectionsMirror('detailsData');
  const isLoading = useSectionsMirror('isLoadingDetails');
  const sectionSubjects = useSectionsMirror('sectionSubjectsData');
  const loadingSubjects = useSectionsMirror('isLoadingSectionSubjects');
  const instituteSubjects = useSectionsMirror('instituteSubjectsData');
  const teachersData = useSectionsMirror('teachersData');

  // ── Mirror state for assigning / removing subjects ──
  const assignSubjectId = useSectionsMirror('assignSubjectId');
  const assignWeeklyPeriods = useSectionsMirror('assignWeeklyPeriods');
  const assignTeacherId = useSectionsMirror('assignTeacherId');
  const setAssignSubjectId = useSectionsMirror('setAssignSubjectId');
  const setAssignWeeklyPeriods = useSectionsMirror('setAssignWeeklyPeriods');
  const setAssignTeacherId = useSectionsMirror('setAssignTeacherId');
  const assignSubjectError = useSectionsMirror('assignSubjectError');
  const setAssignSubjectError = useSectionsMirror('setAssignSubjectError');
  const isAssigningSubject = useSectionsMirror('isAssigningSubject');
  const isRemovingSubjectId = useSectionsMirror('isRemovingSubjectId');

  // ── Available subjects options (excluding already assigned) ──
  const assignedSubjectIds = useMemo(
    () => new Set(sectionSubjects?.map((s) => s.subjectId) ?? []),
    [sectionSubjects],
  );

  const availableSubjectOptions = useMemo(
    () =>
      (instituteSubjects ?? [])
        .filter((s) => !assignedSubjectIds.has(s.id))
        .map((s) => ({
          value: String(s.id),
          label: s.name,
        })),
    [instituteSubjects, assignedSubjectIds],
  );

  const teacherOptions = useMemo(
    () => [
      { value: '', label: 'بدون تحديد معلم حاليا' },
      ...(teachersData ?? []).map((t: Teacher) => ({
        value: String(t.id),
        label: t.user?.fullName ?? '',
      })),
    ],
    [teachersData],
  );

  const handleAssign = async () => {
    if (!sectionId || !assignSubjectId || !onAssignSubject) return;
    await onAssignSubject(
      sectionId,
      Number(assignSubjectId),
      assignWeeklyPeriods || 2,
      assignTeacherId ? Number(assignTeacherId) : null,
    );
  };

  const handleRemove = async (subjectId: number) => {
    if (!sectionId || !onRemoveSubject) return;
    await onRemoveSubject(sectionId, subjectId);
  };

  const detailsActiveTab = useSectionsMirror('detailsActiveTab');
  const setDetailsActiveTab = useSectionsMirror('setDetailsActiveTab');

  const isSubjectsTab = (detailsActiveTab || 'subjects') === 'subjects';

  return (
    <AppDrawer
      opened={opened}
      onClose={onClose}
      size="md"
      loading={isLoading}
    >
      <AppDrawer.Header>
        <AppDrawer.Icon
          icon={isSubjectsTab ? <IconBook size={20} /> : <IconInfoCircle size={20} />}
          color={isSubjectsTab ? 'indigo' : 'blue'}
        />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>
            {details?.name
              ? `${details.name} — ${isSubjectsTab ? 'إسناد المواد والخطة التدريسية' : 'بيانات الشعبة'}`
              : sectionFormLabels.detailsTitle}
          </AppDrawer.Title>
          <AppDrawer.Description>
            {isSubjectsTab
              ? 'تحديد المواد التعليمية، المعلمين المكلفين، وعدد الحصص الأسبوعية'
              : 'عرض المعلومات الأساسية وإحصائيات التسجيل والرسوم'}
          </AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        {details && (
          <Stack gap="lg">
            <SegmentedControl
              fullWidth
              radius="xl"
              size="sm"
              color="indigo"
              value={detailsActiveTab || 'subjects'}
              onChange={setDetailsActiveTab}
              data={[
                {
                  value: 'subjects',
                  label: (
                    <Group gap={6} justify="center">
                      <IconBook size={16} />
                      <Text size="xs" fw={600}>
                        المواد المقررة والخطة ({sectionSubjects?.length ?? 0})
                      </Text>
                    </Group>
                  ),
                },
                {
                  value: 'info',
                  label: (
                    <Group gap={6} justify="center">
                      <IconInfoCircle size={16} />
                      <Text size="xs" fw={600}>
                        بيانات وإحصائيات الشعبة
                      </Text>
                    </Group>
                  ),
                },
              ]}
            />

            {!isSubjectsTab && (
              <>
                {/* Section Basic Details Card */}
                <AppDrawer.Section
                  title={
                    <Group justify="space-between" align="center" style={{ width: '100%' }}>
                      <Text fw={700} size="md">
                        {details.name}
                      </Text>
                      <Badge radius="xl" variant="light" color="teal">
                        {details.academicBranch?.name ?? details.grade}
                      </Badge>
                    </Group>
                  }
                  description="المعلومات الأساسية والفرع والسنة الدراسية"
                >
                  <AppDrawer.Details>
                    <AppDrawer.Detail
                      label="الفرع الأكاديمي"
                      value={details.academicBranch?.name ?? details.grade}
                      icon={<IconCalendar size={16} />}
                    />
                    <AppDrawer.Detail
                      label="السنة الدراسية"
                      value={details.academicYear?.name ?? '—'}
                      icon={<IconCalendar size={16} />}
                    />
                    <AppDrawer.Detail
                      label="الرسوم المعتمدة"
                      value={
                        <Text fw={700} c="teal" span>
                          {Number(details.feeAmount).toLocaleString('ar-SA')} ر.س
                        </Text>
                      }
                      icon={<IconCoin size={16} />}
                      iconColor="teal"
                    />
                  </AppDrawer.Details>
                </AppDrawer.Section>

                {/* Quick Metrics Section */}
                <AppDrawer.Section
                  title="إحصائيات الشعبة"
                  description="نظرة سريعة على أعداد الطلاب والمعلمين والمواد"
                >
                  <SimpleGrid cols={2} spacing="sm">
                    <Card
                      radius="md"
                      withBorder
                      p="sm"
                      style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}
                    >
                      <Group gap="xs">
                        <ThemeIcon size="lg" radius="xl" variant="light" color="blue">
                          <IconUsers size={20} />
                        </ThemeIcon>
                        <Stack gap={2}>
                          <Text size="xs" c="dimmed">
                            الطلاب المسجلين
                          </Text>
                          <Text fw={700} size="md">
                            {details._count?.studentEnrollments ?? 0} طالب
                          </Text>
                        </Stack>
                      </Group>
                    </Card>

                    <Card
                      radius="md"
                      withBorder
                      p="sm"
                      style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}
                    >
                      <Group gap="xs">
                        <ThemeIcon size="lg" radius="xl" variant="light" color="violet">
                          <IconBook size={20} />
                        </ThemeIcon>
                        <Stack gap={2}>
                          <Text size="xs" c="dimmed">
                            المواد المقررة
                          </Text>
                          <Text fw={700} size="md">
                            {sectionSubjects?.length ?? details._count?.sectionSubjects ?? 0} مادة
                          </Text>
                        </Stack>
                      </Group>
                    </Card>

                    <Card
                      radius="md"
                      withBorder
                      p="sm"
                      style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}
                    >
                      <Group gap="xs">
                        <ThemeIcon size="lg" radius="xl" variant="light" color="orange">
                          <IconSchool size={20} />
                        </ThemeIcon>
                        <Stack gap={2}>
                          <Text size="xs" c="dimmed">
                            المدرسين
                          </Text>
                          <Text fw={700} size="md">
                            {details._count?.sectionTeachers ?? 0} معلم
                          </Text>
                        </Stack>
                      </Group>
                    </Card>

                    <Card
                      radius="md"
                      withBorder
                      p="sm"
                      style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}
                    >
                      <Group gap="xs">
                        <ThemeIcon size="lg" radius="xl" variant="light" color="teal">
                          <IconCalendarTime size={20} />
                        </ThemeIcon>
                        <Stack gap={2}>
                          <Text size="xs" c="dimmed">
                            الحصص والجدول
                          </Text>
                          <Text fw={700} size="md">
                            {details._count?.timetables ?? 0} حصة
                          </Text>
                        </Stack>
                      </Group>
                    </Card>
                  </SimpleGrid>
                </AppDrawer.Section>
              </>
            )}

            {isSubjectsTab && (
              /* Section Subjects Management */
              <AppDrawer.Section
                title={
                  <Group justify="space-between" align="center" style={{ width: '100%' }}>
                    <Text fw={700} size="sm">
                      المواد الدراسية المقررة للشعبة
                    </Text>
                    <Badge variant="filled" color="indigo" size="sm" radius="xl">
                      {sectionSubjects?.length ?? 0} مواد
                    </Badge>
                  </Group>
                }
                description="إسناد المواد التعليمية وتحديد الحصص الأسبوعية والمعلم المكلف"
              >
                <Stack gap="md">
                {assignSubjectError && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    variant="light"
                    radius="md"
                    withCloseButton
                    onClose={() => setAssignSubjectError(null)}
                  >
                    {assignSubjectError}
                  </Alert>
                )}

                {/* Assign Subject Controls */}
                {onAssignSubject && (
                  <Paper p="xs" radius="lg" withBorder bg="var(--mantine-color-gray-0)">
                    <Stack gap="xs">
                      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                        <AppSelect
                          label="المادة الدراسية"
                          placeholder={
                            availableSubjectOptions.length === 0
                              ? 'جميع مواد المعهد مسندة بالفعل'
                              : 'اختر مادة دراسية...'
                          }
                          data={availableSubjectOptions}
                          value={assignSubjectId}
                          onChange={(val: string | null) => setAssignSubjectId(val)}
                          disabled={availableSubjectOptions.length === 0}
                          clearable
                          searchable
                          size="xs"
                        />
                        <AppSelect
                          label="المعلم المكلف (اختياري)"
                          placeholder="اختر المعلم..."
                          data={teacherOptions}
                          value={assignTeacherId}
                          onChange={(val: string | null) => setAssignTeacherId(val)}
                          clearable
                          searchable
                          size="xs"
                        />
                      </SimpleGrid>
                      <Group justify="space-between" align="flex-end">
                        <Box style={{ width: 140 }}>
                          <AppInput
                            label="الحصص أسبوعيا"
                            type="number"
                            size="xs"
                            value={String(assignWeeklyPeriods || 2)}
                            onChange={(val: unknown) => {
                              const parsed =
                                typeof val === 'number'
                                  ? val
                                  : typeof val === 'string'
                                    ? Number(val)
                                    : val && typeof val === 'object' && 'target' in val
                                      ? Number((val.target as HTMLInputElement).value)
                                      : 2;
                              setAssignWeeklyPeriods(isNaN(parsed) || parsed < 1 ? 1 : parsed);
                            }}
                          />
                        </Box>
                        <Button
                          variant="filled"
                          color="indigo"
                          size="xs"
                          radius="xl"
                          onClick={handleAssign}
                          disabled={!assignSubjectId || isAssigningSubject}
                          loading={isAssigningSubject}
                          leftSection={<IconPlus size={14} />}
                        >
                          إسناد المادة للشعبة
                        </Button>
                      </Group>
                    </Stack>
                  </Paper>
                )}

                {/* Assigned Subjects List */}
                {loadingSubjects ? (
                  <Center py="md">
                    <Loader size="sm" color="indigo" />
                  </Center>
                ) : !sectionSubjects || sectionSubjects.length === 0 ? (
                  <Paper
                    withBorder
                    p="md"
                    radius="md"
                    style={{
                      textAlign: 'center',
                      backgroundColor: 'var(--mantine-color-gray-0)',
                    }}
                  >
                    <Text size="xs" c="dimmed">
                      لم يتم إسناد أي مواد دراسية لهذه الشعبة بعد.
                    </Text>
                  </Paper>
                ) : (
                  <Stack gap="xs">
                    {sectionSubjects.map((item) => (
                      <Paper
                        key={item.id}
                        withBorder
                        p="xs"
                        radius="md"
                        style={{
                          backgroundColor: 'var(--mantine-color-gray-0)',
                        }}
                      >
                        <Group justify="space-between" align="center">
                          <Group gap="sm">
                            <ThemeIcon
                              size="md"
                              radius="xl"
                              color="indigo"
                              variant="light"
                            >
                              <IconBook size={16} />
                            </ThemeIcon>
                            <Stack gap={2}>
                              <Text size="sm" fw={600}>
                                {item.subject.name}
                              </Text>
                              <Group gap={6}>
                                <Badge size="xs" variant="outline" color="blue">
                                  {item.weeklyPeriods || 1} حصص أسبوعيا
                                </Badge>
                                <Badge
                                  size="xs"
                                  variant="dot"
                                  color={item.teacher ? 'teal' : 'gray'}
                                >
                                  {item.teacher?.user.fullName
                                    ? `المعلم: ${item.teacher.user.fullName}`
                                    : 'بدون معلم محدد'}
                                </Badge>
                              </Group>
                            </Stack>
                          </Group>

                          <Group gap="xs">
                            {onRemoveSubject && (
                              <Tooltip
                                label="إزالة المادة من هذه الشعبة"
                                withArrow
                                position="top"
                              >
                                <ActionIcon
                                  size="sm"
                                  variant="subtle"
                                  color="red"
                                  radius="xl"
                                  onClick={() => handleRemove(item.subjectId)}
                                  loading={isRemovingSubjectId === item.subjectId}
                                  aria-label="إزالة المادة من الشعبة"
                                >
                                  <IconTrash size={14} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Stack>
            </AppDrawer.Section>
            )}
          </Stack>
        )}
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>إغلاق</AppDrawer.Cancel>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
