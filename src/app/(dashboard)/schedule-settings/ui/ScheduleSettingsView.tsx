'use client';

import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCalendar,
  IconCheck,
  IconClock,
  IconCoffee,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { AppInput } from '@/src/components/controllers';
import { useScheduleSettingsMirror } from '../store/useScheduleSettingsMirror';

const DAYS_OF_WEEK = [
  { value: 0, label: 'الأحد' },
  { value: 1, label: 'الإثنين' },
  { value: 2, label: 'الثلاثاء' },
  { value: 3, label: 'الأربعاء' },
  { value: 4, label: 'الخميس' },
  { value: 5, label: 'الجمعة' },
  { value: 6, label: 'السبت' },
];

interface ScheduleSettingsViewProps {
  onSave: () => void;
  newBreakName: string;
  setNewBreakName: (v: string) => void;
  newBreakStart: string;
  setNewBreakStart: (v: string) => void;
  newBreakEnd: string;
  setNewBreakEnd: (v: string) => void;
  onAddBreak: () => void;
}

export function ScheduleSettingsView({
  onSave,
  newBreakName,
  setNewBreakName,
  newBreakStart,
  setNewBreakStart,
  newBreakEnd,
  setNewBreakEnd,
  onAddBreak,
}: ScheduleSettingsViewProps) {
  const form = useScheduleSettingsMirror('form');
  const formErrors = useScheduleSettingsMirror('formErrors');
  const generalError = useScheduleSettingsMirror('generalError');
  const generalSuccess = useScheduleSettingsMirror('generalSuccess');
  const isSubmitting = useScheduleSettingsMirror('isSubmitting');
  const isLoading = useScheduleSettingsMirror('isLoading');
  const slots = useScheduleSettingsMirror('slots');

  const setWorkingDays = useScheduleSettingsMirror('setWorkingDays');
  const setDayStartTime = useScheduleSettingsMirror('setDayStartTime');
  const setDayEndTime = useScheduleSettingsMirror('setDayEndTime');
  const setPeriodDurationMinutes = useScheduleSettingsMirror('setPeriodDurationMinutes');
  const removeBreak = useScheduleSettingsMirror('removeBreak');

  const toggleDay = (dayVal: number) => {
    if (form.workingDays.includes(dayVal)) {
      setWorkingDays(form.workingDays.filter((d) => d !== dayVal));
    } else {
      setWorkingDays([...form.workingDays, dayVal].sort());
    }
  };

  if (isLoading) {
    return (
      <Stack gap="lg" p="md">
        <Skeleton height={50} radius="xl" />
        <Skeleton height={200} radius="xl" />
        <Skeleton height={200} radius="xl" />
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <Paper p="lg" radius="xl" withBorder>
        <Group justify="space-between" align="center" wrap="wrap">
          <Stack gap={4}>
            <Title order={2} fw={800}>
              إعدادات الجدول والدوام المدرسي
            </Title>
            <Text c="dimmed" size="sm">
              ضبط أيام العمل، ساعات الدوام، مدد الحصص والاستراحات لإنشاء الحصص تلقائياً
            </Text>
          </Stack>
          <Button
            leftSection={<IconDeviceFloppy size={18} />}
            radius="xl"
            size="md"
            loading={isSubmitting}
            onClick={onSave}
          >
            حفظ التغييرات
          </Button>
        </Group>
      </Paper>

      {/* Alerts */}
      {generalError && (
        <Alert
          icon={<IconAlertCircle size={18} />}
          color="red"
          radius="xl"
          title="خطأ في الإعدادات"
        >
          {generalError}
        </Alert>
      )}

      {generalSuccess && (
        <Alert
          icon={<IconCheck size={18} />}
          color="teal"
          radius="xl"
          title="تم الحفظ بنجاح"
        >
          {generalSuccess}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {/* Left Column: Form Settings */}
        <div>
          <Stack gap="lg">
            {/* Working Days */}
            <Paper p="lg" radius="xl" withBorder>
              <Stack gap="md">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="xl" variant="light" color="blue">
                    <IconCalendar size={18} />
                  </ThemeIcon>
                  <Text fw={700} size="md">
                    أيام الدوام الأسبوعي
                  </Text>
                </Group>
                <Text size="xs" c="dimmed">
                  حدد الأيام التي تُقام فيها الدروس الأكاديمية
                </Text>

                <Group gap="xs">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = form.workingDays.includes(day.value);
                    return (
                      <Button
                        key={day.value}
                        variant={isSelected ? 'filled' : 'light'}
                        color={isSelected ? 'blue' : 'gray'}
                        radius="xl"
                        size="sm"
                        onClick={() => toggleDay(day.value)}
                      >
                        {day.label}
                      </Button>
                    );
                  })}
                </Group>
                {formErrors.workingDays && (
                  <Text c="red" size="xs">
                    {formErrors.workingDays}
                  </Text>
                )}
              </Stack>
            </Paper>

            {/* Daily Hours & Lesson Duration */}
            <Paper p="lg" radius="xl" withBorder>
              <Stack gap="md">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="xl" variant="light" color="teal">
                    <IconClock size={18} />
                  </ThemeIcon>
                  <Text fw={700} size="md">
                    ساعات الدوام ومدة الحصة
                  </Text>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                  <AppInput
                    label="بداية الدوام"
                    description="مثال: 08:00"
                    placeholder="08:00"
                    value={form.dayStartTime}
                    onChange={(val) => setDayStartTime(val)}
                    error={formErrors.dayStartTime}
                  />
                  <AppInput
                    label="نهاية الدوام"
                    description="مثال: 14:00"
                    placeholder="14:00"
                    value={form.dayEndTime}
                    onChange={(val) => setDayEndTime(val)}
                    error={formErrors.dayEndTime}
                  />
                  <AppInput
                    label="مدة الحصة (دقيقة)"
                    description="عادة 45 دقيقة"
                    placeholder="45"
                    type="number"
                    value={String(form.periodDurationMinutes)}
                    onChange={(val) => setPeriodDurationMinutes(Number(val) || 45)}
                    error={formErrors.periodDurationMinutes}
                  />
                </SimpleGrid>
              </Stack>
            </Paper>

            {/* Breaks Manager */}
            <Paper p="lg" radius="xl" withBorder>
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <ThemeIcon size="md" radius="xl" variant="light" color="orange">
                      <IconCoffee size={18} />
                    </ThemeIcon>
                    <Text fw={700} size="md">
                      فترات الاستراحة والفسحة
                    </Text>
                  </Group>
                  <Badge variant="light" color="orange" radius="xl">
                    {form.breaks.length} استراحات
                  </Badge>
                </Group>

                {/* Add Break Bar */}
                <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="xs">
                  <AppInput
                    placeholder="اسم الاستراحة (مثال: الفسحة الأولى)"
                    value={newBreakName}
                    onChange={(val) => setNewBreakName(val)}
                  />
                  <AppInput
                    placeholder="البداية (09:30)"
                    value={newBreakStart}
                    onChange={(val) => setNewBreakStart(val)}
                  />
                  <AppInput
                    placeholder="النهاية (10:00)"
                    value={newBreakEnd}
                    onChange={(val) => setNewBreakEnd(val)}
                  />
                  <Button
                    leftSection={<IconPlus size={16} />}
                    radius="xl"
                    variant="light"
                    color="orange"
                    onClick={onAddBreak}
                    disabled={!newBreakName.trim() || !newBreakStart || !newBreakEnd}
                  >
                    إضافة استراحة
                  </Button>
                </SimpleGrid>

                {/* Existing Breaks List */}
                {form.breaks.length === 0 ? (
                  <Text size="sm" c="dimmed" ta="center" py="xs">
                    لا توجد استراحات مضافة حالياً
                  </Text>
                ) : (
                  <Stack gap="xs">
                    {form.breaks.map((b, idx) => (
                      <Paper
                        key={idx}
                        p="xs"
                        radius="lg"
                        withBorder
                        bg="var(--mantine-color-gray-0)"
                      >
                        <Group justify="space-between" align="center">
                          <Group gap="xs">
                            <ThemeIcon size="sm" radius="xl" color="orange" variant="light">
                              <IconCoffee size={14} />
                            </ThemeIcon>
                            <Text size="sm" fw={600}>
                              {b.name}
                            </Text>
                            <Badge variant="outline" color="gray" size="sm">
                              {b.startTime} - {b.endTime}
                            </Badge>
                          </Group>
                          <Tooltip label="حذف الاستراحة">
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              radius="xl"
                              onClick={() => removeBreak(idx)}
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
            </Paper>
          </Stack>
        </div>

        {/* Right Column: Live Calculated Slots Preview */}
        <div>
          <Paper p="lg" radius="xl" withBorder h="100%">
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Title order={4} fw={700}>
                  معاينة الحصص المحسوبة
                </Title>
                <Badge color="teal" variant="light" radius="xl">
                  {slots.filter((s) => s.type === 'LESSON').length} حصص يومياً
                </Badge>
              </Group>
              <Text size="xs" c="dimmed">
                هذه الفترات الزمنية تُنشأ تلقائياً وتُستخدم كخانات ثابتة في الجداول الأسبوعية
              </Text>
              <Divider />

              {slots.length === 0 ? (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  اضغط على "حفظ التغييرات" لاحتساب الفترات
                </Text>
              ) : (
                <Stack gap="xs">
                  {slots.map((s, idx) => {
                    const isBreak = s.type === 'BREAK';
                    return (
                      <Card
                        key={idx}
                        p="xs"
                        radius="lg"
                        withBorder
                        bg={isBreak ? 'var(--mantine-color-orange-0)' : undefined}
                      >
                        <Group justify="space-between" align="center">
                          <Group gap="xs">
                            <Badge
                              color={isBreak ? 'orange' : 'blue'}
                              variant={isBreak ? 'filled' : 'light'}
                              radius="xl"
                              size="sm"
                            >
                              {isBreak ? 'استراحة' : `الحصة ${s.periodNumber}`}
                            </Badge>
                            {isBreak && (
                              <Text size="xs" fw={600} c="orange.8">
                                {s.name}
                              </Text>
                            )}
                          </Group>
                          <Text size="xs" fw={700} dir="ltr">
                            {s.startTime} - {s.endTime}
                          </Text>
                        </Group>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </Paper>
        </div>
      </SimpleGrid>
    </Stack>
  );
}
