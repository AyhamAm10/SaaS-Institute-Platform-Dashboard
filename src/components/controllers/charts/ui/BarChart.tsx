'use client';

import { Box, Flex, Text, rem } from '@mantine/core';
import { formatNumber } from '@/src/core/format';
import { BarChartDataPoint, resolveAxisMax, resolveDefaultBarIndex } from '../init/charts.init';
import { useChartsMirror } from '../store/useChartsMirror';
import { BarChartBar, LABEL_HEIGHT } from './BarChartBar';
import { BarChartSummary } from './BarChartSummary';

export interface BarChartProps {
  /** Static dataset (used when `datasets` has no entry for the active period). */
  data?: BarChartDataPoint[];
  /** One dataset per period label, e.g. { 'يومي': [...], 'أسبوعي': [...] }. */
  datasets?: Record<string, BarChartDataPoint[]>;
  /** Unit appended to values and axis ticks. */
  unit?: string;
  maxHeight?: number;
  /** Called when a bar is clicked (after it becomes the selected bar). */
  onBarClick?: (point: BarChartDataPoint, index: number) => void;
  /** Shows total / average / peak under the chart. */
  withSummary?: boolean;
}

const AXIS_TICKS = [1, 0.75, 0.5, 0.25, 0];

/**
 * Interactive bar chart.
 * - Period tabs (ChartCard) switch the dataset; bars are keyed by period, so they remount and grow in.
 * - Hover shows a tooltip; click selects a bar (orange). The default selection is the peak.
 * - Bars are pill cylinders with side shading and moving diagonal stripes, so they appear to twist.
 */
export function BarChart({
  data = [],
  datasets,
  unit = 'h',
  maxHeight = 240,
  onBarClick,
  withSummary = true,
}: BarChartProps) {
  const activePeriod = useChartsMirror('activePeriod');
  const hoveredIndex = useChartsMirror('hoveredIndex');
  const selectedIndex = useChartsMirror('selectedIndex');
  const setHoveredIndex = useChartsMirror('setHoveredIndex');
  const points = datasets?.[activePeriod] ?? data;
  const axisMax = resolveAxisMax(points.map((p) => p.value));
  const defaultIndex = resolveDefaultBarIndex(points);
  const activeSelected = selectedIndex ?? defaultIndex;
  const tooltipIndex = hoveredIndex ?? activeSelected;

  if (points.length === 0) return null;

  const format = (value: number) => `${formatNumber(Math.round(value * 10) / 10)}${unit}`;
  const total = points.reduce((sum, p) => sum + p.value, 0);

  return (
    <Box style={{ width: '100%' }}>
      <Flex gap={rem(10)} style={{ height: maxHeight, paddingTop: rem(40) }}>
        {/* Y axis */}
        <Flex
          direction="column"
          justify="space-between"
          style={{ width: rem(34), flexShrink: 0, paddingBottom: rem(LABEL_HEIGHT) }}
        >
          {AXIS_TICKS.map((tick) => (
            <Text key={tick} fw={300} style={{ fontSize: rem(11), lineHeight: 0, color: 'var(--app-text-muted)' }}>
              {format(axisMax * tick)}
            </Text>
          ))}
        </Flex>

        {/* Plot */}
        <Box style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <Flex
            direction="column"
            justify="space-between"
            style={{ position: 'absolute', inset: 0, bottom: rem(LABEL_HEIGHT), pointerEvents: 'none' }}
          >
            {AXIS_TICKS.map((tick) => (
              <Box key={tick} style={{ borderTop: '1px dashed var(--app-border)' }} />
            ))}
          </Flex>

          <Flex
            justify="space-around"
            align="stretch"
            style={{ position: 'absolute', inset: 0 }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {points.map((point, index) => {
              const heightPercent = Math.max(4, (point.value / axisMax) * 100);
              const isSelected = index === activeSelected;
              const isHovered = index === hoveredIndex;
              const showTooltip = index === tooltipIndex;

              return (
                <BarChartBar
                  key={`${activePeriod}-${point.label}`}
                  point={point}
                  index={index}
                  heightPercent={heightPercent}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  showTooltip={showTooltip}
                  format={format}
                  onBarClick={onBarClick}
                />
              );
            })}
          </Flex>
        </Box>
      </Flex>

      {withSummary && (
        <BarChartSummary
          total={format(total)}
          average={format(total / points.length)}
          peak={points[defaultIndex]?.label ?? '—'}
        />
      )}
    </Box>
  );
}

// Re-exported for page-level fake data typing.
export type { BarChartDataPoint };
