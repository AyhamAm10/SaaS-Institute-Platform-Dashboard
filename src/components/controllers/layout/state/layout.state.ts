export interface LayoutState {
  /** Height of dashboard header */
  headerHeight: number;
  /** Global search input value */
  searchQuery: string;
  /** Global search modal/input open state */
  isSearchOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

export interface LayoutInitialProps {
  headerHeight?: number;
}
