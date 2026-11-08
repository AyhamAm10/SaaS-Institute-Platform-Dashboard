import { SettingsTabKey } from '../static-data/settings-tabs.data';

export interface SettingsState {
  activeTab: SettingsTabKey;
  permittedTabs: SettingsTabKey[];
  setActiveTab: (tab: SettingsTabKey) => void;
  setPermittedTabs: (tabs: SettingsTabKey[]) => void;
}

