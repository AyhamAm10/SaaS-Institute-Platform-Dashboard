'use client';

import { useMemo } from 'react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Loader,
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
 * Clean, breathable, modern organic UI with ZERO nested cards.
 * Strictly adheres to role.md:
 * - ZERO useState (all state is stored in Zustand and read via useSectionsMirror).
 * - Pure Mantine and unified controllers (AppDrawer, AppSelect, AppInput).
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

  const detailsActiveTab = useSectionsMirror('detailsActiveTab');
  const setDetailsActiveTab = useSectionsMirror('setDetailsActiveTab');

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

  // ── Filter teachers strictly by the selected subject ──
  const filteredTeachers = useMemo(() => {
    if (!assignSubjectId) return [];
    const subId = Number(assignSubjectId);
    const selectedSub = instituteSubjects?.find((s) => s.id === subId);
    const subName = selectedSub?.name?.trim();

    return (teachersData ?? []).filter((t: Teacher) => {
      // 1. Check official assignments
      const hasAssignment = t.assignments?.some(
        (a) => a.subjectId === subId || (subName && a.subject?.name?.trim() === subName),
      );
      if (hasAssignment) return true;

      // 2. Check specialization match
      if (subName && t.specialization && t.specialization.includes(subName)) {
        return true;
      }

      return false;
    });
  }, [assignSubjectId, instituteSubjects, teachersData]);

  const teacherOptions = useMemo(() => {
    if (!assignSubjectId) return [];
    return [
      { value: '', label: 'بدون تحديد معلم حالياً (توزيع آلي)' },
      ...filteredTeachers.map((t: Teacher) => ({
        value: String(t.id),
        label: `${t.user?.fullName}${t.specialization ? ` (${t.specialization})` : ''}`,
      })),
    ];
  }, [assignSubjectId, filteredTeachers]);

  const handleSubjectChange = (val: string | null) => {
    setAssignSubjectId(val);
    setAssignTeacherId(null);
  };

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
          color="primary"
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
          <Stack gap="md">
            {/* Pill Tabs Selector */}
            <SegmentedControl
              fullWidth
              radius="xl"
              size="sm"
              color="primary"
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

            {/* TAB 1: SUBJECTS MANAGEMENT (Clean, Flat, Non-nested UI) */}
            {isSubjectsTab && (
              <Stack gap="md">
                {/* Clean Add Subject Surface */}
                {onAssignSubject && (
                  <Box
                    p="md"
                    style={{
                      backgroundColor: 'var(--app-subtle)',
                      border: '1px solid var(--app-border)',
                      borderRadius: 'var(--mantine-radius-lg)',
                    }}
                  >
                    <Stack gap="sm">
                      <Group justify="space-between" align="center">
                        <Group gap={8}>
                          <ThemeIcon size={26} radius="xl" variant="light" color="primary">
                            <IconPlus size={14} />
                          </ThemeIcon>
                          <Text size="sm" fw={700}>
                            إسناد مادة جديدة للشعبة
                          </Text>
                        </Group>
                        {availableSubjectOptions.length > 0 && (
                          <Badge size="xs" variant="light" color="primary" radius="xl">
                            {availableSubjectOptions.length} مادة متاحة للإسناد
                          </Badge>
                        )}
                      </Group>

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

                      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                        <AppSelect
                          label="المادة الدراسية"
                          placeholder={
                            availableSubjectOptions.length === 0
                              ? 'جميع مواد المعهد مسندة بالفعل'
                              : 'اختر المادة الدراسية...'
                          }
                          data={availableSubjectOptions}
                          value={assignSubjectId}
                          onChange={handleSubjectChange}
                          disabled={availableSubjectOptions.length === 0}
                          clearable
                          searchable
                          size="sm"
                        />

                        <AppSelect
                          label="المعلم المكلف (اختياري)"
                          placeholder={
                            !assignSubjectId
                              ? 'اختر المادة الدراسية أولاً...'
                              : filteredTeachers.length === 0
                                ? 'لا يوجد معلم مسجل لهذه المادة'
                                : 'اختر المعلم المكلف...'
                          }
                          data={teacherOptions}
                          value={assignTeacherId}
                          onChange={(val: string | null) => setAssignTeacherId(val)}
                          disabled={!assignSubjectId || (teacherOptions.length <= 1 && filteredTeachers.length === 0)}
                          clearable
                          searchable
                          size="sm"
                        />
                      </SimpleGrid>

                      <Group justify="space-between" align="flex-end" pt={4}>
                        <Box style={{ width: 140 }}>
                          <AppInput
                            label="الحصص أسبوعياً"
                            type="number"
                            size="sm"
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
                          color="primary"
                          size="sm"
                          radius="xl"
                          onClick={handleAssign}
                          disabled={!assignSubjectId || isAssigningSubject}
                          loading={isAssigningSubject}
                          leftSection={<IconPlus size={16} />}
                          style={{ flex: 1, maxWidth: 220 }}
                        >
                          إسناد المادة للشعبة
                        </Button>
                      </Group>
                    </Stack>
                  </Box>
                )}

                {/* Subtle Divider with Title & Count */}
                <Divider
                  my={4}
                  label={
                    <Group gap={6}>
                      <IconBook size={15} style={{ opacity: 0.7 }} />
                      <Text size="xs" fw={700} c="dimmed">
                        المواد المقررة في الخطة ({sectionSubjects?.length ?? 0})
                      </Text>
                    </Group>
                  }
                  labelPosition="right"
                />

                {/* Assigned Subjects Content */}
                {loadingSubjects ? (
                  <Center py="xl">
                    <Loader size="sm" color="primary" />
                  </Center>
                ) : !sectionSubjects || sectionSubjects.length === 0 ? (
                  <Stack align="center" justify="center" py="xl" gap="xs">
                    <ThemeIcon size={52} radius="xl" variant="light" color="primary">
                      <IconBook size={24} />
                    </ThemeIcon>
                    <Text size="sm" fw={600} c="dimmed">
                      لم يتم إسناد أي مواد دراسية لهذه الشعبة بعد
                    </Text>
                    <Text size="xs" c="dimmed" ta="center" maw={320}>
                      اختر المادة والمعلم المكلف وعدد الحصص من النموذج أعلاه لإضافتها للخطة التدريسية
                    </Text>
                  </Stack>
                ) : (
                  <Stack gap="xs">
                    {sectionSubjects.map((item) => (
                      <Box
                        key={item.id}
                        p="sm"
                        style={{
                          borderRadius: 'var(--mantine-radius-md)',
                          border: '1px solid var(--app-border)',
                          backgroundColor: 'var(--app-surface)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Group justify="space-between" align="center" wrap="nowrap">
                          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                            <ThemeIcon size="lg" radius="xl" color="primary" variant="light">
                              <IconBook size={18} />
                            </ThemeIcon>
                            <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                              <Text size="sm" fw={700} truncate>
                                {item.subject?.name}
                              </Text>
                              <Text size="xs" c={item.teacher ? 'dimmed' : 'orange'}>
                                {item.teacher?.user?.fullName
                                  ? `المعلم: ${item.teacher.user.fullName}`
                                  : 'بدون معلم مكلف (توزيع آلي)'}
                              </Text>
                            </Stack>
                          </Group>

                          <Group gap="xs" wrap="nowrap">
                            <Badge variant="light" color="primary" radius="xl" size="sm">
                              {item.weeklyPeriods || 1}{' '}
                              {item.weeklyPeriods === 1
                                ? 'حصة'
                                : item.weeklyPeriods === 2
                                  ? 'حصتان'
                                  : 'حصص'}{' '}
                              / أسبوع
                            </Badge>

                            {onRemoveSubject && (
                              <Tooltip label="إزالة المادة من الشعبة" withArrow>
                                <ActionIcon
                                  size="sm"
                                  variant="subtle"
                                  color="red"
                                  radius="xl"
                                  onClick={() => handleRemove(item.subjectId)}
                                  loading={isRemovingSubjectId === item.subjectId}
                                  aria-label="إزالة المادة من الشعبة"
                                >
                                  <IconTrash size={15} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </Group>
                        </Group>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>
            )}

            {/* TAB 2: SECTION BASIC INFO & METRICS (Clean, Flat Design) */}
            {!isSubjectsTab && (
              <Stack gap="md">
                {/* Basic Details Box */}
                <Box
                  p="md"
                  style={{
                    backgroundColor: 'var(--app-subtle)',
                    border: '1px solid var(--app-border)',
                    borderRadius: 'var(--mantine-radius-lg)',
                  }}
                >
                  <Stack gap="sm">
                    <Group justify="space-between" align="center">
                      <Text fw={700} size="md">
                        {details.name}
                      </Text>
                      <Badge radius="xl" variant="light" color="teal">
                        {details.academicBranch?.name ?? details.grade}
                      </Badge>
                    </Group>
                    <Divider />
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light" color="gray" radius="xl">
                          <IconCalendar size={14} />
                        </ThemeIcon>
                        <Text size="xs" c="dimmed">السنة الدراسية:</Text>
                        <Text size="xs" fw={600}>{details.academicYear?.name ?? '—'}</Text>
                      </Group>
                      <Group gap="xs">
                        <ThemeIcon size="sm" variant="light" color="teal" radius="xl">
                          <IconCoin size={14} />
                        </ThemeIcon>
                        <Text size="xs" c="dimmed">الرسوم المعتمدة:</Text>
                        <Text size="xs" fw={700} c="teal">
                          {Number(details.feeAmount).toLocaleString('ar-SA')} ر.س
                        </Text>
                      </Group>
                    </SimpleGrid>
                  </Stack>
                </Box>

                {/* Quick Metrics Grid */}
                <SimpleGrid cols={2} spacing="sm">
                  <Box
                    p="sm"
                    style={{
                      borderRadius: 'var(--mantine-radius-md)',
                      border: '1px solid var(--app-border)',
                      backgroundColor: 'var(--app-surface)',
                    }}
                  >
                    <Group gap="xs">
                      <ThemeIcon size="lg" radius="xl" variant="light" color="primary">
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
                  </Box>

                  <Box
                    p="sm"
                    style={{
                      borderRadius: 'var(--mantine-radius-md)',
                      border: '1px solid var(--app-border)',
                      backgroundColor: 'var(--app-surface)',
                    }}
                  >
                    <Group gap="xs">
                      <ThemeIcon size="lg" radius="xl" variant="light" color="secondary">
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
                  </Box>

                  <Box
                    p="sm"
                    style={{
                      borderRadius: 'var(--mantine-radius-md)',
                      border: '1px solid var(--app-border)',
                      backgroundColor: 'var(--app-surface)',
                    }}
                  >
                    <Group gap="xs">
                      <ThemeIcon size="lg" radius="xl" variant="light" color="primary">
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
                  </Box>

                  <Box
                    p="sm"
                    style={{
                      borderRadius: 'var(--mantine-radius-md)',
                      border: '1px solid var(--app-border)',
                      backgroundColor: 'var(--app-surface)',
                    }}
                  >
                    <Group gap="xs">
                      <ThemeIcon size="lg" radius="xl" variant="light" color="secondary">
                        <IconCalendarTime size={20} />
                      </ThemeIcon>
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">
                          الحصص بالجدول
                        </Text>
                        <Text fw={700} size="md">
                          {details._count?.timetables ?? 0} حصة
                        </Text>
                      </Stack>
                    </Group>
                  </Box>
                </SimpleGrid>
              </Stack>
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
