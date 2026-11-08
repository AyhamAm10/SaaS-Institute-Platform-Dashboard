'use client';

import { Suspense } from 'react';
import { SettingsController } from './SettingsController';

export function RenderUi() {
  return (
    <Suspense fallback={null}>
      <SettingsController />
    </Suspense>
  );
}

