'use client';

import React from 'react';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar, IconChevronDown } from '@tabler/icons-react';
import { useDatePickerMirror } from '../store/useDatePickerMirror';
import { parseDateValue } from '../init/date-picker.init';
import { getUnifiedDatePickerStyles } from './date-picker.styles';

export function DatePickerView() {
  const config = useDatePickerMirror('config');
  const value = useDatePickerMirror('value');
  const isFocused = useDatePickerMirror('isFocused');
  const error = useDatePickerMirror('error');
  const rawProps = useDatePickerMirror('rawProps');
  const setValue = useDatePickerMirror('setValue');
  const setFocused = useDatePickerMirror('setFocused');

  const {
    value: _val,
    defaultValue: _defVal,
    onChange: _onChange,
    onFocus: _onFocus,
    onBlur: _onBlur,
    styles: customStyles,
    error: _err,
    size: _size,
    radius: _radius,
    leftSection: customLeftSection,
    rightSection: customRightSection,
    minDate: rawMinDate,
    maxDate: rawMaxDate,
    placeholder,
    clearable,
    disabled,
    readOnly,
    required,
    withAsterisk,
    label,
    description,
    dropdownType = 'popover',
    ...mantineProps
  } = rawProps;

  const minDate = parseDateValue(rawMinDate);
  const maxDate = parseDateValue(rawMaxDate);

  const defaultLeftSection = (
    <IconCalendar
      size={17}
      stroke={1.6}
      style={{
        color: isFocused
          ? 'var(--mantine-color-primary-6)'
          : 'var(--mantine-color-dimmed)',
      }}
    />
  );

  const defaultRightSection = (
    <IconChevronDown
      size={15}
      stroke={1.8}
      style={{
        color: isFocused
          ? 'var(--mantine-color-primary-6)'
          : 'var(--mantine-color-gray-5)',
      }}
    />
  );

  const unifiedStyles = getUnifiedDatePickerStyles(
    isFocused,
    Boolean(error),
    customStyles,
  );

  return (
    <DatePickerInput
      {...mantineProps}
      value={value}
      onChange={(val: any) => {
        const nextDate = val ? (val instanceof Date ? val : new Date(val)) : null;
        setValue(nextDate && !isNaN(nextDate.getTime()) ? nextDate : null);
      }}
      label={label}
      description={description}
      placeholder={placeholder ?? config.placeholder}
      error={error}
      required={required}
      withAsterisk={withAsterisk}
      clearable={clearable ?? config.clearable}
      disabled={disabled ?? config.disabled}
      readOnly={readOnly ?? config.readOnly}
      minDate={minDate ?? undefined}
      maxDate={maxDate ?? undefined}
      valueFormat={config.valueFormat}
      locale={config.locale}
      dropdownType={dropdownType}
      size={config.size}
      radius={config.radius}
      leftSection={customLeftSection ?? defaultLeftSection}
      rightSection={customRightSection ?? defaultRightSection}
      rightSectionPointerEvents="none"
      styles={unifiedStyles}
      popoverProps={{
        withinPortal: true,
        shadow: 'md',
        radius: 'md',
        offset: 6,
        ...rawProps.popoverProps,
      }}
      onFocus={(e) => {
        setFocused(true);
        rawProps.onFocus?.(e as any);
      }}
      onBlur={(e) => {
        setFocused(false);
        rawProps.onBlur?.(e as any);
      }}
    />
  );
}
