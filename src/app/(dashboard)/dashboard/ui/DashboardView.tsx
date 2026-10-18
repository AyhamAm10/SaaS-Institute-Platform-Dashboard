'use client';

import { Box, Grid, Stack } from '@mantine/core';
import { DashboardExecutiveBanner } from './DashboardExecutiveBanner';
import { DashboardKpiGrid } from './DashboardKpiGrid';
import { DashboardDistributionCard } from './DashboardDistributionCard';
import { DashboardLiveScheduleCard } from './DashboardLiveScheduleCard';
import { DashboardQuickActions } from './DashboardQuickActions';

export function DashboardView() {
  return (
    <Box p={{ base: 'xs', sm: 'md' }}>
      <Stack gap="xl">
        {/* Top Executive Header */}
        <DashboardExecutiveBanner />

        {/* 4 Bento KPI Cards */}
        <DashboardKpiGrid />

        {/* Analytics & Pulse Split Grid */}
        <Grid gap="md">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <DashboardDistributionCard />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <DashboardLiveScheduleCard />
          </Grid.Col>
        </Grid>

        {/* Quick Operations Dock */}
        <DashboardQuickActions />
      </Stack>
    </Box>
  );
}
