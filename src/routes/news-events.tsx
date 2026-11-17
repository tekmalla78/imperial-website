import { createFileRoute, Link } from "@tanstack/react-router";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import { Calendar, MapPin, ArrowRight, Bell } from "lucide-react";
import { loadPublished } from "@/cms/load-public";
import { seoMeta, str } from "@/cms/seo";

export const Route = createFileRoute("/news-events")({
  loader: async () => ({
    news: await loadPublished("news"),
    events: await loadPublished("events"),
  }),
  component: NewsEventsPage,
  head: () => ({
    meta: seoMeta(
      "News & Events — Imperial Securities",
      "Stay updated with the latest news, announcements, and events from Imperial Securities.",
    ),
  }),
});

const categoryColors: Record<string, string> = {
  "Market Update": "bg-brand-blue-lt text-brand-blue",
  Announcement: "bg-brand-green-lt text-brand-green-dk",
  Regulation: "bg-brand-blue-lt text-brand-blue-dk",
  Corporate: "bg-brand-green-lt text-brand-green-dk",
};

function NewsEventsPage() {
  const { news, events } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHero
        title="News & Events"
        subtitle="Stay informed about market updates, company announcements, and upcoming events"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News & Events" }]}
      />

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-blue" />
              <h2 className="font-heading text-xl font-bold text-foreground">Latest News</h2>
            </div>
            <div className="space-y-4">
              {news.map((n) => {
                const slug = str(n.data.slug, n.id);
                return (
                  <article key={n.id} className="group rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${categoryColors[str(n.data.category)] || "bg-muted text-muted-foreground"}`}
                      >
                        {str(n.data.category)}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {str(n.data.date)}
                      </span>
                    </div>
                    <h3 className="mb-1.5 font-heading text-base font-bold text-foreground">{str(n.data.title)}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{str(n.data.excerpt)}</p>
                    <Link
                      to="/news/$slug"
                      params={{ slug }}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue transition-colors group-hover:text-brand-blue-dk"
                    >
                      Read More <ArrowRight className="h-3 w-3" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-green-dk" />
              <h2 className="font-heading text-xl font-bold text-foreground">Upcoming Events</h2>
            </div>
            <div className="space-y-4">
              {events.map((e) => {
                const date = str(e.data.date);
                const parts = date.split("-");
                const month = parts.length === 3 ? date : date.split(" ")[0];
                const day = parts.length === 3 ? parts[2] : date.split(" ")[1]?.replace(",", "");
                return (
                  <div key={e.id} className="rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-3 flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-blue-lt text-center">
                        <span className="text-[10px] font-semibold text-brand-blue">{month}</span>
                        <span className="text-lg font-extrabold leading-none text-brand-blue">{day}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{str(e.data.title)}</h4>
                        <p className="text-xs text-muted-foreground">{str(e.data.time)}</p>
                      </div>
                    </div>
                    <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{str(e.data.desc)}</p>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {str(e.data.location)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
