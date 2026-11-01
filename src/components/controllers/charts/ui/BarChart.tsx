'use client';

import { Box, Flex, Group, Text, UnstyledButton, rem } from '@mantine/core';
import { formatNumber } from '@/src/core/format';
import {
  BarChartDataPoint,
  resolveAxisMax,
  resolveDefaultBarIndex,
} from '../init/charts.init';
import { useChartsMirror } from '../store/useChartsMirror';

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
const LABEL_HEIGHT = 30;

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
  const setSelectedIndex = useChartsMirror('setSelectedIndex');

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
                <UnstyledButton
                  key={`${activePeriod}-${point.label}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  onClick={() => {
                    setSelectedIndex(index);
                    onBarClick?.(point, index);
                  }}
                  aria-label={`${point.label}: ${format(point.value)}`}
                  aria-pressed={isSelected}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}
                >
                  <Box style={{ position: 'relative', flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    {showTooltip && (
                      <Box
                        style={{
                          position: 'absolute',
                          left: '50%',
                          bottom: `calc(${heightPercent}% + ${rem(10)})`,
                          transform: 'translateX(-50%)',
                          zIndex: 3,
                          padding: `${rem(5)} ${rem(12)}`,
                          borderRadius: 'var(--app-radius-pill)',
                          backgroundColor: 'var(--mantine-color-primary-6)',
                          border: '1px solid var(--app-border)',
                          color: 'var(--app-text-on-brand)',
                          fontSize: rem(12),
                          whiteSpace: 'nowrap',
                          boxShadow: 'var(--app-elev-2)',
                          pointerEvents: 'none',
                          animation: 'app-tooltip-in 500ms var(--app-ease-soft) both',
                        }}
                      >
                        {point.tooltipBadge ?? (
                          <>
                            {point.label} ·{' '}
                            <Text span inherit fw={500} c="var(--mantine-color-brand-3)">
                              {format(point.value)}
                            </Text>
                          </>
                        )}
                      </Box>
                    )}

                    <Box
                      className="app-chart-bar"
                      data-selected={isSelected || undefined}
                      data-hovered={(isHovered && !isSelected) || undefined}
                      style={{
                        height: `${heightPercent}%`,
                        // Grow-in delay (staggered), then a phase offset for the twist loop.
                        animationDelay: `${index * 0.05}s, ${-index * 0.6}s`,
                      }}
                    />
                  </Box>

                  <Text
                    fw={isSelected ? 500 : 400}
                    style={{
                      height: rem(LABEL_HEIGHT),
                      display: 'flex',
                      alignItems: 'flex-end',
                      fontSize: rem(11.5),
                      whiteSpace: 'nowrap',
                      color: isSelected ? 'var(--app-text-primary)' : 'var(--app-text-muted)',
                      transition: 'color 200ms ease',
                    }}
                  >
                    {point.label}
                  </Text>
                </UnstyledButton>
              );
            })}
          </Flex>
        </Box>
      </Flex>

      {withSummary && (
        <Group gap="lg" mt="md" wrap="wrap">
          <SummaryItem label="المجموع" value={format(total)} />
          <SummaryItem label="المتوسط" value={format(total / points.length)} />
          <SummaryItem label="الذروة" value={points[defaultIndex]?.label ?? '—'} />
        </Group>
      )}
    </Box>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <Text size="xs" fw={300} c="var(--app-text-muted)">
      {label}{' '}
      <Text span fw={500} c="var(--app-text-primary)">
        {value}
      </Text>
    </Text>
  );
}

// Re-exported for page-level fake data typing.
export type { BarChartDataPoint };
