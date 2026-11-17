import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import { COLLECTIONS, slugify } from "./collections";
import {
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_FAQ_CATEGORIES,
  DEFAULT_GRIEVANCE,
  DEFAULT_HOMEPAGE,
  DEFAULT_NAVIGATION,
  DEFAULT_PAYMENT_BANKING,
  DEFAULT_SETTINGS,
} from "./types";

export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminUser } = await import("./auth.server");
  const user = await getAdminUser();
  return user ? { user } : null;
});

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      username: z.string().min(1),
      password: z.string().min(1),
      next: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { checkLoginRateLimit, createLoginSession, verifyCredentials } = await import("./auth.server");
    const { getCmsEnv } = await import("./env.server");
    const limit = checkLoginRateLimit();
    if (!limit.ok) {
      return { error: `Too many attempts. Try again in ${limit.retryMin} minutes.` };
    }
    const env = await getCmsEnv();
    if (!env.adminPassword) {
      return { error: "Admin login is not configured on this server." };
    }
    const ok = await verifyCredentials(data.username, data.password);
    if (!ok) return { error: "Those details did not match. Check the username and password." };
    await createLoginSession(data.username.trim());
    const next = data.next?.startsWith("/admin") ? data.next : "/admin";
    // Return next so the client can navigate after the session cookie is set.
    // Throwing redirect alone often leaves the login form stuck / erroring in Start.
    return { ok: true as const, next };
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const { destroyLoginSession } = await import("./auth.server");
  await destroyLoginSession();
  throw redirect({ href: "/admin/login" });
});

export const getSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecord } = await import("./store.server");
  const record = await getRecord("settings", "site");
  return { ...DEFAULT_SETTINGS, ...(record?.data ?? {}) } as typeof DEFAULT_SETTINGS;
});

export const getHomepageFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecord } = await import("./store.server");
  const record = await getRecord("homepage", "homepage");
  return { ...DEFAULT_HOMEPAGE, ...(record?.data ?? {}) } as typeof DEFAULT_HOMEPAGE;
});

export const getAboutFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecord } = await import("./store.server");
  const record = await getRecord("about", "about");
  return { ...DEFAULT_ABOUT, ...(record?.data ?? {}) } as typeof DEFAULT_ABOUT;
});

export const getContactFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecord } = await import("./store.server");
  const record = await getRecord("contact", "contact");
  return { ...DEFAULT_CONTACT, ...(record?.data ?? {}) } as typeof DEFAULT_CONTACT;
});

export const getGrievanceFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecord } = await import("./store.server");
  const record = await getRecord("grievance", "grievance");
  return { ...DEFAULT_GRIEVANCE, ...(record?.data ?? {}) } as typeof DEFAULT_GRIEVANCE;
});

export const getNavigationFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecord } = await import("./store.server");
  const record = await getRecord("navigation", "navigation");
  return { ...DEFAULT_NAVIGATION, ...(record?.data ?? {}) } as typeof DEFAULT_NAVIGATION;
});

export const getFaqCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecord } = await import("./store.server");
  const record = await getRecord("faq-categories", "faq-categories");
  return {
    ...DEFAULT_FAQ_CATEGORIES,
    ...(record?.data ?? {}),
  } as typeof DEFAULT_FAQ_CATEGORIES;
});

export const getPaymentBankingFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecord } = await import("./store.server");
  const record = await getRecord("payment-banking", "payment-banking");
  return {
    ...DEFAULT_PAYMENT_BANKING,
    ...(record?.data ?? {}),
  } as typeof DEFAULT_PAYMENT_BANKING;
});

export const uploadMediaFn = createServerFn({ method: "POST" })
  .inputValidator((input: FormData) => {
    if (!(input instanceof FormData)) throw new Error("Expected form data");
    return input;
  })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./auth.server");
    const { saveUploadedFile } = await import("./media.server");
    await requireAdmin();
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Choose a file to upload.");
    const kind = data.get("kind") === "image" ? "image" : "file";
    return saveUploadedFile(file, kind);
  });

export const getSiteChromeFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecord, listPublished } = await import("./store.server");
  const [settings, branches, navigation] = await Promise.all([
    getRecord("settings", "site"),
    listPublished("branches"),
    getRecord("navigation", "navigation"),
  ]);
  return {
    settings: { ...DEFAULT_SETTINGS, ...(settings?.data ?? {}) } as typeof DEFAULT_SETTINGS,
    navigation: { ...DEFAULT_NAVIGATION, ...(navigation?.data ?? {}) } as typeof DEFAULT_NAVIGATION,
    branches: branches.map((item) => ({
      slug: String(item.data.slug ?? item.id),
      name: String(item.data.name ?? ""),
      addr: String(item.data.addr ?? ""),
      phone: String(item.data.phone ?? ""),
    })),
  };
});

export const dashboardFn = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./auth.server");
  const { collectionCounts } = await import("./store.server");
  await requireAdmin();
  const counts = await collectionCounts();
  return { counts };
});

export const listItemsFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ collection: z.string(), publishedOnly: z.boolean().optional() }))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./auth.server");
    const { listPublished, listRecords } = await import("./store.server");
    if (data.publishedOnly) return listPublished(data.collection);
    await requireAdmin();
    return listRecords(data.collection);
  });

export const getItemFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ collection: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./auth.server");
    const { getRecord } = await import("./store.server");
    await requireAdmin();
    return getRecord(data.collection, data.id);
  });

export const getPublicItemFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ collection: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    const { getRecord, isPublished, listPublished } = await import("./store.server");
    const direct = await getRecord(data.collection, data.id);
    if (direct && isPublished(direct.data)) return direct;
    const items = await listPublished(data.collection);
    return items.find((item) => item.id === data.id || String(item.data.slug ?? "") === data.id) ?? null;
  });

export const saveItemFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      collection: z.string(),
      id: z.string().optional(),
      data: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])),
    }),
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./auth.server");
    const { upsertRecord } = await import("./store.server");
    await requireAdmin();
    if (data.collection === "settings") {
      return upsertRecord({
        id: "site",
        collection: "settings",
        data: { ...DEFAULT_SETTINGS, ...data.data, published: true },
        updatedAt: Date.now(),
      });
    }
    if (data.collection === "homepage") {
      return upsertRecord({
        id: "homepage",
        collection: "homepage",
        data: { ...DEFAULT_HOMEPAGE, ...data.data, published: true },
        updatedAt: Date.now(),
      });
    }
    if (data.collection === "about") {
      return upsertRecord({
        id: "about",
        collection: "about",
        data: { ...DEFAULT_ABOUT, ...data.data, published: true },
        updatedAt: Date.now(),
      });
    }
    if (data.collection === "contact") {
      return upsertRecord({
        id: "contact",
        collection: "contact",
        data: { ...DEFAULT_CONTACT, ...data.data, published: true },
        updatedAt: Date.now(),
      });
    }
    if (data.collection === "grievance") {
      return upsertRecord({
        id: "grievance",
        collection: "grievance",
        data: { ...DEFAULT_GRIEVANCE, ...data.data, published: true },
        updatedAt: Date.now(),
      });
    }
    if (data.collection === "navigation") {
      return upsertRecord({
        id: "navigation",
        collection: "navigation",
        data: { ...DEFAULT_NAVIGATION, ...data.data, published: true },
        updatedAt: Date.now(),
      });
    }
    if (data.collection === "faq-categories") {
      return upsertRecord({
        id: "faq-categories",
        collection: "faq-categories",
        data: { ...DEFAULT_FAQ_CATEGORIES, ...data.data, published: true },
        updatedAt: Date.now(),
      });
    }
    if (data.collection === "payment-banking") {
      return upsertRecord({
        id: "payment-banking",
        collection: "payment-banking",
        data: { ...DEFAULT_PAYMENT_BANKING, ...data.data, published: true },
        updatedAt: Date.now(),
      });
    }
    const def = COLLECTIONS[data.collection];
    if (!def) throw new Error("Unknown section");
    const payload = { ...data.data };
    if (payload.published === "on") payload.published = true;
    if (payload.published === "" || payload.published === "false") payload.published = false;
    if (typeof payload.published === "undefined") payload.published = true;
    const title = String(payload[def.titleField] ?? payload.title ?? "item");
    if (!payload.slug && def.fields.some((field) => field.name === "slug")) {
      payload.slug = slugify(title);
    }
    const id =
      data.id && data.id !== "new"
        ? data.id
        : String(payload.slug || slugify(title) || crypto.randomUUID());
    return upsertRecord({
      id,
      collection: data.collection,
      data: payload,
      updatedAt: Date.now(),
    });
  });

export const deleteItemFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ collection: z.string(), id: z.string() }))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./auth.server");
    const { deleteRecord } = await import("./store.server");
    await requireAdmin();
    await deleteRecord(data.collection, data.id);
    return { ok: true };
  });

export const publicBootFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getRecord, listPublished } = await import("./store.server");
  const [settings, homepage, paymentBanking, posts, news, events, branches] = await Promise.all([
    getRecord("settings", "site"),
    getRecord("homepage", "homepage"),
    getRecord("payment-banking", "payment-banking"),
    listPublished("blog"),
    listPublished("news"),
    listPublished("events"),
    listPublished("branches"),
  ]);
  return {
    settings: { ...DEFAULT_SETTINGS, ...(settings?.data ?? {}) } as typeof DEFAULT_SETTINGS,
    homepage: { ...DEFAULT_HOMEPAGE, ...(homepage?.data ?? {}) } as typeof DEFAULT_HOMEPAGE,
    paymentBanking: {
      ...DEFAULT_PAYMENT_BANKING,
      ...(paymentBanking?.data ?? {}),
    } as typeof DEFAULT_PAYMENT_BANKING,
    posts,
    news,
    events,
    branches,
  };
});

export const sitemapDataFn = createServerFn({ method: "GET" }).handler(async () => {
  const { listPublished } = await import("./store.server");
  const [pages, posts, news, branches, services] = await Promise.all([
    listPublished("pages"),
    listPublished("blog"),
    listPublished("news"),
    listPublished("branches"),
    listPublished("services"),
  ]);
  return { pages, posts, news, branches, services };
});
