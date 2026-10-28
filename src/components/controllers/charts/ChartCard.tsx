'use client';

import { useState } from 'react';
import { Paper, rem } from '@mantine/core';
import { ChartCardProps } from './init/charts.init';
import { createChartsStore, ChartsContext } from './store/charts.store';
import { ChartHeader } from './ui/ChartHeader';
import { ChartTabs } from './ui/ChartTabs';
import { BarChart } from './ui/BarChart';
import { CircleChart } from './ui/CircleChart';

export function ChartCard(props: ChartCardProps) {
  const [store] = useState(() => createChartsStore(props));

  return (
    <ChartsContext.Provider value={store}>
      <Paper
        p="lg"
        radius="lg"
        withBorder
        className="stat-card-frosted"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--app-surface)',
          borderColor: 'var(--app-border)',
          borderRadius: rem(16),
          boxShadow: 'var(--app-card-shadow)',
          transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 180ms ease',
        }}
      >
        {(props.title || props.periods) && (
          <ChartHeader
            title={props.title}
            subtitle={props.subtitle}
            actions={<ChartTabs />}
          />
        )}
        {props.children}
      </Paper>
    </ChartsContext.Provider>
  );
}

// Compound Pattern Attachments
ChartCard.Header = ChartHeader;
ChartCard.Tabs = ChartTabs;
ChartCard.Bar = BarChart;
ChartCard.Circle = CircleChart;
