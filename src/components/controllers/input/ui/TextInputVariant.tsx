'use client';

import React from 'react';
import { TextInput } from '@mantine/core';
import { useInputMirror } from '../store/useInputMirror';
import { getUnifiedInputStyles } from './shared.styles';

export function TextInputVariant() {
  const config = useInputMirror('config');
  const value = useInputMirror('value');
  const isFocused = useInputMirror('isFocused');
  const error = useInputMirror('error');
  const rawProps = useInputMirror('rawProps');
  const setValue = useInputMirror('setValue');
  const setFocused = useInputMirror('setFocused');
  const setTouched = useInputMirror('setTouched');

  // Strip custom controller props before forwarding to Mantine
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
    ...mantineProps
  } = rawProps;

  const unifiedStyles = getUnifiedInputStyles(config, isFocused, customStyles);

  return (
    <TextInput
      {...mantineProps}
      size={config.size}
      radius={config.radius}
      value={value ?? ''}
      error={error}
      leftSection={config.defaultLeftSection}
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
