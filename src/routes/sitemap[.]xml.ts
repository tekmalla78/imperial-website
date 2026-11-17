import { createFileRoute } from "@tanstack/react-router";
import { sitemapDataFn } from "@/cms/functions";
import { str } from "@/cms/seo";

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sitemapResponse(request: Request) {
  const origin = new URL(request.url).origin;
  const data = await sitemapDataFn();
  const staticPaths = [
    "/",
    "/about",
    "/blog",
    "/news-events",
    "/faqs",
    "/downloads",
    "/contact",
    "/support",
    "/chairman-message",
    "/management-team",
    "/our-team",
    "/grievance",
    "/services/stock-brokerage",
    "/services/depository-services",
    "/services/margin-trading",
    "/services/portfolio-management",
    "/services/ipo-fpo",
    "/services/research-advisory",
  ];
  const dynamic = [
    ...data.posts.map((item) => `/blog/${str(item.data.slug, item.id)}`),
    ...data.news.map((item) => `/news/${str(item.data.slug, item.id)}`),
    ...data.branches.map((item) => `/branches/${str(item.data.slug, item.id)}`),
    ...data.services.map((item) => `/services/${str(item.data.slug, item.id)}`),
    ...data.pages
      .map((item) => `/${str(item.data.slug, item.id)}`)
      .filter((path) => path !== "/about"),
  ];
  const urls = [...new Set([...staticPaths, ...dynamic])];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${xmlEscape(`${origin}${path}`)}</loc>
    <changefreq>weekly</changefreq>
  </url>`,
  )
  .join("\n")}
</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => sitemapResponse(request),
    },
  },
});
