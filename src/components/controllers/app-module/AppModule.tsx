'use client';

import { useState } from 'react';
import { Box, Stack } from '@mantine/core';
import { AppModuleInitialProps } from './init/app-module.init';
import { createAppModuleStore, AppModuleContext } from './store/app-module.store';
import { AppModuleHeader } from './ui/AppModuleHeader';
import { AppModuleStats } from './ui/AppModuleStats';
import { AppModuleCharts } from './ui/AppModuleCharts';
import { AppModuleTable } from './ui/AppModuleTable';
import { AppModuleContent } from './ui/AppModuleContent';

export function AppModule(props: AppModuleInitialProps) {
  const [store] = useState(() => createAppModuleStore(props));

  return (
    <AppModuleContext.Provider value={store}>
      <Box style={{ width: '100%', position: 'relative' }}>
        <Stack gap={0}>
          {props.children}
        </Stack>
      </Box>
    </AppModuleContext.Provider>
  );
}

// Compound Pattern Attachments
AppModule.Header = AppModuleHeader;
AppModule.Stats = AppModuleStats;
AppModule.Charts = AppModuleCharts;
AppModule.Table = AppModuleTable;
AppModule.Content = AppModuleContent;
