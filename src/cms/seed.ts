import liveSeed from "./live-seed.json";
import {
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_FAQ_CATEGORIES,
  DEFAULT_GRIEVANCE,
  DEFAULT_HOMEPAGE,
  DEFAULT_NAVIGATION,
  DEFAULT_PAYMENT_BANKING,
  DEFAULT_SETTINGS,
  type CmsData,
  type CmsRecord,
} from "./types";

/** Bump this after replacing live-seed.json so Postgres/memory stores reload the new copy. */
export const CMS_SEED_VERSION = 202609273;

function rec(collection: string, id: string, data: CmsData): CmsRecord {
  return {
    id,
    collection,
    data: { published: true, ...data },
    updatedAt: Date.now(),
  };
}

function asData(row: object): CmsData {
  return { ...(row as Record<string, string | number | boolean | null>) };
}

export function buildSeed(): CmsRecord[] {
  const items: CmsRecord[] = [
    rec("_meta", "seed", { version: CMS_SEED_VERSION, published: false }),
    rec("settings", "site", { ...DEFAULT_SETTINGS, ...asData(liveSeed.settings) }),
    rec("homepage", "homepage", { ...DEFAULT_HOMEPAGE, ...asData(liveSeed.homepage) }),
    rec("about", "about", { ...DEFAULT_ABOUT }),
    rec("contact", "contact", { ...DEFAULT_CONTACT }),
    rec("grievance", "grievance", { ...DEFAULT_GRIEVANCE }),
    rec("navigation", "navigation", { ...DEFAULT_NAVIGATION }),
    rec("faq-categories", "faq-categories", { ...DEFAULT_FAQ_CATEGORIES }),
    rec("payment-banking", "payment-banking", { ...DEFAULT_PAYMENT_BANKING }),
  ];

  for (const page of liveSeed.pages) {
    if (page.id === "about") continue;
    const { id, ...data } = page;
    items.push(rec("pages", id, asData(data)));
  }

  for (const service of liveSeed.services) {
    items.push(rec("services", service.slug, asData(service)));
  }

  for (const branch of liveSeed.branches) {
    items.push(
      rec(
        "branches",
        branch.slug,
        asData({ ...branch, staffPhotoUrl: "/uploads/branch-staff-default.jpg" }),
      ),
    );
  }

  for (const faq of liveSeed.faqs) {
    const { id, ...data } = faq;
    items.push(rec("faqs", id, asData(data)));
  }

  for (const download of liveSeed.downloads) {
    const { id, ...data } = download;
    const localFiles: Record<string, string> = {
      "individual-client-registration-form-kyc": "/uploads/kyc-individual.pdf",
      "individual-demat-registration-form": "/uploads/demat-form.pdf",
      "mero-share-form": "/uploads/meroshare-form.pdf",
      "online-agreement-form": "/uploads/agreement-45.pdf",
      "dis-slip": "/uploads/dis-slip.pdf",
      "drf-form": "/uploads/demat-drf.pdf",
      "institutional-demat-form": "/uploads/company-demat.pdf",
      "institutional-kyc": "/uploads/annex-13.pdf",
      "in-person-verification-form": "/uploads/in-person-verification.pdf",
      "buy-sell-order-slip": "/uploads/specimen.pdf",
      "margin-trading-guideline": "/uploads/margin-trading-guidelines.pdf",
      "cic-self-declaration-form": "/uploads/cic-self-declaration.pdf",
    };
    items.push(
      rec("downloads", id, asData({ ...data, file: localFiles[id] ?? `/uploads/${id}.pdf` })),
    );
  }

  for (const member of liveSeed.team) {
    const { id, ...data } = member;
    items.push(rec("team", id, asData(data)));
  }

  for (const item of liveSeed.news) {
    items.push(rec("news", item.slug, asData(item)));
  }

  for (const item of liveSeed.blog) {
    items.push(rec("blog", item.slug, asData(item)));
  }

  return items;
}
