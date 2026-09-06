'use client';

import React from 'react';
import { NumberInput } from '@mantine/core';
import { useInputMirror } from '../store/useInputMirror';
import { getUnifiedInputStyles } from './shared.styles';

export function NumberInputVariant() {
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
    min,
    max,
    step,
    ...mantineProps
  } = rawProps;

  const unifiedStyles = getUnifiedInputStyles(config, isFocused, customStyles);

  return (
    <NumberInput
      {...mantineProps}
      min={min}
      max={max}
      step={step}
      size={config.size}
      radius={config.radius}
      value={value}
      error={error}
      leftSection={config.defaultLeftSection}
      styles={unifiedStyles}
      onChange={(val) => {
        setValue(val);
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
