'use client';

import { Box, Text, UnstyledButton, rem } from '@mantine/core';
import { BarChartDataPoint } from '../init/charts.init';
import { useChartsMirror } from '../store/useChartsMirror';

export const LABEL_HEIGHT = 30;

interface BarChartBarProps {
  point: BarChartDataPoint;
  index: number;
  heightPercent: number;
  isSelected: boolean;
  isHovered: boolean;
  showTooltip: boolean;
  format: (value: number) => string;
  onBarClick?: (point: BarChartDataPoint, index: number) => void;
}

/** One bar: hover / focus tooltip, click selection and its label. */
export function BarChartBar({
  point,
  index,
  heightPercent,
  isSelected,
  isHovered,
  showTooltip,
  format,
  onBarClick,
}: BarChartBarProps) {
  const setHoveredIndex = useChartsMirror('setHoveredIndex');
  const setSelectedIndex = useChartsMirror('setSelectedIndex');

  return (
    <UnstyledButton
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
      <Box
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
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
}
