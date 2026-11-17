import { splitLines, splitPairs } from "./collections";
import { getPublicItemFn, listItemsFn } from "./functions";
import type { CmsRecord } from "./types";

export async function loadPublished(collection: string) {
  return listItemsFn({ data: { collection, publishedOnly: true } });
}

export async function loadPublishedBySlug(collection: string, slug: string) {
  const direct = await getPublicItemFn({ data: { collection, id: slug } });
  if (direct) return direct;
  const items = await loadPublished(collection);
  return items.find((item) => item.id === slug || String(item.data.slug ?? "") === slug) ?? null;
}

export async function loadPage(slug: string) {
  return loadPublishedBySlug("pages", slug);
}

export function recordToService(record: CmsRecord | null) {
  if (!record) return null;
  return {
    title: String(record.data.title ?? ""),
    subtitle: String(record.data.subtitle ?? ""),
    description: String(record.data.description ?? ""),
    features: splitPairs(record.data.features),
    benefits: splitLines(record.data.benefits),
    seoTitle: String(record.data.seoTitle ?? record.data.title ?? ""),
    seoDescription: String(record.data.seoDescription ?? record.data.subtitle ?? ""),
  };
}

export async function loadService(slug: string) {
  return recordToService(await loadPublishedBySlug("services", slug));
}
