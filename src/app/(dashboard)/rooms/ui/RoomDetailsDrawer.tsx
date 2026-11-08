'use client';

import { Box } from '@mantine/core';
import { IconBuildingCommunity, IconCalendarTime } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers/drawer';
import { AppTabs } from '@/src/components/controllers/tabs';
import { useRoomsMirror } from '../store/useRoomsMirror';
import { RoomOverviewTab } from './RoomOverviewTab';
import { RoomAvailabilityTab, RoomAvailabilityTabProps } from './RoomAvailabilityTab';

/** Room details drawer: overview and availability tabs. */
export function RoomDetailsDrawer(props: RoomAvailabilityTabProps) {
  const detailsDrawerOpened = useRoomsMirror('detailsDrawerOpened');
  const selectedRoomDetails = useRoomsMirror('selectedRoomDetails');
  const stagedAvailabilities = useRoomsMirror('stagedAvailabilities');
  const closeDetailsDrawer = useRoomsMirror('closeDetailsDrawer');

  if (!selectedRoomDetails) return null;

  return (
    <AppDrawer
      opened={detailsDrawerOpened}
      onClose={closeDetailsDrawer}
      size="lg"
      icon={<IconBuildingCommunity size={20} />}
      title={`تفاصيل القاعة: ${selectedRoomDetails.name}`}
    >
      <AppTabs
        defaultValue="overview"
        items={[
          { value: 'overview', label: 'نظرة عامة', icon: <IconBuildingCommunity size={16} stroke={1.6} /> },
          {
            value: 'availability',
            label: 'أوقات إتاحة القاعة',
            icon: <IconCalendarTime size={16} stroke={1.6} />,
            count: stagedAvailabilities.length,
          },
        ]}
      >
        <Box mb="md">
          <AppTabs.List />
        </Box>

        <AppTabs.Panel value="overview">
          <RoomOverviewTab />
        </AppTabs.Panel>
        <AppTabs.Panel value="availability">
          <RoomAvailabilityTab {...props} />
        </AppTabs.Panel>
      </AppTabs>
    </AppDrawer>
  );
}
