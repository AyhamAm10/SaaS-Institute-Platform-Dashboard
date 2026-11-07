'use client';

import { Box, Table, Text, rem } from '@mantine/core';
import { useReportMirror } from '../../store/useReportMirror';
import { REPORT_PAPER, withAlpha } from '../../init/report.init';
import { ReportBlockTitle } from './ReportBlockTitle';

interface ReportGridBlockProps {
  title?: string;
  corner: string;
  columns: string[];
  rows: { label: string; sub?: string; cells: (string | null)[] }[];
  ruled?: boolean;
}

/**
 * Matrix: weekly timetable (slots × days) or a sign-in sheet (students ×
 * days). Filled cells are brand-tinted; `ruled` grids stay empty to fill.
 */
export function ReportGridBlock({ title, corner, columns, rows, ruled }: ReportGridBlockProps) {
  const brand = useReportMirror('brand');
  const border = `1px solid ${REPORT_PAPER.border}`;

  return (
    <Box>
      <ReportBlockTitle title={title} />
      <Table withTableBorder withColumnBorders verticalSpacing={0} horizontalSpacing={0} style={{ tableLayout: 'fixed', width: '100%', borderColor: REPORT_PAPER.border }}>
        <Table.Thead>
          <Table.Tr style={{ background: REPORT_PAPER.headerFill }}>
            <Table.Th style={{ width: ruled ? '24%' : '11%', padding: rem(6), fontSize: rem(11), borderBottom: `2px solid ${brand}` }}>
              {corner}
            </Table.Th>
            {columns.map((c) => (
              <Table.Th
                key={c}
                style={{ padding: rem(5), textAlign: 'center', fontSize: rem(10.5), whiteSpace: 'pre-line', borderBottom: `2px solid ${brand}` }}
              >
                {c}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row) => (
            <Table.Tr key={row.label}>
              <Table.Td style={{ padding: `${rem(ruled ? 8 : 6)} ${rem(8)}`, background: REPORT_PAPER.stripe, border }}>
                <Text fz={rem(11)} fw={600} dir={row.sub ? 'ltr' : undefined} ta={row.sub ? 'center' : undefined}>
                  {row.label}
                </Text>
                {row.sub && (
                  <Text fz={rem(9.5)} dir="ltr" ta="center" style={{ color: REPORT_PAPER.muted }}>
                    {row.sub}
                  </Text>
                )}
              </Table.Td>
              {row.cells.map((cell, i) => (
                <Table.Td
                  key={i}
                  style={{
                    padding: rem(5),
                    border,
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    background: cell ? withAlpha(brand, 0.07) : undefined,
                  }}
                >
                  {cell && (
                    <Text fz={rem(10.5)} lh={1.35} style={{ whiteSpace: 'pre-line' }}>
                      {cell}
                    </Text>
                  )}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
