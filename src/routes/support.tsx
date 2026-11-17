import { createFileRoute, Link } from "@tanstack/react-router";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import {
  Headphones,
  FileText,
  BookOpen,
  ArrowRight,
  Mail,
  Clock,
  ShieldCheck,
} from "lucide-react";

import { REGISTRATION_URL } from "../data/faqs";
import liveSeed from "@/cms/live-seed.json";
import { loadPage } from "@/cms/load-public";
import { seoMeta, str } from "@/cms/seo";
import { useSettings } from "@/cms/site-chrome";
import { CmsHtml } from "@/components/CmsHtml";

const FALLBACK = liveSeed.pages.find((page) => page.id === "support")!;

export const Route = createFileRoute("/support")({
  loader: async () => {
    const page = await loadPage("support");
    return { page: { ...FALLBACK, ...(page?.data ?? {}) } };
  },
  component: SupportPage,
  head: ({ loaderData }) => ({
    meta: seoMeta(
      str(loaderData?.page.seoTitle, FALLBACK.seoTitle),
      str(loaderData?.page.seoDescription, FALLBACK.seoDescription),
    ),
  }),
});

const resources = [
  {
    icon: FileText,
    title: "Account Setup Guide",
    desc: "Step-by-step guide to open and activate your account",
    href: REGISTRATION_URL,
    external: true,
  },
  {
    icon: BookOpen,
    title: "Trading Tutorial",
    desc: "Learn how to place orders on our trading platform",
    href: "/faqs",
  },
  {
    icon: FileText,
    title: "IPO Application Guide",
    desc: "How to apply for IPOs through MeroShare",
    href: "/downloads",
  },
  {
    icon: BookOpen,
    title: "TMS User Manual",
    desc: "Complete guide for the Trade Management System",
    href: "/downloads",
  },
] as const;

function SupportPage() {
  const { page } = Route.useLoaderData();
  const settings = useSettings();
  const phoneDisplay = str(settings.phone, "01-5970145");
  const phoneTel = str(settings.phoneHref, "tel:015970145");
  const supportEmail = str(settings.email, "45.imperial@gmail.com");
  const hours = str(settings.hours, "Sun – Thu, 10 AM – 4 PM");

  const channels = [
    {
      icon: Headphones,
      title: "Call Us",
      desc: "Speak directly with our support team",
      action: phoneDisplay,
      href: phoneTel,
      iconColor: "text-brand-blue",
      iconBg: "bg-brand-blue-lt",
    },
    {
      icon: Mail,
      title: "Email Support",
      desc: "Get a response within 24 hours",
      action: supportEmail,
      href: `mailto:${supportEmail}`,
      iconColor: "text-brand-green-dk",
      iconBg: "bg-brand-green-lt",
    },
    {
      icon: ShieldCheck,
      title: "Grievance",
      desc: "Submit a formal complaint to our grievance officer",
      action: "Submit Grievance",
      href: "/grievance",
      iconColor: "text-brand-blue-dk",
      iconBg: "bg-brand-blue-lt",
    },
    {
      icon: Clock,
      title: "Business Hours",
      desc: hours,
      action: "Nepal Standard Time",
      iconColor: "text-brand-green-dk",
      iconBg: "bg-brand-green-lt/80",
    },
  ] as const;

  return (
    <PageShell>
      <PageHero
        title={str(page.title, FALLBACK.title)}
        subtitle={str(page.subtitle, FALLBACK.subtitle)}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Support" }]}
      />

      {str(page.body) ? (
        <section className="mx-auto max-w-[1280px] px-4 pt-10 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <CmsHtml value={page.body} className="prose prose-sm max-w-none text-brand-gray" />
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => {
            const Icon = c.icon;
            const card = (
              <>
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${c.iconBg} ${c.iconColor}`}
                  aria-hidden
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-heading text-base font-bold text-foreground">
                  {c.title}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                  {c.desc}
                </p>
                <p className="break-all text-sm font-semibold text-brand-blue">
                  {c.action}
                </p>
              </>
            );

            return "href" in c && c.href ? (
              c.href.startsWith("/") ? (
                <Link
                  key={c.title}
                  to={c.href}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md"
                >
                  {card}
                </Link>
              ) : (
                <a
                  key={c.title}
                  href={c.href}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md"
                >
                  {card}
                </a>
              )
            ) : (
              <div
                key={c.title}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                {card}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-brand-gray-lt/80 py-12 md:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-8">
            <span className="mb-2 inline-block rounded-full bg-brand-blue-lt px-3 py-1 text-xs font-semibold text-brand-blue-dk">
              Resources
            </span>
            <h2 className="text-balance font-heading text-2xl font-extrabold text-foreground">
              Help Articles & Guides
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {resources.map((r) => {
              const Icon = r.icon;
              const inner = (
                <>
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-lt text-brand-blue"
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-foreground">
                      {r.title}
                    </h4>
                    <p className="text-pretty text-xs text-muted-foreground">
                      {r.desc}
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand-blue"
                    aria-hidden
                  />
                </>
              );

              const className =
                "group flex min-h-11 items-center gap-4 rounded-xl border border-border bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/20";

              return "external" in r && r.external ? (
                <a
                  key={r.title}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <a key={r.title} href={r.href} className={className}>
                  {inner}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-brand-blue/10 bg-gradient-to-r from-brand-blue-lt to-brand-green-lt p-8">
          <p className="text-sm font-medium text-foreground">Still need help?</p>
          <Link
            to="/faqs"
            className="inline-flex min-h-11 items-center rounded-xl border border-brand-blue/20 bg-white px-4 py-2 text-sm font-semibold text-brand-blue shadow-sm transition-shadow hover:shadow-md"
          >
            Browse FAQs
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center rounded-xl bg-gradient-to-r from-brand-green to-brand-green-dk px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(55,210,0,0.45)] transition-shadow hover:shadow-[0_10px_28px_-8px_rgba(55,210,0,0.55)]"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
