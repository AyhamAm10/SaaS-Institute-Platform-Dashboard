'use client';

import React from 'react';
import { Textarea } from '@mantine/core';
import { useInputMirror } from '../store/useInputMirror';
import { getUnifiedInputStyles } from './shared.styles';

export function TextareaVariant() {
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
    rows,
    minRows,
    maxRows,
    autosize,
    ...mantineProps
  } = rawProps;

  // For textareas, radius="lg" or "xl" looks organic while keeping multiline readable
  const textareaConfig = {
    ...config,
    radius: config.radius === 'xl' ? 'lg' : config.radius,
  };

  const unifiedStyles = getUnifiedInputStyles(textareaConfig, isFocused, customStyles);

  return (
    <Textarea
      {...mantineProps}
      rows={rows}
      minRows={minRows}
      maxRows={maxRows}
      autosize={autosize}
      size={textareaConfig.size}
      radius={textareaConfig.radius}
      value={value ?? ''}
      error={error}
      leftSection={textareaConfig.defaultLeftSection}
      styles={unifiedStyles}
      onChange={(e) => {
        setValue(e.currentTarget.value);
      }}
      onFocus={(e) => {
        setFocused(true);
        rawProps.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        setTouched(true);
        rawProps.onBlur?.(e);
      }}
    />
  );
}
