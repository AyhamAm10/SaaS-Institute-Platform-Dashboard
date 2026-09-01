'use client';

import { Grid, Stack } from '@mantine/core';
import {
  WelcomeBanner,
  StatsOverview,
  RecentEnrollmentsTable,
  TermProgressCard,
} from './unControllerComponent';

/**
 * RenderUi for Dashboard Home Page
 *
 * Client Component orchestrating the presentation of uncontrolled UI pieces.
 */
export function RenderUi() {
  return (
    <Stack gap="lg">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Metric Cards Grid */}
      <StatsOverview />

      {/* Main Grid: Table & Progress Card */}
      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <RecentEnrollmentsTable />
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <TermProgressCard />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
