import { ControllerState } from '@/src/core/mirror';
import {
  AppTabItem,
  AppTabsInitialProps,
  ResolvedTabsConfig,
  resolveInitialTab,
  resolveTabsConfig,
} from '../init/tabs.init';

export interface TabsState extends ControllerState {
  active: string;
  items: AppTabItem[];
  config: ResolvedTabsConfig;
  rawProps: AppTabsInitialProps;

  setActive: (value: string) => void;
  updateProps: (props: AppTabsInitialProps) => void;
}

export function createInitialTabsState(props: AppTabsInitialProps): TabsState {
  return {
    active: resolveInitialTab(props),
    items: props.items,
    config: resolveTabsConfig(props),
    rawProps: props,
    setActive: () => {},
    updateProps: () => {},
  };
}
