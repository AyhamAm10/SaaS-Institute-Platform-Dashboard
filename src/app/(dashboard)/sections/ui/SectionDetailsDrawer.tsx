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
import { AppDrawer, AppSelect } from '@/src/components/controllers';
import {
  useSectionDetailsQuery,
  useSectionSubjectsQuery,
  useSubjectsQuery,
} from '@/src/core/api';
import { sectionFormLabels } from '../static-data/sections.data';
import { useSectionsMirror } from '../store/useSectionsMirror';

export interface SectionDetailsDrawerProps {
  opened: boolean;
  onClose: () => void;
  sectionId: number | null;
  onAssignSubject?: (sectionId: number, subjectId: number) => Promise<void>;
  onRemoveSubject?: (sectionId: number, subjectId: number) => Promise<void>;
}

/**
 * SectionDetailsDrawer
 *
 * Displays full section details, counts, and allows managing assigned subjects.
 * Strictly adheres to role.md.
 * ZERO useState hooks — all states read from useSectionsMirror.
 */
export function SectionDetailsDrawer({
  opened,
  onClose,
  sectionId,
  onAssignSubject,
  onRemoveSubject,
}: SectionDetailsDrawerProps) {
  const { data: details, isLoading } = useSectionDetailsQuery(sectionId ?? 0);
  const { data: sectionSubjects, isLoading: loadingSubjects } =
    useSectionSubjectsQuery(sectionId ?? 0);
  const { data: instituteSubjects } = useSubjectsQuery({ limit: 100 });

  // ── Mirror state for assigning / removing subjects ──
  const assignSubjectId = useSectionsMirror('assignSubjectId');
  const setAssignSubjectId = useSectionsMirror('setAssignSubjectId');
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
      (instituteSubjects?.data ?? [])
        .filter((s) => !assignedSubjectIds.has(s.id))
        .map((s) => ({
          value: String(s.id),
          label: `${s.name} (${s.code})`,
        })),
    [instituteSubjects, assignedSubjectIds],
  );

  const handleAssign = async () => {
    if (!sectionId || !assignSubjectId || !onAssignSubject) return;
    await onAssignSubject(sectionId, Number(assignSubjectId));
  };

  const handleRemove = async (subjectId: number) => {
    if (!sectionId || !onRemoveSubject) return;
    await onRemoveSubject(sectionId, subjectId);
  };

  return (
    <AppDrawer
      opened={opened}
      onClose={onClose}
      size="md"
      loading={isLoading}
    >
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconInfoCircle size={20} />} color="blue" />
        <AppDrawer.Title>{sectionFormLabels.detailsTitle}</AppDrawer.Title>
        <AppDrawer.Description>
          {details?.name
            ? `بيانات وإحصائيات شُعبة ${details.name}`
            : 'عرض تفاصيل الشُعبة والمقررات المسندة'}
        </AppDrawer.Description>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        {details && (
          <Stack gap="lg">
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
                  label="فرع المعهد"
                  value={details.branch?.name ?? 'الفرع الرئيسي'}
                  icon={<IconMapPin size={16} />}
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
              title="إحصائيات الشُعبة"
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

            {/* Section Subjects Management */}
            <AppDrawer.Section
              title={
                <Group justify="space-between" align="center" style={{ width: '100%' }}>
                  <Text fw={700} size="sm">
                    المواد الدراسية المقررة للشُعبة
                  </Text>
                  <Badge variant="filled" color="indigo" size="sm" radius="xl">
                    {sectionSubjects?.length ?? 0} مواد
                  </Badge>
                </Group>
              }
              description="إسناد المواد التعليمية المعتمدة في المعهد لهذه الشُعبة"
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
                  <Group align="flex-end" gap="xs">
                    <Box style={{ flex: 1 }}>
                      <AppSelect
                        label="إسناد مادة دراسية جديدة"
                        placeholder={
                          availableSubjectOptions.length === 0
                            ? 'جميع مواد المعهد مسندة بالفعل'
                            : 'اختر مادة دراسية...'
                        }
                        data={availableSubjectOptions}
                        value={assignSubjectId}
                        onChange={(val: any) => setAssignSubjectId(val as string | null)}
                        disabled={availableSubjectOptions.length === 0}
                        clearable
                        searchable
                        size="xs"
                      />
                    </Box>
                    <Button
                      variant="light"
                      color="indigo"
                      size="xs"
                      radius="xl"
                      onClick={handleAssign}
                      disabled={!assignSubjectId || isAssigningSubject}
                      loading={isAssigningSubject}
                      leftSection={<IconPlus size={14} />}
                    >
                      إسناد المادة
                    </Button>
                  </Group>
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
                      لم يتم إسناد أي مواد دراسية لهذه الشُعبة بعد.
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
                            <Stack gap={0}>
                              <Text size="sm" fw={600}>
                                {item.subject.name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                رمز المادة: {item.subject.code}
                              </Text>
                            </Stack>
                          </Group>

                          <Group gap="xs">
                            <Badge size="xs" variant="light" color="indigo">
                              {item.subject.code}
                            </Badge>
                            {onRemoveSubject && (
                              <Tooltip
                                label="إزالة المادة من هذه الشُعبة"
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
                                  aria-label="إزالة المادة من الشُعبة"
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
