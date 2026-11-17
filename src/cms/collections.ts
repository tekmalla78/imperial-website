import type { CmsData } from "./types";
import { parseLineList, parsePairList, parseTripleList } from "./list-data";

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "email"
  | "tel"
  | "select"
  | "toggle"
  | "date"
  | "lines"
  | "pairs"
  | "triples"
  | "timeline"
  | "image"
  | "file"
  | "richtext"
  | "board"
  | "payment-methods"
  | "custom-menus";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  /** Optional labels for structured list editors */
  itemLabel?: string;
  titleLabel?: string;
  descLabel?: string;
  aLabel?: string;
  bLabel?: string;
  cLabel?: string;
  descMultiline?: boolean;
  cMultiline?: boolean;
};

export type CollectionDef = {
  id: string;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  publicPath?: (item: CmsData) => string | null;
  fields: FieldDef[];
};

export const COLLECTIONS: Record<string, CollectionDef> = {
  pages: {
    id: "pages",
    label: "Pages",
    singular: "page",
    description: "Chairman message, support, and other long-form pages.",
    titleField: "title",
    publicPath: (item) => (item.slug ? `/${String(item.slug)}` : null),
    fields: [
      { name: "title", label: "Page title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", hint: "Example: chairman-message", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "personName", label: "Person name", type: "text", hint: "Optional, for chairman or author pages" },
      { name: "personRole", label: "Person role", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "linkedin", label: "LinkedIn URL", type: "url" },
      { name: "body", label: "Page content", type: "richtext", hint: "Full editor with headings, lists, tables, and images." },
      { name: "seoTitle", label: "Search title", type: "text", hint: "Shown in Google. Keep under 60 characters." },
      { name: "seoDescription", label: "Search description", type: "textarea", rows: 3, hint: "Keep under 160 characters." },
      { name: "published", label: "Published", type: "toggle" },
    ],
  },
  blog: {
    id: "blog",
    label: "Blog",
    singular: "article",
    description: "Insights and education articles.",
    titleField: "title",
    publicPath: (item) => (item.slug ? `/blog/${String(item.slug)}` : "/blog"),
    fields: [
      { name: "title", label: "Headline", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", hint: "Used in /blog/your-slug" },
      { name: "excerpt", label: "Short summary", type: "textarea", rows: 3, required: true },
      { name: "body", label: "Article", type: "richtext", hint: "Full editor with headings, lists, tables, and images." },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "Education", label: "Education" },
          { value: "Analysis", label: "Analysis" },
          { value: "Guide", label: "Guide" },
          { value: "Strategy", label: "Strategy" },
        ],
      },
      { name: "author", label: "Author", type: "text" },
      { name: "date", label: "Publish date", type: "date" },
      { name: "readTime", label: "Read time", type: "text", placeholder: "6 min" },
      { name: "seoTitle", label: "Search title", type: "text" },
      { name: "seoDescription", label: "Search description", type: "textarea", rows: 3 },
      { name: "published", label: "Published", type: "toggle" },
    ],
  },
  news: {
    id: "news",
    label: "News",
    singular: "news item",
    description: "Company and market announcements.",
    titleField: "title",
    publicPath: (item) => (item.slug ? `/news/${String(item.slug)}` : "/news-events"),
    fields: [
      { name: "title", label: "Headline", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text" },
      { name: "excerpt", label: "Summary", type: "textarea", rows: 3, required: true },
      { name: "body", label: "Full story", type: "richtext" },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "Market Update", label: "Market Update" },
          { value: "Announcement", label: "Announcement" },
          { value: "Regulation", label: "Regulation" },
          { value: "Corporate", label: "Corporate" },
        ],
      },
      { name: "date", label: "Date", type: "date" },
      { name: "seoTitle", label: "Search title", type: "text" },
      { name: "seoDescription", label: "Search description", type: "textarea", rows: 3 },
      { name: "published", label: "Published", type: "toggle" },
    ],
  },
  events: {
    id: "events",
    label: "Events",
    singular: "event",
    description: "Workshops and seminars.",
    titleField: "title",
    publicPath: () => "/news-events",
    fields: [
      { name: "title", label: "Event name", type: "text", required: true },
      { name: "date", label: "Date", type: "date" },
      { name: "time", label: "Time", type: "text", placeholder: "11:00 AM – 2:00 PM" },
      { name: "location", label: "Location", type: "text" },
      { name: "desc", label: "Description", type: "textarea", rows: 4 },
      { name: "published", label: "Published", type: "toggle" },
    ],
  },
  branches: {
    id: "branches",
    label: "Branches",
    singular: "branch",
    description: "Offices across Nepal.",
    titleField: "name",
    publicPath: (item) => (item.slug ? `/branches/${String(item.slug)}` : null),
    fields: [
      { name: "name", label: "Branch name", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "city", label: "City", type: "text" },
      { name: "addr", label: "Address", type: "text", required: true },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "email", label: "Email", type: "email" },
      { name: "hours", label: "Opening hours", type: "text" },
      { name: "manager", label: "Branch manager", type: "text" },
      { name: "established", label: "Established", type: "text" },
      { name: "mapsQuery", label: "Google Maps search", type: "text", hint: "Used to build the directions link." },
      { name: "description", label: "About this branch", type: "richtext" },
      {
        name: "staffPhotoUrl",
        label: "Staff photo",
        type: "image",
        hint: "Optional. Leave empty to use the default branch staff image.",
      },
      { name: "published", label: "Published", type: "toggle" },
    ],
  },
  faqs: {
    id: "faqs",
    label: "FAQs",
    singular: "FAQ",
    description: "Questions investors ask most.",
    titleField: "question",
    publicPath: () => "/faqs",
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "richtext", required: true },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        hint: "Manage the list under FAQ categories in admin.",
        // Options are filled at edit time from the FAQ categories singleton.
        options: [],
      },
      { name: "order", label: "Order", type: "text", hint: "Lower numbers appear first." },
      { name: "published", label: "Published", type: "toggle" },
    ],
  },
  team: {
    id: "team",
    label: "Team",
    singular: "team member",
    description: "Management and staff directory.",
    titleField: "name",
    publicPath: (item) =>
      item.group === "staff" ? "/our-team" : "/management-team",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "dept", label: "Department", type: "text" },
      {
        name: "group",
        label: "Shown on",
        type: "select",
        options: [
          { value: "management", label: "Management team page" },
          { value: "staff", label: "Our team page" },
        ],
      },
      { name: "desc", label: "Bio", type: "textarea", rows: 4 },
      { name: "photo", label: "Photo", type: "image" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "linkedin", label: "LinkedIn URL", type: "url" },
      { name: "published", label: "Published", type: "toggle" },
    ],
  },
  services: {
    id: "services",
    label: "Services",
    singular: "service",
    description: "Brokerage, DEMAT, margin, and more.",
    titleField: "title",
    publicPath: (item) => (item.slug ? `/services/${String(item.slug)}` : null),
    fields: [
      { name: "title", label: "Service name", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true, hint: "Example: stock-brokerage" },
      { name: "subtitle", label: "Hero subtitle", type: "textarea", rows: 3 },
      { name: "description", label: "Longer description", type: "richtext" },
      { name: "features", label: "Features", type: "pairs", itemLabel: "Feature", titleLabel: "Title", descLabel: "Short description" },
      { name: "benefits", label: "Benefits", type: "lines", itemLabel: "Benefit" },
      { name: "seoTitle", label: "Search title", type: "text" },
      { name: "seoDescription", label: "Search description", type: "textarea", rows: 3 },
      { name: "published", label: "Published", type: "toggle" },
    ],
  },
  downloads: {
    id: "downloads",
    label: "Downloads",
    singular: "form",
    description: "KYC, DEMAT and order forms.",
    titleField: "title",
    publicPath: () => "/downloads",
    fields: [
      { name: "title", label: "Form name", type: "text", required: true },
      { name: "group", label: "Group", type: "text", hint: "Example: New Account Registration" },
      { name: "groupDescription", label: "Group description", type: "text" },
      { name: "file", label: "File", type: "file", hint: "Upload a PDF or document for visitors to download." },
      { name: "published", label: "Published", type: "toggle" },
    ],
  },
};

export const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard" }],
  },
  {
    label: "Site",
    items: [
      { to: "/admin/settings", label: "Company details" },
      { to: "/admin/homepage", label: "Homepage" },
      { to: "/admin/payment-banking", label: "Payment & Banking" },
      { to: "/admin/about", label: "About page" },
      { to: "/admin/contact", label: "Contact page" },
      { to: "/admin/grievance", label: "Grievance page" },
      { to: "/admin/navigation", label: "Navigation" },
      { to: "/admin/pages", label: "Pages" },
    ],
  },
  {
    label: "Publishing",
    items: [
      { to: "/admin/blog", label: "Blog" },
      { to: "/admin/news", label: "News" },
      { to: "/admin/events", label: "Events" },
    ],
  },
  {
    label: "Company",
    items: [
      { to: "/admin/branches", label: "Branches" },
      { to: "/admin/team", label: "Team" },
      { to: "/admin/faqs", label: "FAQs" },
      { to: "/admin/faq-categories", label: "FAQ categories" },
    ],
  },
  {
    label: "Offers",
    items: [
      { to: "/admin/services", label: "Services" },
      { to: "/admin/downloads", label: "Downloads" },
    ],
  },
] as const;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

/** Serializable collection metadata for route loaders (no functions). */
export function toPlainCollection(def: CollectionDef) {
  return {
    id: def.id,
    label: def.label,
    singular: def.singular,
    description: def.description,
    titleField: def.titleField,
    fields: def.fields,
  };
}

export type PlainCollection = ReturnType<typeof toPlainCollection>;

export function resolvePublicPath(collectionId: string, item: CmsData) {
  return COLLECTIONS[collectionId]?.publicPath?.(item) ?? null;
}

export function splitLines(value: unknown) {
  return parseLineList(value);
}

export function splitPairs(value: unknown) {
  return parsePairList(value);
}

export function splitTriples(value: unknown) {
  return parseTripleList(value);
}

export function splitQuads(value: unknown) {
  return splitLines(value).map((line) => {
    const [a, b, c, ...rest] = line.split("|");
    return {
      a: (a ?? "").trim(),
      b: (b ?? "").trim(),
      c: (c ?? "").trim(),
      d: rest.join("|").trim(),
    };
  });
}

export function splitParagraphs(value: unknown) {
  return String(value ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
