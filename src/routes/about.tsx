import { createFileRoute, Link } from "@tanstack/react-router";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import FoundationSection from "../components/FoundationSection";
import AdvantageGrid from "../components/AdvantageGrid";
import HistoryTimeline from "../components/HistoryTimeline";
import { ArrowRight, Mail, Phone, Linkedin } from "lucide-react";
import { getAboutFn } from "@/cms/functions";
import { DEFAULT_ABOUT } from "@/cms/types";
import { splitPairs } from "@/cms/collections";
import { parseTimelineList } from "@/cms/list-data";
import { seoMeta, str } from "@/cms/seo";
import { parseBoardMembers } from "@/cms/board";
import { CmsHtml } from "@/components/CmsHtml";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const page = await getAboutFn();
    return { page: { ...DEFAULT_ABOUT, ...page } };
  },
  component: AboutPage,
  head: ({ loaderData }) => ({
    meta: seoMeta(
      str(loaderData?.page.seoTitle, DEFAULT_ABOUT.seoTitle),
      str(loaderData?.page.seoDescription, DEFAULT_ABOUT.seoDescription),
    ),
  }),
});

const teamAccentClass = {
  blue: {
    bar: "bg-brand-blue",
    badge: "bg-brand-blue-lt text-brand-blue",
    role: "text-brand-blue",
  },
  green: {
    bar: "bg-brand-green",
    badge: "bg-brand-green-lt text-brand-green-dk",
    role: "text-brand-green-dk",
  },
} as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 focus-visible:ring-offset-2";

const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark";

function AboutPage() {
  const { page } = Route.useLoaderData();
  const timeline = parseTimelineList(page.timeline).map((row) => ({
    year: row.year,
    title: row.title,
    desc: row.desc,
    icon: row.icon || undefined,
  }));
  const advantages = splitPairs(page.advantages).map((row, index) => ({
    title: row.title,
    desc: row.desc,
    tone: (index % 3 === 2 ? "green" : "blue") as "blue" | "green",
  }));
  const team = parseBoardMembers(page.board).map((person, index) => ({
    ...person,
    dept: "",
    accent: index % 2 === 0 ? ("blue" as const) : ("green" as const),
    initials: person.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2),
  }));
  const regulationBadges = splitPairs(page.regulationBadges).map((row, index) => ({
    v: row.title,
    l: row.desc,
    accent: (index === 0 ? "green" : "blue") as "green" | "blue",
  }));
  const ctaHref = str(page.ctaHref, DEFAULT_ABOUT.ctaHref);
  const ctaLabel = str(page.ctaLabel, DEFAULT_ABOUT.ctaLabel);
  const secondaryCtaHref = str(page.secondaryCtaHref, DEFAULT_ABOUT.secondaryCtaHref);
  const secondaryCtaLabel = str(page.secondaryCtaLabel, DEFAULT_ABOUT.secondaryCtaLabel);

  return (
    <PageShell>
      <PageHero
        eyebrow={str(page.heroEyebrow, DEFAULT_ABOUT.heroEyebrow)}
        title={str(page.heroTitle, DEFAULT_ABOUT.heroTitle)}
        subtitle={str(page.heroSubtitle, DEFAULT_ABOUT.heroSubtitle)}
      />
      <FoundationSection mission={page.mission} vision={page.vision} values={page.values} />

      <HistoryTimeline
        entries={timeline}
        intro={
          <>
            <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[2px] text-brand-blue">
              {str(page.journeyEyebrow, DEFAULT_ABOUT.journeyEyebrow)}
            </p>
            <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] tracking-tight text-foreground text-balance">
              {str(page.journeyTitlePrefix, DEFAULT_ABOUT.journeyTitlePrefix)}{" "}
              <span className="text-brand-green-dk">
                {str(page.journeyTitleAccent, DEFAULT_ABOUT.journeyTitleAccent)}
              </span>{" "}
              {str(page.journeyTitleSuffix, DEFAULT_ABOUT.journeyTitleSuffix)}
            </h2>
            <div className="mt-4 space-y-3 text-[14px] leading-[1.72] text-brand-gray md:text-[15px] text-pretty">
              <CmsHtml value={page.introBody} className="prose prose-sm max-w-none text-brand-gray" />
              {str(page.quoteText) ? (
                <blockquote className="rounded-xl border border-brand-blue/15 bg-brand-blue-lt/50 px-4 py-3.5 italic text-brand-blue-dk">
                  &ldquo;{str(page.quoteText)}&rdquo;
                </blockquote>
              ) : null}
              {str(page.introBodyAfter) ? (
                <p>{str(page.introBodyAfter)}</p>
              ) : null}
            </div>
          </>
        }
      />

      <section className="relative overflow-hidden bg-brand-dark py-12 md:py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand-blue/15 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-8 max-w-3xl md:mb-10">
            <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[2px] text-brand-green">
              {str(page.advantagesEyebrow, DEFAULT_ABOUT.advantagesEyebrow)}
            </p>
            <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-white text-balance">
              {str(page.advantagesTitle, DEFAULT_ABOUT.advantagesTitle)}
            </h2>
          </div>

          <AdvantageGrid items={advantages} />
        </div>
      </section>

      <section id="leadership" className="scroll-mt-28 bg-brand-gray-lt py-12 md:py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between md:mb-10">
            <div className="min-w-0 max-w-2xl">
              <p className="mb-2.5 text-[11.5px] font-bold tracking-[2px] text-brand-blue">
                {str(page.leadershipEyebrow, DEFAULT_ABOUT.leadershipEyebrow)}
              </p>
              <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-foreground text-balance">
                {str(page.leadershipTitle, DEFAULT_ABOUT.leadershipTitle)}
              </h2>
              <p className="mt-3 text-[14px] leading-[1.72] text-brand-gray md:text-[15px] text-pretty">
                {str(page.leadershipBody, DEFAULT_ABOUT.leadershipBody)}
              </p>
            </div>
            <Link
              to="/management-team"
              className={`hidden min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-brand-blue/20 bg-white px-5 py-2.5 text-sm font-semibold text-brand-blue shadow-sm transition-all active:scale-[0.98] sm:flex sm:w-auto ${focusRing} [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-brand-blue [@media(hover:hover)]:hover:shadow-md`}
            >
              Meet Our Management Team <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((p) => {
              const accent = teamAccentClass[p.accent];
              return (
                <article
                  key={p.name}
                  className="group relative min-w-0 overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all active:scale-[0.99] [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-md"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`} aria-hidden />
                  <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-brand-blue/10 to-brand-green/10">
                    {p.photo ? (
                      <img
                        src={p.photo}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain object-center transition-transform duration-300 [@media(hover:hover)]:group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-heading text-4xl font-bold text-brand-blue">
                        {p.initials}
                      </div>
                    )}
                    {p.dept ? (
                      <span
                        className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${accent.badge}`}
                      >
                        {p.dept}
                      </span>
                    ) : null}
                  </div>

                  <div className="px-4 pb-4 pt-3">
                    <h3 className="font-heading text-base font-bold text-foreground">{p.name}</h3>
                    <p className={`text-xs font-semibold ${accent.role}`}>{p.role}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>

                    <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                      {p.email ? (
                        <a
                          href={`mailto:${p.email}`}
                          title={p.email}
                          aria-label={`Email ${p.name}`}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-lt text-brand-blue transition-all active:scale-[0.98] active:bg-brand-blue active:text-white [@media(hover:hover)]:hover:bg-brand-blue [@media(hover:hover)]:hover:text-white ${focusRing}`}
                        >
                          <Mail className="h-4 w-4" aria-hidden />
                        </a>
                      ) : null}
                      {p.phone ? (
                        <a
                          href={`tel:${p.phone.replace(/\s/g, "")}`}
                          title={p.phone}
                          aria-label={`Call ${p.name}`}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-lt text-brand-blue transition-all active:scale-[0.98] active:bg-brand-blue active:text-white [@media(hover:hover)]:hover:bg-brand-blue [@media(hover:hover)]:hover:text-white ${focusRing}`}
                        >
                          <Phone className="h-4 w-4" aria-hidden />
                        </a>
                      ) : null}
                      {p.linkedin ? (
                        <a
                          href={p.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LinkedIn Profile"
                          aria-label={`${p.name} on LinkedIn`}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-lt text-[#0A66C2] transition-all active:scale-[0.98] active:bg-[#0A66C2] active:text-white [@media(hover:hover)]:hover:bg-[#0A66C2] [@media(hover:hover)]:hover:text-white ${focusRing}`}
                        >
                          <Linkedin className="h-4 w-4" aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center md:mt-10">
            <Link
              to="/management-team"
              className={`inline-flex min-h-11 w-full max-w-sm items-center justify-center gap-2 rounded-full bg-brand-blue px-7 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] sm:w-auto sm:max-w-none ${focusRing} [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:bg-brand-blue-dk [@media(hover:hover)]:hover:shadow-lg`}
            >
              Meet Our Management Team <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="regulation-heading"
        className="bg-gradient-to-r from-brand-blue-dk via-brand-blue to-brand-blue-dk py-10 md:py-12"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid items-center gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8">
            <div className="min-w-0">
              <h3
                id="regulation-heading"
                className="font-heading text-2xl font-extrabold text-white text-balance md:text-3xl"
              >
                {str(page.regulationTitle, DEFAULT_ABOUT.regulationTitle)}
              </h3>
              <p className="mt-3 max-w-xl text-sm text-white/90 md:text-base">
                {str(page.regulationBody, DEFAULT_ABOUT.regulationBody)}
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
              {regulationBadges.map((b) => (
                <li
                  key={b.l}
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-3.5 text-center sm:px-4"
                >
                  <div
                    className={`font-heading text-base font-extrabold md:text-lg ${
                      b.accent === "green" ? "text-brand-green" : "text-white"
                    }`}
                  >
                    {b.v}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-white/90">{b.l}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green-dk via-brand-green-dk to-brand-blue-dk py-12 md:py-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-white text-balance">
            {str(page.ctaHeadline, DEFAULT_ABOUT.ctaHeadline)}
          </h2>
          <p className="mt-3 text-[15px] leading-[1.72] text-white/90 md:mt-4 text-pretty">
            {str(page.ctaBody, DEFAULT_ABOUT.ctaBody)}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:mt-8">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-green to-brand-green-dk px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(55,210,0,0.55)] transition-transform active:scale-[0.98] sm:w-auto ${focusRingOnDark} [@media(hover:hover)]:hover:-translate-y-0.5`}
            >
              {ctaLabel}
            </a>
            <a
              href={secondaryCtaHref}
              className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition-colors active:bg-white/20 sm:w-auto ${focusRingOnDark} [@media(hover:hover)]:hover:bg-white/20`}
            >
              {secondaryCtaLabel} <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
