'use client';

import { useMemo } from 'react';
import { IconBuildingCommunity, IconPlus, IconRefresh } from '@tabler/icons-react';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppButton, AppIconButton } from '@/src/components/controllers/button';
import { FeatureKey, Institute } from '@/src/core/api';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';
import { getInstitutesColumns } from './InstitutesTable';
import { InstituteFormDrawer } from './InstituteFormDrawer';
import { InstituteDetailsDrawer } from './InstituteDetailsDrawer';
import { InstituteFeaturesSection } from './InstituteFeaturesSection';

export interface InstitutesViewProps {
  onRefresh?: () => void;
  onFormSubmit: () => Promise<void>;
  onToggleFeature: (key: FeatureKey, enabled: boolean) => Promise<void>;
}

/**
 * InstitutesView
 *
 * Presentation container layout for the Institutes management page.
 * Strictly adheres to DataModuleController compound pattern.
 * ZERO useState hooks. Layout is 100% controlled by DataModuleController.
 */
export function InstitutesView({ onRefresh, onFormSubmit, onToggleFeature }: InstitutesViewProps) {
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
  const openEditDrawer = useInstitutesMirror('openEditDrawer');

  const columns = useMemo(
    () => getInstitutesColumns(openDetailsDrawer, openEditDrawer),
    [openDetailsDrawer, openEditDrawer],
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
            <AppButton leftSection={<IconPlus size={16} />} onClick={openCreateDrawer}>
              {institutesLabels.createNewButton}
            </AppButton>
          </DataModuleController.Actions>
        </DataModuleController.Header>

        <DataModuleController.FilterBar>
          <DataModuleController.SearchInput placeholder={institutesLabels.searchPlaceholder} />
          {onRefresh && (
            <DataModuleController.FilterSlot>
              <AppIconButton
                variant="brand"
                label={institutesLabels.refreshButton}
                onClick={onRefresh}
                loading={isFetching}
              >
                <IconRefresh size={16} />
              </AppIconButton>
            </DataModuleController.FilterSlot>
          )}
        </DataModuleController.FilterBar>

        <DataModuleController.Content>
          <DataModuleController.Table />
        </DataModuleController.Content>

        <DataModuleController.Footer />
      </DataModuleController>

      <InstituteFormDrawer onSubmit={onFormSubmit} />
      <InstituteDetailsDrawer
        featuresSlot={<InstituteFeaturesSection onToggle={onToggleFeature} />}
      />
    </>
  );
}
