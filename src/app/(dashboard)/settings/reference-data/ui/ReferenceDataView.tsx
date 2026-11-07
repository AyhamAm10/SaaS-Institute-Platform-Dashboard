'use client';

import { Box, Stack } from '@mantine/core';
import { AppTabs } from '@/src/components/controllers/tabs';
import { AppPageHeader } from '@/src/components/controllers/page-header';
import { LookupController } from '../lookup/LookupController';
import { LOOKUP_CONFIGS, referenceDataLabels } from '../static-data/reference-data.data';

const TAB_ITEMS = LOOKUP_CONFIGS.map((config) => ({
  value: config.key,
  label: config.title,
  icon: <config.icon size={16} stroke={1.6} />,
}));

export interface ReferenceDataViewProps {
  canManage?: boolean;
}

/**
 * ReferenceDataView
 *
 * One tab per reference table; every panel hosts its own LookupController.
 * ZERO useState hooks.
 */
export function ReferenceDataView({ canManage = true }: ReferenceDataViewProps) {
  return (
    <Stack gap="lg">
      <AppPageHeader title={referenceDataLabels.title} description={referenceDataLabels.description} />
      <AppTabs defaultValue={LOOKUP_CONFIGS[0].key} items={TAB_ITEMS}>
        <Box>
          <AppTabs.List />
        </Box>
        {LOOKUP_CONFIGS.map((config) => (
          <AppTabs.Panel key={config.key} value={config.key}>
            <LookupController config={config} canManage={canManage} />
          </AppTabs.Panel>
        ))}
      </AppTabs>
    </Stack>
  );
}
