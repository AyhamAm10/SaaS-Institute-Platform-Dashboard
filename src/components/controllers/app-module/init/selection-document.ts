import type {
  ReportBlock,
  ReportCell,
  ReportColumn,
  ReportDocument,
  ReportMoneyCell,
  ReportRow,
} from '@/src/core/api';
import { fromMinor, toMinor, type MoneyCurrency } from '@/src/core/format/money';
import type { SelectionExportColumn } from './app-module.init';

function isReportMoneyCell(cell: ReportCell): cell is ReportMoneyCell {
  return (
    typeof cell === 'object' &&
    cell !== null &&
    'amount' in cell &&
    'currency' in cell &&
    typeof (cell as ReportMoneyCell).amount === 'number' &&
    ((cell as ReportMoneyCell).currency === 'SYP' || (cell as ReportMoneyCell).currency === 'USD')
  );
}

export function buildSelectionDocument(
  title: string,
  rows: unknown[],
  columns: SelectionExportColumn[],
  generatedAt: string,
): ReportDocument {
  const tableColumns: ReportColumn[] = columns.map((col) => ({
    key: col.key,
    title: col.title,
    kind: col.kind,
  }));

  const tableRows: ReportRow[] = rows.map((row) => {
    const rowObj: ReportRow = {};
    for (const col of columns) {
      rowObj[col.key] = col.value(row);
    }
    return rowObj;
  });

  const moneyColumns = columns.filter((col) => col.kind === 'money');
  let totalsRows: ReportRow[] | undefined = undefined;

  if (moneyColumns.length > 0 && tableRows.length > 0) {
    // Find all distinct currencies present in any money cell
    const presentCurrencies = new Set<MoneyCurrency>();
    for (const r of tableRows) {
      for (const mc of moneyColumns) {
        const val = r[mc.key];
        if (isReportMoneyCell(val)) {
          presentCurrencies.add(val.currency);
        }
      }
    }

    if (presentCurrencies.size > 0) {
      const currencies = Array.from(presentCurrencies);
      const isMultiCurrency = currencies.length > 1;
      totalsRows = [];

      for (const cur of currencies) {
        const totalRow: ReportRow = {};
        const firstCol = columns[0];
        if (firstCol) {
          totalRow[firstCol.key] = isMultiCurrency ? `المجموع (${cur})` : 'المجموع';
        }

        for (const mc of moneyColumns) {
          let sumMinor = 0;
          let hasValues = false;
          for (const r of tableRows) {
            const val = r[mc.key];
            if (isReportMoneyCell(val) && val.currency === cur) {
              sumMinor += toMinor(val.amount, cur);
              hasValues = true;
            }
          }
          if (hasValues) {
            totalRow[mc.key] = {
              amount: fromMinor(sumMinor, cur),
              currency: cur,
            };
          }
        }

        totalsRows.push(totalRow);
      }
    }
  }

  const tableBlock: ReportBlock = {
    type: 'table',
    columns: tableColumns,
    rows: tableRows,
    totals: totalsRows,
  };

  return {
    key: 'selection',
    title: title || 'السجلات المحددة',
    orientation: columns.length > 6 ? 'landscape' : 'portrait',
    meta: [{ label: 'عدد السجلات', value: String(rows.length) }],
    blocks: [tableBlock],
    generatedAt,
    generatedBy: null,
  };
}
