'use client';

import { AppModule } from '@/src/components/controllers';
import { DataModuleController, type DataModuleColumn } from '@/src/components/controllers/data-module';

interface PortalTableProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: DataModuleColumn<T>[];
  isLoading: boolean;
  emptyMessage: string;
  keyOf: (row: T) => string | number;
}

const noop = () => undefined;

/** A read-only table without search or paging (a child's month, results or installments are a handful of rows). */
export function PortalTable<T>({ title, description, data, columns, isLoading, emptyMessage, keyOf }: PortalTableProps<T>) {
  return (
    <AppModule exportTitle={title}>
      <AppModule.Table>
        <DataModuleController
          title={title}
          description={description}
          data={data}
          columns={columns}
          total={data.length}
          page={1}
          limit={Math.max(data.length, 1)}
          totalPages={1}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          keyExtractor={keyOf}
          onPageChange={noop}
          onSearchChange={noop}
        >
          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>
        </DataModuleController>
      </AppModule.Table>
    </AppModule>
  );
}
