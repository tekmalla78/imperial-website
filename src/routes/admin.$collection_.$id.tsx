import { createFileRoute, notFound, useRouteContext } from "@tanstack/react-router";
import { z } from "zod";
import { COLLECTIONS, resolvePublicPath, splitLines, toPlainCollection } from "@/cms/collections";
import { getFaqCategoriesFn, getItemFn } from "@/cms/functions";
import { DEFAULT_FAQ_CATEGORIES } from "@/cms/types";
import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import { SavedBanner } from "@/components/admin/AdminField";
import { DeleteItemButton } from "@/components/admin/DeleteItemButton";

export const Route = createFileRoute("/admin/$collection_/$id")({
  validateSearch: z.object({ saved: z.coerce.string().optional() }),
  loader: async ({ params }) => {
    const def = COLLECTIONS[params.collection];
    if (!def) throw notFound();
    const plain = toPlainCollection(def);
    plain.fields = plain.fields.map((field) => ({
      ...field,
      options: field.options ? [...field.options] : field.options,
    }));

    if (params.collection === "faqs") {
      const faqCategories = await getFaqCategoriesFn();
      const names = splitLines(faqCategories.categories ?? DEFAULT_FAQ_CATEGORIES.categories);
      const categoryField = plain.fields.find((field) => field.name === "category");
      if (categoryField) {
        categoryField.options = names.map((name) => ({ value: name, label: name }));
      }
    }

    if (params.id === "new") {
      return {
        def: plain,
        item: { id: "new", collection: params.collection, data: { published: true }, updatedAt: Date.now() },
        publicPath: null as string | null,
      };
    }
    const item = await getItemFn({ data: { collection: params.collection, id: params.id } });
    if (!item) throw notFound();

    if (params.collection === "faqs") {
      const categoryField = plain.fields.find((field) => field.name === "category");
      const current = String(item.data.category ?? "").trim();
      if (categoryField && current && !categoryField.options?.some((opt) => opt.value === current)) {
        categoryField.options = [
          ...(categoryField.options ?? []),
          { value: current, label: `${current} (not in category list)` },
        ];
      }
    }

    return {
      def: plain,
      item,
      publicPath: resolvePublicPath(params.collection, item.data),
    };
  },
  component: CollectionEditPage,
  head: ({ loaderData }) => ({
    meta: [{ title: `Edit ${loaderData?.def.singular ?? "item"} — Imperial Admin` }],
  }),
});

function CollectionEditPage() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const { collection, id } = Route.useParams();
  const { def, item, publicPath } = Route.useLoaderData();
  const { saved } = Route.useSearch();
  const title = id === "new" ? `Add ${def.singular}` : `Edit ${def.singular}`;

  return (
    <AdminShell
      title={title}
      subtitle={def.description}
      user={adminUser ?? ""}
      actions={
        id !== "new" ? <DeleteItemButton collection={collection} id={id} redirectTo={`/admin/${collection}`} /> : null
      }
    >
      <SavedBanner show={saved === "1"} />
      <ItemForm
        collection={collection}
        id={id}
        fields={def.fields}
        initial={item.data}
        redirectTo={`/admin/${collection}`}
        publicPath={publicPath}
      />
    </AdminShell>
  );
}
