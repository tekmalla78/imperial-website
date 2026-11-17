import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, User } from "lucide-react";
import { blogCategoryColors } from "@/data/blogPosts";
import type { CmsRecord } from "@/cms/types";
import { str } from "@/cms/seo";

export default function BlogSection({ posts = [] }: { posts?: CmsRecord[] }) {
  if (posts.length === 0) return null;
  const [featured, ...rest] = posts;
  const featuredSlug = str(featured.data.slug, featured.id);

  return (
    <section id="blog" className="bg-gradient-to-b from-brand-green-lt/70 via-white to-white px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-foreground">
              Blog & <span className="text-brand-blue">Insights</span>
            </h2>
            <p className="mt-3 text-[15px] leading-[1.72] text-brand-gray">
              Market analysis, investment tips, and educational content from our experts.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold text-brand-blue transition-colors hover:text-brand-blue-dk"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-blue/5 to-brand-green/5 p-6 sm:p-8">
          <span
            className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${blogCategoryColors[str(featured.data.category)] ?? "bg-muted text-muted-foreground"}`}
          >
            {str(featured.data.category)}
          </span>
          <h3 className="font-heading text-xl font-extrabold leading-snug text-foreground sm:text-2xl">
            {str(featured.data.title)}
          </h3>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-brand-gray">{str(featured.data.excerpt)}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-brand-gray">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" strokeWidth={2} />
              {str(featured.data.author)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
              {str(featured.data.date)}
            </span>
            <span>{str(featured.data.readTime)} read</span>
          </div>
          <Link
            to="/blog/$slug"
            params={{ slug: featuredSlug }}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue transition-colors hover:text-brand-blue-dk"
          >
            Read article
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {rest.map((post) => {
            const slug = str(post.data.slug, post.id);
            return (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug }}
                className="group flex flex-col rounded-2xl border border-border bg-white p-5 transition-colors hover:border-brand-blue hover:shadow-[0_4px_24px_rgba(21,87,192,.10)]"
              >
                <span
                  className={`mb-3 inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${blogCategoryColors[str(post.data.category)] ?? "bg-muted text-muted-foreground"}`}
                >
                  {str(post.data.category)}
                </span>
                <h4 className="font-heading text-[15px] font-bold leading-snug text-foreground group-hover:text-brand-blue">
                  {str(post.data.title)}
                </h4>
                <p className="mt-2 line-clamp-3 flex-1 text-[12.5px] leading-relaxed text-brand-gray">
                  {str(post.data.excerpt)}
                </p>
                <div className="mt-4 flex items-center justify-between text-[11px] text-brand-gray">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" strokeWidth={2} />
                    {str(post.data.date)}
                  </span>
                  <span>{str(post.data.readTime)} read</span>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-blue">
                  Read more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
