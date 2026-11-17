import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import { Calendar } from "lucide-react";
import { loadPublishedBySlug } from "@/cms/load-public";
import { seoMeta, str } from "@/cms/seo";
import { CmsHtml } from "@/components/CmsHtml";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const item = await loadPublishedBySlug("news", params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    const item = loaderData?.item;
    return {
      meta: seoMeta(
        str(item?.data.seoTitle, str(item?.data.title, "News")),
        str(item?.data.seoDescription, str(item?.data.excerpt)),
      ),
    };
  },
  component: NewsArticlePage,
});

function NewsArticlePage() {
  const { item } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHero
        title={str(item.data.title)}
        subtitle={str(item.data.excerpt)}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News & Events", href: "/news-events" },
          { label: str(item.data.title) },
        ]}
      />
      <article className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 md:py-16">
        <p className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {str(item.data.date)}
        </p>
        <CmsHtml
          value={item.data.body || item.data.excerpt}
          className="prose max-w-none text-[16px] leading-[1.8] text-foreground/85 prose-headings:font-heading prose-a:text-brand-blue prose-img:rounded-xl prose-table:w-full"
        />
        <Link to="/news-events" className="mt-10 inline-block text-sm font-semibold text-brand-blue hover:underline">
          ← All news
        </Link>
      </article>
    </PageShell>
  );
}
