'use client';

import React from 'react';
import { PasswordInput } from '@mantine/core';
import { useInputMirror } from '../store/useInputMirror';
import { getUnifiedInputStyles } from './shared.styles';

export function PasswordInputVariant() {
  const config = useInputMirror('config');
  const value = useInputMirror('value');
  const isFocused = useInputMirror('isFocused');
  const isPasswordVisible = useInputMirror('isPasswordVisible');
  const error = useInputMirror('error');
  const rawProps = useInputMirror('rawProps');
  const setValue = useInputMirror('setValue');
  const setFocused = useInputMirror('setFocused');
  const setTouched = useInputMirror('setTouched');
  const togglePasswordVisibility = useInputMirror('togglePasswordVisibility');

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
    <PasswordInput
      {...mantineProps}
      size={config.size}
      radius={config.radius}
      value={value ?? ''}
      error={error}
      leftSection={config.defaultLeftSection}
      visible={isPasswordVisible}
      onVisibilityChange={togglePasswordVisibility}
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
