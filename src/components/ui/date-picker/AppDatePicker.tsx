'use client';

import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Input,
  NativeSelect,
  Paper,
  Popover,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  rem,
} from '@mantine/core';
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconX,
} from '@tabler/icons-react';
import { ReactNode, useId, useMemo, useState } from 'react';
import {
  ARABIC_DAYS_SHORT,
  ARABIC_MONTHS,
  formatDateToISO,
  formatDisplayDate,
  generateMonthGrid,
  parseISODate,
} from './date-picker.utils';

export interface AppDatePickerProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  minDate?: string;
  maxDate?: string;
  required?: boolean;
  withAsterisk?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

type PickerView = 'days' | 'months' | 'years';

/**
 * AppDatePicker
 *
 * Authoritative Unified Date Picker Component for the SaaS Platform.
 * Built adhering strictly to role.md Section 5.2 and Modern Curved Organic UI principles.
 *
 * Features:
 * - Native Arabic-first calendar flow (RTL navigation, Arabic months and day names)
 * - Automatic ISO (YYYY-MM-DD) emission for reliable backend API compatibility
 * - Beautiful organic curved popover with month & year quick navigation
 * - One-click "Today" and "Clear" shortcut actions
 */
export function AppDatePicker({
  label,
  description,
  error,
  placeholder = 'اختر التاريخ...',
  value,
  onChange,
  required,
  withAsterisk,
  clearable = true,
  disabled = false,
  readOnly = false,
}: AppDatePickerProps) {
  const inputId = useId();
  const [opened, setOpened] = useState(false);
  const [view, setView] = useState<PickerView>('days');

  // Selected date as Date object
  const selectedDate = useMemo(() => parseISODate(value), [value]);

  // Current browsing year & month in calendar view
  const [viewYear, setViewYear] = useState<number>(() => {
    return selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState<number>(() => {
    return selectedDate ? selectedDate.getMonth() : new Date().getMonth();
  });

  // Calendar days grid
  const monthGrid = useMemo(
    () => generateMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  // Sync calendar view when opened
  const handleOpenPopover = () => {
    if (disabled || readOnly) return;
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
    setView('days');
    setOpened(true);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handlePrevYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewYear((y) => y - 1);
  };

  const handleNextYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewYear((y) => y + 1);
  };

  const handleSelectDay = (isoString: string) => {
    onChange?.(isoString);
    setOpened(false);
  };

  const handleSelectToday = () => {
    const todayStr = formatDateToISO(new Date());
    onChange?.(todayStr);
    setOpened(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange?.(null);
  };

  const displayValue = selectedDate
    ? `${formatDisplayDate(selectedDate)} (${value})`
    : '';

  // Full year options for direct dropdown
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const min = current - 15;
    const max = current + 15;
    const list = [];
    for (let y = min; y <= max; y++) {
      list.push({ value: String(y), label: String(y) });
    }
    return list;
  }, []);

  const monthOptions = useMemo(() => {
    return ARABIC_MONTHS.map((name, index) => ({
      value: String(index),
      label: name,
    }));
  }, []);

  // Quick 5-year pills centered on current year
  const quickYears = useMemo(() => {
    const base = new Date().getFullYear();
    return [base - 1, base, base + 1, base + 2, base + 3];
  }, []);

  // Year range for year picker view
  const yearStart = Math.floor(viewYear / 12) * 12;
  const yearsList = Array.from({ length: 12 }, (_, i) => yearStart + i);

  return (
    <Input.Wrapper
      id={inputId}
      label={label}
      description={description}
      error={error}
      required={required}
      withAsterisk={withAsterisk}
      styles={{
        label: {
          fontWeight: 600,
          fontSize: rem(13),
          marginBottom: rem(4),
          color: 'var(--mantine-color-text)',
        },
        description: {
          fontSize: rem(11.5),
          marginBottom: rem(4),
          color: 'var(--mantine-color-dimmed)',
        },
        error: {
          fontSize: rem(11.5),
          marginTop: rem(4),
        },
      }}
    >
      <Popover
        opened={opened}
        onChange={setOpened}
        position="bottom-start"
        radius="lg"
        shadow="md"
        withArrow
        arrowSize={12}
        offset={6}
        disabled={disabled || readOnly}
      >
        <Popover.Target>
          <Box
            onClick={handleOpenPopover}
            style={{
              cursor: disabled || readOnly ? 'default' : 'pointer',
            }}
          >
            <Input
              id={inputId}
              component="button"
              type="button"
              pointer
              radius="md"
              size="md"
              disabled={disabled}
              leftSection={
                <IconCalendar
                  size={18}
                  style={{
                    color: selectedDate
                      ? 'var(--mantine-color-primary-6)'
                      : 'var(--mantine-color-dimmed)',
                  }}
                />
              }
              rightSection={
                clearable && selectedDate && !disabled && !readOnly ? (
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="gray"
                    radius="xl"
                    onClick={handleClear}
                    aria-label="مسح التاريخ"
                  >
                    <IconX size={14} />
                  </ActionIcon>
                ) : (
                  <IconChevronDown size={14} opacity={0.5} />
                )
              }
              styles={{
                input: {
                  borderRadius: rem(12),
                  borderColor: error
                    ? 'var(--mantine-color-error)'
                    : 'var(--mantine-color-gray-3)',
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  fontSize: rem(13.5),
                  fontWeight: selectedDate ? 500 : 400,
                  color: selectedDate
                    ? 'var(--mantine-color-text)'
                    : 'var(--mantine-color-placeholder)',
                  textAlign: 'right',
                  paddingLeft: rem(36),
                  paddingRight: rem(36),
                  transition: 'border-color 150ms ease, box-shadow 150ms ease',
                  '&:focus': {
                    borderColor: 'var(--mantine-color-primary-6)',
                    boxShadow: '0 0 0 3px rgba(30, 78, 140, 0.1)',
                  },
                },
              }}
            >
              {displayValue || placeholder}
            </Input>
          </Box>
        </Popover.Target>

        <Popover.Dropdown p="xs" style={{ width: rem(330), maxWidth: '95vw' }}>
          <Stack gap="xs">
            {/* Header: Year & Month Direct Selectors + Step Navigators */}
            <Group justify="space-between" align="center" wrap="nowrap" gap={4}>
              {/* Previous Navigators (Right in RTL: السابق) */}
              <Group gap={2} wrap="nowrap">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  size="sm"
                  onClick={handlePrevYear}
                  title="السنة السابقة (-1)"
                >
                  <IconChevronsRight size={15} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  size="sm"
                  onClick={handlePrevMonth}
                  title="الشهر السابق (-1)"
                >
                  <IconChevronRight size={15} />
                </ActionIcon>
              </Group>

              {/* Direct Selectors for Month and Year */}
              <Group gap={4} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                <NativeSelect
                  size="xs"
                  radius="md"
                  value={String(viewMonth)}
                  onChange={(e) => {
                    setViewMonth(Number(e.currentTarget.value));
                    setView('days');
                  }}
                  data={monthOptions}
                  aria-label="اختيار الشهر"
                  style={{ flex: 1.2 }}
                  styles={{
                    input: {
                      height: rem(28),
                      minHeight: rem(28),
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingLeft: rem(14),
                      paddingRight: rem(6),
                      fontSize: rem(12),
                      fontWeight: 600,
                      borderRadius: rem(8),
                      backgroundColor: 'var(--mantine-color-gray-1)',
                      borderColor: 'var(--mantine-color-gray-3)',
                      color: 'var(--mantine-color-primary-8)',
                      cursor: 'pointer',
                      textAlign: 'center',
                    },
                  }}
                />

                <NativeSelect
                  size="xs"
                  radius="md"
                  value={String(viewYear)}
                  onChange={(e) => {
                    setViewYear(Number(e.currentTarget.value));
                    setView('days');
                  }}
                  data={yearOptions}
                  aria-label="اختيار السنة"
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      height: rem(28),
                      minHeight: rem(28),
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingLeft: rem(14),
                      paddingRight: rem(6),
                      fontSize: rem(12),
                      fontWeight: 600,
                      borderRadius: rem(8),
                      backgroundColor: 'var(--mantine-color-gray-1)',
                      borderColor: 'var(--mantine-color-gray-3)',
                      color: 'var(--mantine-color-primary-8)',
                      cursor: 'pointer',
                      textAlign: 'center',
                    },
                  }}
                />
              </Group>

              {/* Next Navigators (Left in RTL: التالي) */}
              <Group gap={2} wrap="nowrap">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  size="sm"
                  onClick={handleNextMonth}
                  title="الشهر التالي (+1)"
                >
                  <IconChevronLeft size={15} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  size="sm"
                  onClick={handleNextYear}
                  title="السنة التالية (+1)"
                >
                  <IconChevronsLeft size={15} />
                </ActionIcon>
              </Group>
            </Group>

            {/* Quick Year Jump Chips */}
            <Group justify="center" gap={4} py={1}>
              <Text size="xs" c="dimmed" fw={500} me={2}>
                السنة:
              </Text>
              {quickYears.map((y) => {
                const isSelected = viewYear === y;
                return (
                  <UnstyledButton
                    key={y}
                    onClick={() => {
                      setViewYear(y);
                      setView('days');
                    }}
                    style={{
                      padding: `${rem(2)} ${rem(8)}`,
                      borderRadius: rem(12),
                      fontSize: rem(11.5),
                      fontWeight: isSelected ? 700 : 500,
                      backgroundColor: isSelected
                        ? 'var(--mantine-color-primary-6)'
                        : 'var(--mantine-color-gray-1)',
                      color: isSelected
                        ? '#ffffff'
                        : 'var(--mantine-color-gray-7)',
                      border: isSelected
                        ? '1px solid var(--mantine-color-primary-7)'
                        : '1px solid var(--mantine-color-gray-2)',
                      transition: 'all 120ms ease',
                      cursor: 'pointer',
                    }}
                  >
                    {y}
                  </UnstyledButton>
                );
              })}
            </Group>

            <Divider color="var(--mantine-color-gray-2)" />

            {/* View 1: Days Grid */}
            {view === 'days' && (
              <Stack gap="xs">
                {/* Days of week header */}
                <SimpleGrid cols={7} spacing={4}>
                  {ARABIC_DAYS_SHORT.map((dayName) => (
                    <Text
                      key={dayName}
                      ta="center"
                      size="xs"
                      fw={600}
                      c="dimmed"
                      py={2}
                    >
                      {dayName}
                    </Text>
                  ))}
                </SimpleGrid>

                {/* Calendar Days */}
                <SimpleGrid cols={7} spacing={4}>
                  {monthGrid.map((day) => {
                    const isSelected = value === day.isoString;
                    return (
                      <UnstyledButton
                        key={day.isoString}
                        onClick={() => handleSelectDay(day.isoString)}
                        style={{
                          height: rem(34),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: rem(10),
                          fontSize: rem(13),
                          fontWeight: isSelected ? 700 : day.isToday ? 600 : 400,
                          backgroundColor: isSelected
                            ? 'var(--mantine-color-primary-6)'
                            : 'transparent',
                          color: isSelected
                            ? '#ffffff'
                            : day.isCurrentMonth
                              ? 'var(--mantine-color-text)'
                              : 'var(--mantine-color-gray-4)',
                          border: day.isToday && !isSelected
                            ? '1.5px solid var(--mantine-color-primary-4)'
                            : 'none',
                          transition: 'all 120ms ease',
                          cursor: 'pointer',
                        }}
                      >
                        {day.dayNumber}
                      </UnstyledButton>
                    );
                  })}
                </SimpleGrid>
              </Stack>
            )}

            {/* View 2: Month Picker Grid */}
            {view === 'months' && (
              <SimpleGrid cols={3} spacing="xs" py="xs">
                {ARABIC_MONTHS.map((mName, index) => {
                  const isCurrentSelected =
                    selectedDate &&
                    selectedDate.getFullYear() === viewYear &&
                    selectedDate.getMonth() === index;
                  return (
                    <Button
                      key={mName}
                      size="xs"
                      radius="md"
                      variant={isCurrentSelected ? 'filled' : 'subtle'}
                      color={isCurrentSelected ? 'primary' : 'gray'}
                      onClick={() => {
                        setViewMonth(index);
                        setView('days');
                      }}
                    >
                      {mName}
                    </Button>
                  );
                })}
              </SimpleGrid>
            )}

            {/* View 3: Year Picker Grid */}
            {view === 'years' && (
              <SimpleGrid cols={3} spacing="xs" py="xs">
                {yearsList.map((yNum) => {
                  const isCurrentSelected =
                    selectedDate && selectedDate.getFullYear() === yNum;
                  return (
                    <Button
                      key={yNum}
                      size="xs"
                      radius="md"
                      variant={isCurrentSelected ? 'filled' : 'subtle'}
                      color={isCurrentSelected ? 'primary' : 'gray'}
                      onClick={() => {
                        setViewYear(yNum);
                        setView('months');
                      }}
                    >
                      {yNum}
                    </Button>
                  );
                })}
              </SimpleGrid>
            )}

            {/* Footer Shortcuts */}
            <Divider color="var(--mantine-color-gray-2)" mt={4} />
            <Group justify="space-between" align="center" pt={2}>
              <Button
                variant="subtle"
                size="xs"
                radius="xl"
                color="primary"
                onClick={handleSelectToday}
              >
                اليوم
              </Button>
              {selectedDate && (
                <Button
                  variant="subtle"
                  size="xs"
                  radius="xl"
                  color="gray"
                  onClick={() => handleClear()}
                >
                  مسح
                </Button>
              )}
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Input.Wrapper>
  );
}

function IconChevronDown(props: { size?: number; opacity?: number }) {
  return (
    <svg
      width={props.size ?? 16}
      height={props.size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: props.opacity ?? 1 }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
