'use client';

import React from 'react';
import { Select } from '@mantine/core';
import { useInputMirror } from '../store/useInputMirror';
import { getUnifiedInputStyles } from './shared.styles';

export function SelectVariant() {
  const config = useInputMirror('config');
  const value = useInputMirror('value');
  const isFocused = useInputMirror('isFocused');
  const error = useInputMirror('error');
  const rawProps = useInputMirror('rawProps');
  const setValue = useInputMirror('setValue');
  const setFocused = useInputMirror('setFocused');
  const setTouched = useInputMirror('setTouched');

  const {
    type: _type,
    value: _val,
    defaultValue: _defVal,
    onChange: _onChange,
    onFocus: _onFocus,
    onBlur: _onBlur,
    styles: customStyles,
    dir: _dir,
    error: _err,
    size: _size,
    radius: _radius,
    leftSection: _ls,
    data = [],
    searchable = false,
    clearable = false,
    nothingFoundMessage = 'لا توجد نتائج مطابقة',
    checkIconPosition = 'right',
    maxDropdownHeight = 250,
    ...mantineProps
  } = rawProps;

  const unifiedStyles = getUnifiedInputStyles(config, isFocused, customStyles);

  // Normalize string/number/null value for Mantine Select
  const stringValue = value !== null && value !== undefined ? String(value) : null;

  return (
    <Select
      {...mantineProps}
      data={data}
      searchable={searchable}
      clearable={clearable}
      nothingFoundMessage={nothingFoundMessage}
      checkIconPosition={checkIconPosition}
      maxDropdownHeight={maxDropdownHeight}
      size={config.size}
      radius={config.radius}
      value={stringValue}
      error={error}
      leftSection={config.defaultLeftSection}
      styles={unifiedStyles}
      onChange={(val, option) => {
        setValue(val, option);
      }}
      onFocus={(e) => {
        setFocused(true);
        rawProps.onFocus?.(e as any);
      }}
      onBlur={(e) => {
        setFocused(false);
        setTouched(true);
        rawProps.onBlur?.(e as any);
      }}
    />
  );
}
