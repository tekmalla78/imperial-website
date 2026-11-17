import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown, Building2, HelpCircle, BookOpen, UserCircle, FileText, Layers, MapPin, Phone } from "lucide-react";
import logoUrl from "@/assets/logo.svg";
import logoWhiteUrl from "@/assets/logo-white.png";
import logoMobileUrl from "@/assets/mobile.webp";
import { useBranches, useNavigation } from "@/cms/site-chrome";
import { splitPairs, splitTriples } from "@/cms/collections";
import { parseCustomMenus } from "@/cms/custom-menus";
import { DEFAULT_NAVIGATION } from "@/cms/types";

type ToolMenuItem = { label: string; href?: string; toolKey?: string };
type DropdownGroup = { icon?: React.ReactNode; heading?: string; subtitle?: string; items: ToolMenuItem[] };

const openAccountIcons = [
  <FileText className="h-4 w-4 text-brand-blue" />,
  <Layers className="h-4 w-4 text-brand-green-dk" />,
  <UserCircle className="h-4 w-4 text-brand-green" />,
];

const resourceGroupIcons: Record<string, React.ReactNode> = {
  Company: <Building2 className="h-5 w-5 text-brand-blue" />,
  Help: <HelpCircle className="h-5 w-5 text-brand-blue" />,
  Education: <BookOpen className="h-5 w-5 text-brand-green-dk" />,
};

const resourceGroupSubtitles: Record<string, string> = {
  Company: "Learn about our organization",
  Help: "Get assistance and support",
  Education: "Stay informed and learn",
};

const toolsMenus: Record<string, DropdownGroup[]> = {
  Tools: [
    {
      items: [
        { label: "Share Calculator", href: "#tools", toolKey: "share" },
        { label: "WACC Calculator", href: "#tools", toolKey: "wacc" },
        { label: "Bonus Adj Calculator", href: "#tools", toolKey: "bonus" },
        { label: "Right Adj Calculator", href: "#tools", toolKey: "rights" },
        { label: "Dividend Calculator", href: "#tools", toolKey: "dividend" },
        { label: "IPO Allotment Check", href: "https://iporesult.cdsc.com.np/" },
      ],
    },
  ],
};

function buildResourcesMenu(resourcesLinks: string): DropdownGroup[] {
  const rows = splitTriples(resourcesLinks.length ? resourcesLinks : DEFAULT_NAVIGATION.resourcesLinks);
  const order: string[] = [];
  const byGroup = new Map<string, ToolMenuItem[]>();
  for (const row of rows) {
    const group = row.a || "Links";
    if (!byGroup.has(group)) {
      byGroup.set(group, []);
      order.push(group);
    }
    byGroup.get(group)!.push({ label: row.b, href: row.c });
  }
  return order.map((heading) => ({
    icon: resourceGroupIcons[heading],
    heading,
    subtitle: resourceGroupSubtitles[heading],
    items: byGroup.get(heading) ?? [],
  }));
}

function buildServicesMenu(servicesLinks: string): DropdownGroup[] {
  const items = splitPairs(servicesLinks.length ? servicesLinks : DEFAULT_NAVIGATION.servicesLinks).map(
    (row) => ({ label: row.title, href: row.desc }),
  );
  return [{ items }];
}

function buildTripleLinks(value: string, fallback: string) {
  return splitTriples(value.length ? value : fallback).map((row) => ({
    label: row.a,
    desc: row.b,
    href: row.c,
  }));
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function NavDropdownLink({
  href,
  label,
  className,
  onClick,
}: {
  href: string;
  label: string;
  className: string;
  onClick?: () => void;
}) {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {label}
      </a>
    );
  }

  return (
    <Link to={href} className={className} onClick={onClick}>
      {label}
    </Link>
  );
}

function BranchNavDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const branches = useBranches();
  return (
    <div className="w-[640px] max-w-[92vw] overflow-hidden rounded-xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,.12)]">
      <div className="grid grid-cols-2 gap-3 p-4">
        {branches.map((b) => (
          <Link
            key={b.slug}
            to="/branches/$slug"
            params={{ slug: b.slug }}
            onClick={onNavigate}
            className="group flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 px-3 py-2.5 transition-colors hover:border-brand-blue hover:bg-brand-blue-lt/40"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
              <MapPin className="h-4 w-4 text-brand-green" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <div className="text-[12.5px] font-bold leading-snug text-foreground group-hover:text-brand-blue">
                {b.name}
              </div>
              <div className="mt-0.5 text-[10.5px] leading-snug text-muted-foreground">{b.addr}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[10.5px] font-semibold text-brand-blue">
                <Phone className="h-3 w-3 shrink-0" strokeWidth={2} />
                {b.phone}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SiteHeader({
  compact = false,
  flushHero = false,
}: {
  compact?: boolean;
  flushHero?: boolean;
}) {
  const navigation = useNavigation();
  const branches = useBranches();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [showLoginDrop, setShowLoginDrop] = useState(false);
  const [showAccountDrop, setShowAccountDrop] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const loginTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accountTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loginOptions = useMemo(
    () => buildTripleLinks(navigation.loginLinks, DEFAULT_NAVIGATION.loginLinks),
    [navigation.loginLinks],
  );
  const openAccountOptions = useMemo(
    () =>
      buildTripleLinks(navigation.openAccountLinks, DEFAULT_NAVIGATION.openAccountLinks).map((opt, i) => ({
        ...opt,
        icon: openAccountIcons[i % openAccountIcons.length],
      })),
    [navigation.openAccountLinks],
  );
  const dropdownMenus: Record<string, DropdownGroup[]> = useMemo(() => {
    const menus: Record<string, DropdownGroup[]> = {
      Resources: buildResourcesMenu(navigation.resourcesLinks),
      Services: buildServicesMenu(navigation.servicesLinks),
      ...toolsMenus,
    };
    for (const item of parseCustomMenus(navigation.customMenus)) {
      if (!item.label || item.children.length === 0) continue;
      menus[item.label] = [
        {
          items: item.children
            .filter((child) => child.label && child.href)
            .map((child) => ({ label: child.label, href: child.href })),
        },
      ];
    }
    return menus;
  }, [navigation.resourcesLinks, navigation.servicesLinks, navigation.customMenus]);

  const navItems = useMemo(() => {
    const customItems = parseCustomMenus(navigation.customMenus)
      .filter((item) => item.label)
      .map((item) => {
        const hasDropdown = item.children.some((child) => child.label && child.href);
        return {
          label: item.label,
          href: hasDropdown ? "#" : item.href || "#",
          hasDropdown,
        };
      });

    return [
      { label: "Home", href: "/" },
      { label: "Resources", href: "#", hasDropdown: true },
      { label: "Services", href: "#services", hasDropdown: true },
      {
        label: navigation.downloadLabel || DEFAULT_NAVIGATION.downloadLabel,
        href: navigation.downloadHref || DEFAULT_NAVIGATION.downloadHref,
      },
      ...customItems,
      { label: "Tools", href: "#tools", hasDropdown: true },
      { label: "Branch", href: "#", hasDropdown: true },
    ];
  }, [navigation.downloadHref, navigation.downloadLabel, navigation.customMenus]);

  const toggleMobileExpand = (label: string) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
  };

  const handleToolsAction = (toolKey?: string, href?: string) => {
    if (typeof window === "undefined") return;

    if (toolKey) {
      if (window.location.pathname !== "/") {
        sessionStorage.setItem("imperial-open-tool", toolKey);
        window.location.assign(`/?tool=${toolKey}#tools`);
      } else {
        window.__imperialOpenTool?.(toolKey);
        document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setOpenDropdown(null);
      setMobileOpen(false);
      return;
    }

    if (href) {
      window.location.assign(href);
      setMobileOpen(false);
      setOpenDropdown(null);
    }
  };

  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const handleLoginEnter = () => {
    if (loginTimeout.current) clearTimeout(loginTimeout.current);
    setShowLoginDrop(true);
  };
  const handleLoginLeave = () => {
    loginTimeout.current = setTimeout(() => setShowLoginDrop(false), 150);
  };

  const handleAccountEnter = () => {
    if (accountTimeout.current) clearTimeout(accountTimeout.current);
    setShowAccountDrop(true);
  };
  const handleAccountLeave = () => {
    accountTimeout.current = setTimeout(() => setShowAccountDrop(false), 150);
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (loginTimeout.current) clearTimeout(loginTimeout.current);
    if (accountTimeout.current) clearTimeout(accountTimeout.current);
  }, []);

  // Close mobile account dropdown on outside click
  useEffect(() => {
    if (!mobileAccountOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-account-dropdown]")) setMobileAccountOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileAccountOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-[1000] bg-white/95 backdrop-blur-sm ${
          flushHero
            ? "border-b border-brand-blue/15 shadow-none"
            : "border-b border-border shadow-[0_2px_20px_rgba(21,87,192,.08)]"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-2 md:gap-4 md:px-6 md:py-3 ${
            compact ? "h-[60px] md:h-[68px] lg:h-[76px]" : "h-[72px] md:h-[88px] lg:h-[104px]"
          }`}
        >
          <Link to="/" className="flex shrink-0 items-center py-1" aria-label="Imperial Securities — Home">
            <img
              src={logoUrl}
              alt="Imperial Securities"
              className={`h-11 w-auto sm:h-14 ${compact ? "md:h-16 lg:h-[72px]" : "md:h-20 lg:h-[88px]"}`}
              width={283}
              height={110}
              decoding="async"
              loading="eager"
            />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && handleEnter(item.label)}
                onMouseLeave={handleLeave}
              >
                <a
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13.5px] font-medium text-foreground transition-all hover:bg-brand-blue-lt hover:text-brand-blue"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="h-3.5 w-3.5 opacity-50" />}
                </a>

                {/* Dropdown */}
                {item.hasDropdown && openDropdown === item.label && (
                  <div className={`absolute top-full z-50 pt-2 ${item.label === "Branch" ? "right-0" : "left-1/2 -translate-x-1/2"}`}>
                    {item.label === "Branch" ? (
                      <BranchNavDropdown />
                    ) : dropdownMenus[item.label] ? (
                      (() => {
                        const groups = dropdownMenus[item.label];

                        if (groups.some((g) => g.heading)) {
                          return (
                            <div className="w-[520px] overflow-hidden rounded-xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,.12)]">
                              <div className="grid grid-cols-3 gap-3 border-b border-border px-5 py-4">
                                {groups.map((group) =>
                                  group.heading ? (
                                    <div key={group.heading} className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                        {group.icon}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-[12.5px] font-bold text-foreground">{group.heading}</div>
                                        <div className="text-[10.5px] leading-tight text-muted-foreground">{group.subtitle}</div>
                                      </div>
                                    </div>
                                  ) : null
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-0 px-3 py-3">
                                {groups.map((group, gi) => (
                                  <div key={gi} className="flex flex-col">
                                    {group.items.map((link) =>
                                      link.toolKey ? (
                                        <button
                                          key={link.label}
                                          type="button"
                                          onClick={() => handleToolsAction(link.toolKey, link.href)}
                                          className="rounded-lg px-3 py-1.5 text-left text-[13px] font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                          {link.label}
                                        </button>
                                      ) : link.href ? (
                                        <NavDropdownLink
                                          key={link.label}
                                          href={link.href}
                                          label={link.label}
                                          className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                                        />
                                      ) : null
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div className="min-w-[200px] overflow-hidden rounded-xl border border-border bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,.12)]">
                            {groups.map((group, gi) => (
                              <div key={gi} className="flex flex-col">
                                {group.items.map((link) =>
                                  link.toolKey ? (
                                    <button
                                      key={link.label}
                                      type="button"
                                      onClick={() => handleToolsAction(link.toolKey, link.href)}
                                      className="rounded-lg px-3 py-2 text-left text-[13px] font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                      {link.label}
                                    </button>
                                  ) : link.href ? (
                                    <NavDropdownLink
                                      key={link.label}
                                      href={link.href}
                                      label={link.label}
                                      className="rounded-lg px-3 py-2 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                                    />
                                  ) : null
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">

            {/* ── Login dropdown ── */}
            <div
              className="relative hidden md:block"
              onMouseEnter={handleLoginEnter}
              onMouseLeave={handleLoginLeave}
            >
              <button className="flex items-center gap-1 rounded-lg border-[1.5px] border-brand-blue bg-transparent px-[18px] py-2 text-[13.5px] font-semibold text-brand-blue transition-all hover:bg-brand-blue-lt">
                Login
                <ChevronDown className="h-3.5 w-3.5 opacity-60" style={{ transform: showLoginDrop ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </button>
              {showLoginDrop && (
                <div className="absolute right-0 top-full z-50 pt-2">
                  <div className="min-w-[210px] overflow-hidden rounded-xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,.12)]">
                    {loginOptions.map((opt) => (
                      <a
                        key={opt.label}
                        href={opt.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col px-4 py-3 transition-colors hover:bg-muted"
                      >
                        <span className="text-[13px] font-semibold text-foreground">{opt.label}</span>
                        <span className="text-[11.5px] text-muted-foreground">{opt.desc}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Open Account dropdown ── */}
            <div
              data-account-dropdown
              className="relative"
              onMouseEnter={() => { if (window.innerWidth >= 1024) handleAccountEnter(); }}
              onMouseLeave={() => { if (window.innerWidth >= 1024) handleAccountLeave(); }}
            >
              <button
                className="flex items-center gap-1 rounded-lg bg-gradient-to-br from-brand-green to-brand-green-dk px-3 py-2 text-[11.5px] font-semibold text-white shadow-[0_4px_14px_rgba(55,210,0,.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(55,210,0,.45)] sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-[13px] lg:px-5 lg:text-[13.5px]"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setMobileAccountOpen((prev) => !prev);
                  }
                }}
              >
                <span className="hidden xs:inline">✦ </span><span>Open Account</span>
                <ChevronDown
                  className="h-3 w-3 opacity-75 transition-transform duration-200 sm:h-3.5 sm:w-3.5"
                  style={{ transform: (showAccountDrop || mobileAccountOpen) ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {/* Desktop hover dropdown */}
              {showAccountDrop && (
                <div className="absolute right-0 top-full z-50 hidden pt-2 lg:block">
                  <div className="min-w-[240px] overflow-hidden rounded-xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,.12)]">
                    {openAccountOptions.map((opt) => (
                      <a
                        key={opt.label}
                        href={opt.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted"
                      >
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-50 shadow-sm">
                          {opt.icon}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-foreground">{opt.label}</div>
                          <div className="text-[11.5px] text-muted-foreground">{opt.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile tap dropdown — expands below button in header */}
              {mobileAccountOpen && (
                <div className="absolute right-0 top-full z-50 pt-2 lg:hidden">
                  <div className="w-[260px] overflow-hidden rounded-xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,.15)]">
                    <div className="border-b border-border bg-gradient-to-r from-brand-green/10 to-brand-green-lt px-4 py-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-green-dk">Choose Account Type</p>
                    </div>
                    {openAccountOptions.map((opt) => (
                      <a
                        key={opt.label}
                        href={opt.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted active:bg-muted/70"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm ${
                            opt.icon.props.className?.includes("text-brand-blue")
                              ? "bg-brand-blue-lt"
                              : "bg-brand-green-lt"
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <div className="text-[13.5px] font-semibold text-foreground">{opt.label}</div>
                          <div className="text-[11.5px] text-muted-foreground">{opt.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              className="flex items-center justify-center p-1.5 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[1100] flex flex-col overflow-y-auto bg-white px-5 pb-10 pt-5">

          {/* Top bar: logo + close */}
          <div className="mb-6 flex items-center justify-between">
            <img src={logoMobileUrl} alt="Imperial Securities" className="h-10 w-auto" />
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav items */}
          <div className="flex flex-col gap-1">
            {navItems.map((item) =>
              item.hasDropdown && (item.label === "Branch" || dropdownMenus[item.label]) ? (
                <div key={item.label}>
                  {/* Accordion trigger */}
                  <button
                    onClick={() => toggleMobileExpand(item.label)}
                    className="flex w-full items-center justify-between rounded-[10px] border border-gray-200 px-[18px] py-3.5 text-left text-base font-semibold text-gray-800 transition-all hover:bg-gray-50 hover:text-brand-blue"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className="h-4 w-4 text-gray-400 transition-transform duration-200"
                      style={{ transform: mobileExpanded === item.label ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>

                  {/* Accordion content */}
                  {mobileExpanded === item.label && (
                    item.label === "Branch" ? (
                      <div className="mb-1 ml-3 mt-1 rounded-xl bg-brand-gray-lt/90 p-2">
                        <div className="flex flex-col gap-2">
                          {branches.map((b) => (
                            <Link
                              key={b.slug}
                              to="/branches/$slug"
                              params={{ slug: b.slug }}
                              onClick={() => setMobileOpen(false)}
                              className="group flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 transition-colors hover:border-brand-blue hover:bg-brand-blue-lt/40"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gray-lt">
                                <MapPin className="h-4 w-4 text-brand-green" strokeWidth={2} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[13px] font-bold leading-snug text-gray-800 group-hover:text-brand-blue">
                                  {b.name}
                                </div>
                                <div className="mt-0.5 text-[11px] leading-snug text-gray-500">{b.addr}</div>
                                <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue">
                                  <Phone className="h-3 w-3 shrink-0" strokeWidth={2} />
                                  {b.phone}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                    <div className="mb-1 ml-3 mt-1 flex flex-col gap-0.5 rounded-xl bg-brand-gray-lt/90 p-2">
                      {dropdownMenus[item.label].map((group, gi) => (
                        <div key={gi}>
                          {group.heading && (
                            <div className="mb-1 mt-2 flex items-center gap-2 px-2">
                              {group.icon && (
                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100">
                                  {group.icon}
                                </span>
                              )}
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                {group.heading}
                              </span>
                            </div>
                          )}
                          {group.items.map((link) => (
                            link.toolKey ? (
                              <button
                                key={link.label}
                                type="button"
                                onClick={() => handleToolsAction(link.toolKey, link.href)}
                                className="block w-full rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium text-gray-600 transition-colors hover:bg-brand-blue-lt hover:text-brand-blue"
                              >
                                {link.label}
                              </button>
                            ) : link.href ? (
                              <NavDropdownLink
                                key={link.label}
                                href={link.href}
                                label={link.label}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-gray-600 transition-colors hover:bg-brand-blue-lt hover:text-brand-blue"
                              />
                            ) : null
                          ))}
                        </div>
                      ))}
                    </div>
                    )
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-[10px] border border-gray-200 px-[18px] py-3.5 text-base font-semibold text-gray-800 transition-all hover:bg-gray-50 hover:text-brand-blue"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* Login + Open Account buttons */}
          <div className="mt-5 flex flex-col gap-3">

            {/* Mobile Login accordion */}
            <div className="overflow-hidden rounded-[10px] border border-brand-blue">
              <button
                onClick={() => toggleMobileExpand("__login")}
                className="flex w-full items-center justify-between px-[18px] py-3.5 text-base font-semibold text-brand-blue"
              >
                <span>Login</span>
                <ChevronDown
                  className="h-4 w-4 opacity-60 transition-transform duration-200"
                  style={{ transform: mobileExpanded === "__login" ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {mobileExpanded === "__login" && (
                <div className="border-t border-brand-blue/20 bg-gray-50 px-2 py-1">
                  {loginOptions.map((opt) => (
                    <a
                      key={opt.label}
                      href={opt.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-col rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-blue-lt"
                    >
                      <span className="text-[13.5px] font-semibold text-gray-800">{opt.label}</span>
                      <span className="text-[11.5px] text-gray-500">{opt.desc}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Open Account accordion removed — button is now in the header bar */}

          </div>

        </div>
      )}
    </>
  );
}