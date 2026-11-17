import { createFileRoute, Link } from "@tanstack/react-router";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import { Calendar, ArrowRight, User } from "lucide-react";
import { blogCategoryColors } from "@/data/blogPosts";
import { loadPublished } from "@/cms/load-public";
import { seoMeta, str } from "@/cms/seo";

export const Route = createFileRoute("/blog")({
  loader: async () => ({ posts: await loadPublished("blog") }),
  component: BlogPage,
  head: () => ({
    meta: seoMeta(
      "Blog — Imperial Securities",
      "Read insights, market analysis, and investment tips from Imperial Securities experts.",
    ),
  }),
});

function BlogPage() {
  const { posts } = Route.useLoaderData();
  const featured = posts[0];

  return (
    <PageShell>
      <PageHero
        title="Blog & Insights"
        subtitle="Market analysis, investment tips, and educational content from our experts"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:py-16">
        {featured ? (
          <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-blue/5 to-brand-green/5 shadow-sm">
            <div className="p-8 md:p-10">
              <span
                className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${blogCategoryColors[str(featured.data.category)] ?? "bg-muted text-muted-foreground"}`}
              >
                {str(featured.data.category)}
              </span>
              <h2 className="mb-3 font-heading text-2xl font-extrabold text-foreground md:text-3xl">
                {str(featured.data.title)}
              </h2>
              <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {str(featured.data.excerpt)}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {str(featured.data.author)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {str(featured.data.date)}
                </span>
                <span>{str(featured.data.readTime)} read</span>
              </div>
              <Link
                to="/blog/$slug"
                params={{ slug: str(featured.data.slug, featured.id) }}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue transition-colors hover:text-brand-blue-dk"
              >
                Read Article <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <p className="mb-10 text-sm text-muted-foreground">Articles will appear here after they are published.</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(1).map((post) => (
            <Link
              key={post.id}
              to="/blog/$slug"
              params={{ slug: str(post.data.slug, post.id) }}
              className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span
                className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${blogCategoryColors[str(post.data.category)] || "bg-muted text-muted-foreground"}`}
              >
                {str(post.data.category)}
              </span>
              <h3 className="mb-2 font-heading text-base font-bold leading-snug text-foreground">{str(post.data.title)}</h3>
              <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{str(post.data.excerpt)}</p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {str(post.data.date)}
                </span>
                <span>{str(post.data.readTime)} read</span>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue transition-colors group-hover:text-brand-blue-dk">
                Read More <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
