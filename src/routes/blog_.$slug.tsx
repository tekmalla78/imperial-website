import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import { Calendar, User } from "lucide-react";
import { loadPublishedBySlug } from "@/cms/load-public";
import { seoMeta, str } from "@/cms/seo";
import { CmsHtml } from "@/components/CmsHtml";

export const Route = createFileRoute("/blog_/$slug")({
  loader: async ({ params }) => {
    const post = await loadPublishedBySlug("blog", params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    return {
      meta: seoMeta(
        str(post?.data.seoTitle, str(post?.data.title, "Blog")),
        str(post?.data.seoDescription, str(post?.data.excerpt)),
      ),
    };
  },
  component: BlogArticlePage,
});

function BlogArticlePage() {
  const { post } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHero
        title={str(post.data.title)}
        subtitle={str(post.data.excerpt)}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: str(post.data.title) }]}
      />
      <article className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 md:py-16">
        <div className="mb-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <User className="h-4 w-4" />
            {str(post.data.author)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {str(post.data.date)}
          </span>
          <span>{str(post.data.readTime)} read</span>
        </div>
        <CmsHtml
          value={post.data.body || post.data.excerpt}
          className="prose max-w-none text-[16px] leading-[1.8] text-foreground/85 prose-headings:font-heading prose-a:text-brand-blue prose-img:rounded-xl prose-table:w-full"
        />
        <Link to="/blog" className="mt-10 inline-block text-sm font-semibold text-brand-blue hover:underline">
          ← All articles
        </Link>
      </article>
    </PageShell>
  );
}
