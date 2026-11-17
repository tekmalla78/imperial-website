import { createFileRoute } from "@tanstack/react-router";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import FAQsSection from "../components/FAQsSection";
import { loadPublished } from "@/cms/load-public";
import { getFaqCategoriesFn } from "@/cms/functions";
import { seoMeta, str } from "@/cms/seo";
import { slugify, splitLines } from "@/cms/collections";
import { DEFAULT_FAQ_CATEGORIES } from "@/cms/types";
import { faqCategories, type FaqCategory } from "../data/faqs";

export const Route = createFileRoute("/faqs")({
  loader: async () => {
    const [items, categoryConfig] = await Promise.all([
      loadPublished("faqs"),
      getFaqCategoriesFn(),
    ]);
    const managedOrder = splitLines(
      categoryConfig.categories ?? DEFAULT_FAQ_CATEGORIES.categories,
    );
    const grouped = new Map<string, FaqCategory>();

    for (const item of items.sort(
      (a, b) => Number(a.data.order ?? 99) - Number(b.data.order ?? 99),
    )) {
      const name = str(item.data.category, "General");
      if (!grouped.has(name)) {
        grouped.set(name, { id: slugify(name), name, faqs: [] });
      }
      grouped.get(name)?.faqs.push({
        id: item.id,
        q: str(item.data.question),
        a: str(item.data.answer),
      });
    }

    const categories: FaqCategory[] = [];
    for (const name of managedOrder) {
      const cat = grouped.get(name);
      if (cat) {
        categories.push(cat);
        grouped.delete(name);
      }
    }
    for (const cat of grouped.values()) {
      categories.push(cat);
    }

    return { categories: categories.length > 0 ? categories : faqCategories };
  },
  component: FAQsPage,
  head: () => ({
    meta: seoMeta(
      "FAQs — Imperial Securities",
      "Answers about online account opening, NEPSE trading, IPO applications, DEMAT, and Imperial Securities support.",
    ),
  }),
});

function FAQsPage() {
  const { categories } = Route.useLoaderData();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((cat) =>
      cat.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    ),
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Answers about account opening, trading, IPOs, and client support"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
      />
      <FAQsSection categories={categories} />
    </PageShell>
  );
}
