'use client';

import { Box, Table, Text, rem } from '@mantine/core';
import type { ReportColumn, ReportRow } from '@/src/core/api';
import { useReportMirror } from '../../store/useReportMirror';
import { REPORT_PAPER, withAlpha } from '../../init/report.init';
import { columnPercents, isLtrKind } from '../../init/report.format';
import { ReportBlockTitle } from './ReportBlockTitle';
import { ReportCellValue } from './ReportCellValue';

interface ReportTableBlockProps {
  title?: string;
  columns: ReportColumn[];
  rows: ReportRow[];
  totals?: ReportRow[];
  emptyText?: string;
  ruled?: boolean;
}

/**
 * Data table: header repeated on every printed page, zebra rows, totals
 * per currency in brand tint. `ruled` tables leave tall empty rows to be
 * filled by hand (rosters, mark sheets).
 */
export function ReportTableBlock({ title, columns, rows, totals, emptyText, ruled }: ReportTableBlockProps) {
  const brand = useReportMirror('brand');
  const widths = columnPercents(columns.map((c) => c.width));
  const cellPad = ruled ? `${rem(9)} ${rem(8)}` : `${rem(5)} ${rem(8)}`;
  const align = (kind: ReportColumn['kind']) => (isLtrKind(kind) ? 'center' : 'right');

  return (
    <Box>
      <ReportBlockTitle title={title} />
      <Table
        withTableBorder
        withColumnBorders={ruled}
        verticalSpacing={0}
        horizontalSpacing={0}
        style={{ borderColor: REPORT_PAPER.border, fontSize: rem(11.5), tableLayout: 'fixed', width: '100%' }}
      >
        <Table.Thead>
          <Table.Tr style={{ background: REPORT_PAPER.headerFill }}>
            {columns.map((col, i) => (
              <Table.Th
                key={col.key}
                style={{
                  width: `${widths[i]}%`,
                  padding: `${rem(6)} ${rem(8)}`,
                  textAlign: align(col.kind),
                  color: REPORT_PAPER.text,
                  fontSize: rem(11),
                  fontWeight: 600,
                  borderBottom: `2px solid ${brand}`,
                }}
              >
                {col.title}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={columns.length} style={{ padding: rem(14), textAlign: 'center' }}>
                <Text fz={rem(11.5)} style={{ color: REPORT_PAPER.muted }}>
                  {emptyText ?? 'لا توجد بيانات'}
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
          {rows.map((row, r) => (
            <Table.Tr key={r} style={{ background: !ruled && r % 2 === 1 ? REPORT_PAPER.stripe : undefined }}>
              {columns.map((col) => (
                <Table.Td
                  key={col.key}
                  style={{ padding: cellPad, textAlign: align(col.kind), borderColor: REPORT_PAPER.border, verticalAlign: 'middle' }}
                >
                  <ReportCellValue cell={row[col.key] ?? null} kind={col.kind} />
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
          {totals?.map((row, r) => (
            <Table.Tr key={`t${r}`} style={{ background: withAlpha(brand, 0.08) }}>
              {columns.map((col) => (
                <Table.Td
                  key={col.key}
                  style={{ padding: `${rem(6)} ${rem(8)}`, textAlign: align(col.kind), borderTop: `1px solid ${withAlpha(brand, 0.35)}` }}
                >
                  {row[col.key] === undefined ? null : <ReportCellValue cell={row[col.key]} kind={col.kind} strong />}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
