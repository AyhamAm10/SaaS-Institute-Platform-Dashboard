'use client';

import { Box, Flex, Group, Stack, Text, rem } from '@mantine/core';
import { BarChartDataPoint } from '../init/charts.init';

export interface BarChartProps {
  data: BarChartDataPoint[];
  yAxisLabels?: string[];
  maxHeight?: number;
  highlightColor?: string;
  defaultBarColor?: string;
}

export function BarChart({
  data,
  yAxisLabels = ['24h', '16h', '8h', '4h', '0h'],
  maxHeight = 220,
  highlightColor = 'var(--app-brand-primary)',
  defaultBarColor = 'var(--app-subtle)',
}: BarChartProps) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 24);

  return (
    <Box style={{ width: '100%', position: 'relative', paddingTop: rem(28) }}>
      {/* Chart Grid Lines and Bars Area */}
      <Box style={{ position: 'relative', height: maxHeight, width: '100%' }}>
        {/* Horizontal Guidelines & Y-Axis */}
        <Flex
          direction="column"
          justify="space-between"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents: 'none',
          }}
        >
          {yAxisLabels.map((lbl, idx) => (
            <Group key={idx} justify="space-between" align="center" gap="xs" style={{ width: '100%' }}>
              <Text
                size="xs"
                c="dimmed"
                style={{
                  fontSize: rem(11),
                  width: rem(26),
                  textAlign: 'left',
                  flexShrink: 0,
                }}
              >
                {lbl}
              </Text>
              <Box
                style={{
                  flex: 1,
                  height: 1,
                  borderBottom: '1px dashed var(--app-border)',
                  opacity: 0.6,
                }}
              />
            </Group>
          ))}
        </Flex>

        {/* Vertical Bars Columns */}
        <Flex
          justify="space-around"
          align="flex-end"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: rem(36),
            right: rem(10),
          }}
        >
          {data.map((item, idx) => {
            const heightPercent = Math.min(100, Math.max(8, (item.value / maxValue) * 100));
            const isHighlight = item.highlight;

            return (
              <Stack
                key={idx}
                align="center"
                justify="flex-end"
                gap={0}
                style={{
                  height: '100%',
                  flex: 1,
                  maxWidth: rem(64),
                  position: 'relative',
                }}
              >
                {/* Floating Tooltip Badge for highlighted bar (like Image 2) */}
                {isHighlight && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: `calc(${100 - heightPercent}% - ${rem(36)})`,
                      padding: `${rem(3)} ${rem(10)}`,
                      backgroundColor: '#181b24',
                      color: '#ffffff',
                      borderRadius: rem(8),
                      fontSize: rem(11),
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                      zIndex: 3,
                      animation: 'fadeInUp 200ms ease',
                    }}
                  >
                    {item.tooltipBadge || `${item.value}h`}
                  </Box>
                )}

                {/* The Bar */}
                <Box
                  style={{
                    width: '65%',
                    maxWidth: rem(48),
                    height: `${heightPercent}%`,
                    borderRadius: rem(12),
                    backgroundColor: isHighlight ? highlightColor : defaultBarColor,
                    backgroundImage: isHighlight
                      ? undefined
                      : 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(120,120,120,0.06) 5px, rgba(120,120,120,0.06) 10px)',
                    boxShadow: isHighlight ? '0 8px 22px rgba(73, 29, 43, 0.28)' : 'none',
                    transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    border: isHighlight ? 'none' : '1px solid var(--app-border)',
                  }}
                />
              </Stack>
            );
          })}
        </Flex>
      </Box>

      {/* X-Axis Labels */}
      <Flex
        justify="space-around"
        align="center"
        mt={rem(10)}
        style={{
          marginLeft: rem(36),
          marginRight: rem(10),
        }}
      >
        {data.map((item, idx) => (
          <Text
            key={idx}
            size="xs"
            fw={item.highlight ? 700 : 500}
            style={{
              fontSize: rem(11.5),
              color: item.highlight ? 'var(--app-text-primary)' : 'var(--app-text-secondary)',
              textAlign: 'center',
              flex: 1,
              maxWidth: rem(64),
            }}
          >
            {item.label}
          </Text>
        ))}
      </Flex>
    </Box>
  );
}
