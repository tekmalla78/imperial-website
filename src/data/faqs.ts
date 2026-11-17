import liveSeed from "@/cms/live-seed.json";
import { slugify } from "@/cms/collections";

export const REGISTRATION_URL =
  "https://ckyc.imperialsecurities.com.np/auth/type-selection";

export type FaqLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type Faq = {
  id: string;
  q: string;
  a: string;
  links?: FaqLink[];
};

export type FaqCategory = {
  id: string;
  name: string;
  faqs: Faq[];
};

export const faqCategories: FaqCategory[] = (() => {
  const categories: FaqCategory[] = [];
  const index = new Map<string, FaqCategory>();
  for (const item of liveSeed.faqs) {
    if (!index.has(item.category)) {
      const cat: FaqCategory = { id: slugify(item.category), name: item.category, faqs: [] };
      index.set(item.category, cat);
      categories.push(cat);
    }
    index.get(item.category)?.faqs.push({
      id: item.id,
      q: item.question,
      a: item.answer,
    });
  }
  return categories;
})();
