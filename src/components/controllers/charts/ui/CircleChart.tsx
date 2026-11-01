'use client';

import { useEffect, useId, useState } from 'react';
import { Box, Group, Stack, Text, rem } from '@mantine/core';
import { formatNumber } from '@/src/core/format';
import { CircleChartSegment } from '../init/charts.init';

export interface CircleChartProps {
  segments: CircleChartSegment[];
  totalLabel?: string;
  size?: number;
  strokeWidth?: number;
}

/** First segment = orange gradient, second = ink, then quieter neutrals. */
const DEFAULT_COLORS = ['brand', 'var(--app-text-primary)', 'var(--app-text-muted)', 'var(--app-border-hover)'];

export function CircleChart({
  segments,
  totalLabel = 'إجمالي الحالات',
  size = 200,
  strokeWidth = 16,
}: CircleChartProps) {
  const gradientId = useId();
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!segments || segments.length === 0) return null;

  const totalValue = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Small visual gap between round-capped segments.
  const gap = segments.length > 1 ? strokeWidth * 0.9 : 0;

  // Start offset of each segment along the circle.
  const offsets = segments.map((_, idx) =>
    segments.slice(0, idx).reduce((sum, s) => sum + circumference * (s.value / totalValue), 0),
  );
  const colorFor = (seg: CircleChartSegment, idx: number) => {
    const color = seg.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
    return color === 'brand' ? `url(#${gradientId})` : color;
  };

  return (
    <Stack align="center" gap="lg" style={{ width: '100%', padding: rem(4) }}>
      <Box style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" style={{ stopColor: 'var(--mantine-color-brand-3)' }} />
              <stop offset="100%" style={{ stopColor: 'var(--mantine-color-brand-7)' }} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--app-sidebar-subtle)"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg, idx) => {
            const length = Math.max(0, circumference * (seg.value / totalValue) - gap);
            const offset = -offsets[idx];

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={colorFor(seg, idx)}
                strokeWidth={strokeWidth}
                strokeDasharray={`${drawn ? length : 0} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: `stroke-dasharray 1.1s var(--app-ease-soft) ${idx * 0.15}s` }}
              />
            );
          })}
        </svg>

        <Stack align="center" justify="center" gap={2} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <Text fw={500} style={{ fontSize: rem(34), lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--app-text-primary)' }}>
            {formatNumber(totalValue)}
          </Text>
          <Text fw={300} style={{ fontSize: rem(12), color: 'var(--app-text-muted)' }}>
            {totalLabel}
          </Text>
        </Stack>
      </Box>

      <Stack gap={10} style={{ width: '100%' }}>
        {segments.map((seg, idx) => {
          const color = seg.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
          const pct = Math.round((seg.value / totalValue) * 100);

          return (
            <Group key={idx} gap="sm" wrap="nowrap">
              <Box
                style={{
                  width: rem(10),
                  height: rem(10),
                  borderRadius: rem(4),
                  flexShrink: 0,
                  background: color === 'brand' ? 'var(--mantine-color-brand-6)' : color,
                }}
              />
              <Text size="sm" fw={400} c="var(--app-text-secondary)" style={{ flex: 1 }}>
                {seg.label}
              </Text>
              <Text size="sm" fw={500} c="var(--app-text-primary)">
                {formatNumber(seg.value)}
              </Text>
              <Text size="xs" fw={300} c="var(--app-text-muted)" w={rem(38)} ta="left">
                {pct}%
              </Text>
            </Group>
          );
        })}
      </Stack>
    </Stack>
  );
}
