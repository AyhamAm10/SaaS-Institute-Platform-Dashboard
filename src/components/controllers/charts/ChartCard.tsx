'use client';

import { useState } from 'react';
import { ChartCardProps } from './init/charts.init';
import { createChartsStore, ChartsContext } from './store/charts.store';
import { AppSurface } from '../surface';
import { ChartHeader } from './ui/ChartHeader';
import { ChartTabs } from './ui/ChartTabs';
import { BarChart } from './ui/BarChart';
import { CircleChart } from './ui/CircleChart';

export function ChartCard(props: ChartCardProps) {
  const [store] = useState(() => createChartsStore(props));

  return (
    <ChartsContext.Provider value={store}>
      <AppSurface
        level={2}
        radius="xl"
        padding="xl"
        className={props.className}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {(props.title || props.periods) && (
          <ChartHeader
            title={props.title}
            subtitle={props.subtitle}
            actions={props.periods ? <ChartTabs /> : undefined}
          />
        )}
        {props.children}
      </AppSurface>
    </ChartsContext.Provider>
  );
}

// Compound Pattern Attachments
ChartCard.Header = ChartHeader;
ChartCard.Tabs = ChartTabs;
ChartCard.Bar = BarChart;
ChartCard.Circle = CircleChart;
