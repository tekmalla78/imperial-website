import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHero({
  title,
  subtitle,
  eyebrow,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-blue-dk to-brand-dark py-14 md:py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl" />
        <div className="absolute -bottom-10 -left-20 h-56 w-56 rounded-full bg-brand-green/12 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-hero-accent/40 to-transparent" />
        <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-hero-fg/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-1.5 text-[13px] text-hero-fg-subtle md:mb-6"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight
                    className="h-3 w-3 shrink-0 text-hero-fg-subtle/80"
                    aria-hidden
                  />
                )}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="inline-flex min-h-11 items-center rounded-sm py-1 transition-colors hover:text-hero-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="inline-flex min-h-11 items-center py-1 font-medium text-hero-fg-current"
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        {eyebrow && (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-hero-border bg-hero-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-hero-fg-muted">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-hero-accent"
              aria-hidden
            />
            {eyebrow}
          </div>
        )}

        <h1 className="max-w-4xl text-balance font-heading text-3xl font-extrabold tracking-tight text-hero-fg md:text-4xl lg:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-hero-fg-muted md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
