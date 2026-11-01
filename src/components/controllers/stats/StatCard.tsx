'use client';

import { useState } from 'react';
import { Stack, rem } from '@mantine/core';
import { StatCardProps } from './init/stats.init';
import { createStatsStore, StatsContext } from './store/stats.store';
import { AppSurface } from '../surface';
import { StatCardIcon } from './ui/StatCardIcon';
import { StatCardTitle } from './ui/StatCardTitle';
import { StatCardContent } from './ui/StatCardContent';
import { StatCardProgress } from './ui/StatCardProgress';
import { StatCardAction } from './ui/StatCardAction';

export function StatCard(props: StatCardProps) {
  const [store] = useState(() => createStatsStore(props));

  return (
    <StatsContext.Provider value={store}>
      <AppSurface
        level={2}
        radius="lg"
        padding="lg"
        interactive
        className={props.className}
        style={{ height: '100%', minHeight: rem(190), display: 'flex', flexDirection: 'column' }}
      >
        <Stack gap="sm" style={{ height: '100%', flex: 1, justifyContent: 'space-between' }}>
          {props.children}
        </Stack>
      </AppSurface>
    </StatsContext.Provider>
  );
}

// Compound Pattern Attachments
StatCard.Icon = StatCardIcon;
StatCard.Title = StatCardTitle;
StatCard.Content = StatCardContent;
StatCard.Progress = StatCardProgress;
StatCard.Action = StatCardAction;
