'use client';

import { useState } from 'react';
import { Paper, Stack, rem } from '@mantine/core';
import { StatCardProps } from './init/stats.init';
import { createStatsStore, StatsContext } from './store/stats.store';
import { StatCardIcon } from './ui/StatCardIcon';
import { StatCardTitle } from './ui/StatCardTitle';
import { StatCardContent } from './ui/StatCardContent';
import { StatCardProgress } from './ui/StatCardProgress';
import { StatCardAction } from './ui/StatCardAction';

export function StatCard(props: StatCardProps) {
  const [store] = useState(() => createStatsStore(props));

  return (
    <StatsContext.Provider value={store}>
      <Paper
        p="lg"
        radius="xl"
        withBorder
        className="stat-card-frosted"
        style={{
          height: '100%',
          minHeight: rem(175),
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--app-surface)',
          borderColor: 'var(--app-border)',
          borderRadius: rem(18),
          boxShadow: 'var(--app-card-shadow)',
          transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 180ms ease, border-color 180ms ease',
        }}
      >
        <Stack gap="xs" style={{ height: '100%', flex: 1, justifyContent: 'space-between' }}>
          {props.children}
        </Stack>
      </Paper>
    </StatsContext.Provider>
  );
}

// Compound Pattern Attachments
StatCard.Icon = StatCardIcon;
StatCard.Title = StatCardTitle;
StatCard.Content = StatCardContent;
StatCard.Progress = StatCardProgress;
StatCard.Action = StatCardAction;
