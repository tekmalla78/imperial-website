import { createContext, useContext } from "react";
import liveSeed from "@/cms/live-seed.json";
import { DEFAULT_NAVIGATION, DEFAULT_SETTINGS, type Navigation, type Settings } from "@/cms/types";

export type BranchNavItem = {
  slug: string;
  name: string;
  addr: string;
  phone: string;
};

export const FALLBACK_BRANCHES: BranchNavItem[] = liveSeed.branches.map((branch) => ({
  slug: branch.slug,
  name: branch.name,
  addr: branch.addr,
  phone: branch.phone,
}));

type SiteChrome = {
  settings: Settings;
  navigation: Navigation;
  branches: BranchNavItem[];
};

const SiteChromeContext = createContext<SiteChrome>({
  settings: DEFAULT_SETTINGS,
  navigation: DEFAULT_NAVIGATION,
  branches: FALLBACK_BRANCHES,
});

export const SiteChromeProvider = SiteChromeContext.Provider;

export function useSettings() {
  return useContext(SiteChromeContext).settings;
}

export function useNavigation() {
  const { navigation } = useContext(SiteChromeContext);
  return { ...DEFAULT_NAVIGATION, ...navigation };
}

export function useBranches() {
  const { branches } = useContext(SiteChromeContext);
  return branches.length > 0 ? branches : FALLBACK_BRANCHES;
}
