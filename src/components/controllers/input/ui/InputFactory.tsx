'use client';

import React from 'react';
import { useInputMirror } from '../store/useInputMirror';
import { TextInputVariant } from './TextInputVariant';
import { PasswordInputVariant } from './PasswordInputVariant';
import { NumberInputVariant } from './NumberInputVariant';
import { TextareaVariant } from './TextareaVariant';
import { SelectVariant } from './SelectVariant';

/**
 * UI Factory dynamically resolving the proper Mantine input variant
 * while ensuring identical, curved, cohesive design tokens across the application.
 */
export function InputFactory() {
  const config = useInputMirror('config');

  switch (config.type) {
    case 'select':
      return <SelectVariant />;
    case 'password':
      return <PasswordInputVariant />;
    case 'number':
      return <NumberInputVariant />;
    case 'textarea':
      return <TextareaVariant />;
    case 'text':
    case 'email':
    case 'tel':
    case 'search':
    case 'url':
    default:
      return <TextInputVariant />;
  }
}
