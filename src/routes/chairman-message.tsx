import { createFileRoute } from "@tanstack/react-router";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import { Mail, Phone, Linkedin } from "lucide-react";
import liveSeed from "@/cms/live-seed.json";
import { loadPage } from "@/cms/load-public";
import { seoMeta, str } from "@/cms/seo";
import { CmsHtml } from "@/components/CmsHtml";

const FALLBACK = liveSeed.pages.find((page) => page.id === "chairman-message")!;

export const Route = createFileRoute("/chairman-message")({
  loader: async () => {
    const page = await loadPage("chairman-message");
    return { page: { ...FALLBACK, ...(page?.data ?? {}) } };
  },
  component: ChairmanMessagePage,
  head: ({ loaderData }) => ({
    meta: seoMeta(
      str(loaderData?.page.seoTitle, FALLBACK.seoTitle),
      str(loaderData?.page.seoDescription, FALLBACK.seoDescription),
    ),
  }),
});

function ChairmanMessagePage() {
  const { page } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHero
        title={str(page.title, FALLBACK.title)}
        subtitle={str(page.subtitle, FALLBACK.subtitle)}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Chairman's Message" },
        ]}
      />

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="relative mb-12 min-h-[420px] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-dark via-brand-blue-dk to-brand-dark shadow-xl">
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_25%,var(--brand-green)_0%,transparent_50%)] opacity-25"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none font-heading text-[7rem] font-extrabold leading-none text-white/10 md:text-[9rem]"
              aria-hidden
            >
              {str(page.personName)
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/55 to-brand-dark/10" />

            <div className="absolute right-5 top-5">
              <span className="rounded-full border border-hero-border bg-hero-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-hero-fg-current">
                Chairman
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 pt-20">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-hero-fg-subtle">
                Imperial Securities Company Ltd.
              </p>
              <h2 className="font-heading text-3xl font-extrabold leading-tight text-hero-fg md:text-4xl">
                {str(page.personName)}
              </h2>
              <p className="mt-1.5 text-sm font-medium text-hero-fg-muted">{str(page.personRole)}</p>
              <div className="mt-5 flex items-center gap-3">
                {str(page.email) ? (
                  <a
                    href={`mailto:${str(page.email)}`}
                    title="Email"
                    aria-label={`Email ${str(page.personName)}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-hero-border bg-hero-surface text-hero-fg transition-colors hover:bg-white hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-accent/50"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                ) : null}
                {str(page.phone) ? (
                  <a
                    href={`tel:${str(page.phone).replace(/\s/g, "")}`}
                    title="Phone"
                    aria-label="Call Imperial Securities"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-hero-border bg-hero-surface text-hero-fg transition-colors hover:bg-white hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-accent/50"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                ) : null}
                {str(page.linkedin) ? (
                  <a
                    href={str(page.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    aria-label={`${str(page.personName)} on LinkedIn`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-hero-border bg-hero-surface text-hero-fg transition-colors hover:bg-brand-blue hover:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-accent/50"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -top-6 left-1 select-none font-heading text-7xl font-extrabold leading-none text-brand-blue/15"
              aria-hidden="true"
            >
              "
            </div>
            <div className="rounded-2xl border border-border bg-white p-8 shadow-sm md:p-12">
              <div className="space-y-5 text-[15.5px] leading-[1.85] text-foreground/80">
                <CmsHtml value={page.body} className="prose prose-sm max-w-none text-foreground/80 md:prose-base" />
                <div className="border-t border-border pt-6">
                  <p className="font-heading text-sm font-semibold text-foreground">Warm Regards,</p>
                  <p className="mt-1 font-heading text-lg font-extrabold text-brand-blue">{str(page.personName)}</p>
                  <p className="text-xs text-muted-foreground">{str(page.personRole)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
