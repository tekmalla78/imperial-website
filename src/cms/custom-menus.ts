export type CustomNavChild = {
  label: string;
  href: string;
};

export type CustomNavItem = {
  label: string;
  /** Used when this item has no submenus. */
  href: string;
  children: CustomNavChild[];
};

export function parseCustomMenus(value: unknown): CustomNavItem[] {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw) as CustomNavItem[];
      if (!Array.isArray(parsed)) return [];
      return parsed.map((row) => ({
        label: String(row.label ?? "").trim(),
        href: String(row.href ?? "").trim(),
        children: Array.isArray(row.children)
          ? row.children.map((child) => ({
              label: String(child?.label ?? "").trim(),
              href: String(child?.href ?? "").trim(),
            }))
          : [],
      }));
    } catch {
      return [];
    }
  }
  return [];
}
