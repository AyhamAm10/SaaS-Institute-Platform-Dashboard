'use client';

import { useMemo } from 'react';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconBuildingCommunity, IconPlus, IconRefresh } from '@tabler/icons-react';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { Institute } from '@/src/core/api';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';
import { getInstitutesColumns } from './InstitutesTable';
import { CreateInstituteDrawer } from './CreateInstituteDrawer';
import { InstituteDetailsDrawer } from './InstituteDetailsDrawer';

export interface InstitutesViewProps {
  onRefresh?: () => void;
  onCreateSubmit: () => Promise<void>;
}

/**
 * InstitutesView
 *
 * Presentation container layout for the Institutes management page.
 * Strictly adheres to DataModuleController compound pattern.
 * ZERO useState hooks. Layout is 100% controlled by DataModuleController.
 */
export function InstitutesView({ onRefresh, onCreateSubmit }: InstitutesViewProps) {
  const data = useInstitutesMirror('data');
  const isLoading = useInstitutesMirror('isLoading');
  const isFetching = useInstitutesMirror('isFetching');
  const page = useInstitutesMirror('page');
  const totalPages = useInstitutesMirror('totalPages');
  const total = useInstitutesMirror('total');
  const limit = useInstitutesMirror('limit');
  const setPage = useInstitutesMirror('setPage');
  const setSearch = useInstitutesMirror('setSearch');
  const openCreateDrawer = useInstitutesMirror('openCreateDrawer');
  const openDetailsDrawer = useInstitutesMirror('openDetailsDrawer');

  const columns = useMemo(
    () => getInstitutesColumns(openDetailsDrawer),
    [openDetailsDrawer],
  );

  return (
    <>
      <DataModuleController
        title={institutesLabels.title}
        description={institutesLabels.subtitle}
        data={data}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={institutesLabels.emptyState}
        emptyDescription="يمكنك إضافة أول معهد في النظام بالضغط على زر إضافة معهد جديد."
        searchPlaceholder={institutesLabels.searchPlaceholder}
        keyExtractor={(item: Institute) => item.id}
        onPageChange={setPage}
        onSearchChange={setSearch}
      >
        <DataModuleController.Header>
          <DataModuleController.Title
            icon={<IconBuildingCommunity size={18} />}
            badgeLabel={institutesLabels.totalCountBadge}
          />
          <DataModuleController.Actions>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateDrawer}
              color="primary"
              radius="md"
            >
              {institutesLabels.createNewButton}
            </Button>
          </DataModuleController.Actions>
        </DataModuleController.Header>

        <DataModuleController.FilterBar>
          <DataModuleController.SearchInput placeholder={institutesLabels.searchPlaceholder} />
          {onRefresh && (
            <DataModuleController.FilterSlot>
              <Tooltip label={institutesLabels.refreshButton} withArrow position="top">
                <ActionIcon
                  variant="light"
                  color="primary"
                  size="md"
                  radius="md"
                  onClick={onRefresh}
                  loading={isFetching}
                  aria-label={institutesLabels.refreshButton}
                >
                  <IconRefresh size={16} />
                </ActionIcon>
              </Tooltip>
            </DataModuleController.FilterSlot>
          )}
        </DataModuleController.FilterBar>

        <DataModuleController.Content>
          <DataModuleController.Table />
        </DataModuleController.Content>

        <DataModuleController.Footer />
      </DataModuleController>

      <CreateInstituteDrawer onSubmit={onCreateSubmit} />
      <InstituteDetailsDrawer />
    </>
  );
}
