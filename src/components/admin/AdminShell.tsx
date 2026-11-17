import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { NAV_GROUPS } from "@/cms/collections";
import { LogoutButton } from "./LogoutButton";

export function AdminShell({
  title,
  subtitle,
  user,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  user: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.005_260)] text-foreground">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-border bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-4 lg:block">
            <a href="/admin" className="block">
              <p className="text-sm font-semibold tracking-tight text-foreground">Imperial Admin</p>
              <p className="text-xs text-brand-gray">Edit the public website</p>
            </a>
            <a
              href="/"
              className="text-xs font-medium text-brand-blue hover:underline lg:mt-3 lg:inline-block"
            >
              View site
            </a>
          </div>
          <nav className="flex gap-4 overflow-x-auto px-4 pb-3 lg:block lg:space-y-6 lg:overflow-visible lg:px-3 lg:pb-6" aria-label="Admin">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1 hidden px-2 text-[11px] font-semibold uppercase tracking-wider text-brand-gray lg:block">
                  {group.label}
                </p>
                <ul className="flex gap-1 lg:block lg:space-y-0.5">
                  {group.items.map((item) => {
                    const active =
                      item.to === "/admin"
                        ? pathname === "/admin" || pathname === "/admin/"
                        : pathname === item.to || pathname.startsWith(`${item.to}/`);
                    return (
                      <li key={item.to}>
                        <a
                          href={item.to}
                          aria-current={active ? "page" : undefined}
                          className={`block whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium ${
                            active
                              ? "bg-[oklch(0.95_0.03_255)] text-brand-blue"
                              : "text-foreground hover:bg-[oklch(0.95_0.03_255)] hover:text-brand-blue"
                          }`}
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
              {subtitle ? <p className="text-sm text-brand-gray">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <span className="hidden text-xs text-brand-gray sm:inline">{user}</span>
              <LogoutButton />
            </div>
          </header>
          <main id="admin-main" className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
