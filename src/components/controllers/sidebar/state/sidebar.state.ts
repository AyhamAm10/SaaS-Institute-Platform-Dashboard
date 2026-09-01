import { NavItem } from '../init/navigation';

export interface SidebarState {
  /** Navigation tree items */
  items: NavItem[];
  /** Mobile drawer open/closed state */
  isMobileOpen: boolean;
  /** Desktop sidebar collapsed (icon-only) vs expanded */
  isDesktopCollapsed: boolean;
  /** Currently active route path */
  activeRoute: string;
  /** Keys of currently expanded accordion sections */
  openedSections: string[];

  // Actions
  toggleMobile: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  toggleDesktopCollapse: () => void;
  setDesktopCollapse: (collapsed: boolean) => void;
  toggleSection: (sectionKey: string) => void;
  setActiveRoute: (route: string) => void;
}

export interface SidebarInitialProps {
  items?: NavItem[];
  defaultCollapsed?: boolean;
  initialRoute?: string;
}
