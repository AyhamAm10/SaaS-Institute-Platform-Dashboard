'use client';

import { Grid, rem } from '@mantine/core';
import { Children, ReactNode } from 'react';

export interface AppModuleChartsProps {
  children?: ReactNode;
  ratio?: 'split' | 'main-side'; // split = 6/6, main-side = 7/5 or 8/4
}

export function AppModuleCharts({ children, ratio = 'main-side' }: AppModuleChartsProps) {
  if (!children) return null;

  const array = Children.toArray(children);
  const isMainSide = ratio === 'main-side';

  return (
    <Grid gap="md" mb={rem(18)}>
      {array.map((child, idx) => {
        // If there are 2 children, assign 7 cols for first, 5 for second on lg
        const span =
          array.length === 2 && isMainSide
            ? idx === 0
              ? { base: 12, lg: 7 }
              : { base: 12, lg: 5 }
            : { base: 12, md: 6 };

        return (
          <Grid.Col key={idx} span={span}>
            {child}
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
