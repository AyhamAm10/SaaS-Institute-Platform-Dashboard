'use client';

import { Box, Flex, Group, Stack, Text, rem } from '@mantine/core';
import { CircleChartSegment } from '../init/charts.init';

export interface CircleChartProps {
  segments: CircleChartSegment[];
  totalLabel?: string;
  size?: number;
  strokeWidth?: number;
}

const DEFAULT_COLORS = [
  'var(--app-brand-primary)',
  'var(--app-brand-accent)',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
];

export function CircleChart({
  segments,
  totalLabel = 'إجمالي الحالات',
  size = 180,
  strokeWidth = 18,
}: CircleChartProps) {
  if (!segments || segments.length === 0) return null;

  const totalValue = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <Stack align="center" gap="md" style={{ width: '100%', padding: rem(8) }}>
      {/* SVG Donut Circle */}
      <Box style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--app-subtle)"
            strokeWidth={strokeWidth}
          />
          {/* Donut Segments */}
          {segments.map((seg, idx) => {
            const percent = seg.value / totalValue;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -(circumference * accumulatedPercent);
            accumulatedPercent += percent;
            const color = seg.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dasharray 400ms ease, stroke-dashoffset 400ms ease',
                }}
              />
            );
          })}
        </svg>

        {/* Center Total Counter */}
        <Stack
          align="center"
          justify="center"
          gap={1}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}
        >
          <Text fw={800} style={{ fontSize: rem(22), color: 'var(--app-text-primary)' }}>
            {totalValue}
          </Text>
          <Text size="xs" c="dimmed" style={{ fontSize: rem(11) }}>
            {totalLabel}
          </Text>
        </Stack>
      </Box>

      {/* Legend Breakdown List */}
      <Flex wrap="wrap" justify="center" gap="md" mt={rem(4)}>
        {segments.map((seg, idx) => {
          const color = seg.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
          const pct = Math.round((seg.value / totalValue) * 100);

          return (
            <Group key={idx} gap={6} align="center">
              <Box
                style={{
                  width: rem(8),
                  height: rem(8),
                  borderRadius: '50%',
                  backgroundColor: color,
                }}
              />
              <Text size="xs" fw={500} style={{ fontSize: rem(12), color: 'var(--app-text-secondary)' }}>
                {seg.label}:
              </Text>
              <Text size="xs" fw={700} style={{ fontSize: rem(12), color: 'var(--app-text-primary)' }}>
                {seg.value} ({pct}%)
              </Text>
            </Group>
          );
        })}
      </Flex>
    </Stack>
  );
}
