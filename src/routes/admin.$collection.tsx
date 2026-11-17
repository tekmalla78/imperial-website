import { createFileRoute, notFound, useRouteContext } from "@tanstack/react-router";
import { z } from "zod";
import { COLLECTIONS, toPlainCollection } from "@/cms/collections";
import { listItemsFn } from "@/cms/functions";
import { AdminShell } from "@/components/admin/AdminShell";
import { SavedBanner } from "@/components/admin/AdminField";

export const Route = createFileRoute("/admin/$collection")({
  validateSearch: z.object({
    q: z.string().optional(),
    saved: z.coerce.string().optional(),
  }),
  loader: async ({ params }) => {
    const def = COLLECTIONS[params.collection];
    if (!def) throw notFound();
    const items = await listItemsFn({ data: { collection: params.collection } });
    return { def: toPlainCollection(def), items };
  },
  component: CollectionListPage,
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.def.label ?? "Content"} — Imperial Admin` }],
  }),
});

function CollectionListPage() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const { collection } = Route.useParams();
  const { def, items } = Route.useLoaderData();
  const { q = "", saved } = Route.useSearch();
  const query = q.trim().toLowerCase();
  const filtered = query
    ? items.filter((item) => JSON.stringify(item.data).toLowerCase().includes(query))
    : items;

  return (
    <AdminShell
      title={def.label}
      subtitle={def.description}
      user={adminUser ?? ""}
      actions={
        <div className="flex flex-wrap items-center gap-3">
          {collection === "faqs" ? (
            <a
              href="/admin/faq-categories"
              className="inline-flex min-h-11 items-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-brand-blue hover:border-brand-blue"
            >
              Edit categories
            </a>
          ) : null}
          <a
            href={`/admin/${collection}/new`}
            className="inline-flex min-h-11 items-center rounded-xl bg-brand-green px-4 text-sm font-semibold text-white hover:bg-brand-green-dk"
          >
            Add {def.singular}
          </a>
        </div>
      }
    >
      <SavedBanner show={saved === "1"} />
      <form className="mb-5" method="get">
        <label htmlFor="q" className="sr-only">
          Search {def.label}
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder={`Search ${def.label.toLowerCase()}…`}
          className="h-11 w-full max-w-md rounded-md border border-input bg-white px-3 text-sm"
        />
      </form>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white px-5 py-12 text-center">
          <p className="font-medium">Nothing here yet</p>
          <p className="mt-1 text-sm text-brand-gray">Add your first {def.singular} to show it on the site.</p>
          <a href={`/admin/${collection}/new`} className="mt-4 inline-block text-sm font-semibold text-brand-blue hover:underline">
            Add {def.singular}
          </a>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white">
          {filtered.map((item) => {
            const title = String(item.data[def.titleField] ?? item.id);
            const published = item.data.published !== false && item.data.published !== "false";
            const category =
              collection === "faqs" && item.data.category
                ? String(item.data.category)
                : null;
            return (
              <li key={item.id}>
                <a
                  href={`/admin/${collection}/${item.id}`}
                  className="flex min-h-14 items-center justify-between gap-4 px-4 py-3 hover:bg-[oklch(0.97_0.005_260)]"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{title}</span>
                    <span className="text-xs text-brand-gray">
                      {category ? `${category} · ` : null}
                      {published ? "Live on the site" : "Draft — hidden from the public site"}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-brand-blue">Edit</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}
