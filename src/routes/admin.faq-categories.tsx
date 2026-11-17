import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { getFaqCategoriesFn } from "@/cms/functions";
import { FAQ_CATEGORIES_FIELDS } from "@/cms/singleton-fields";
import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import { SavedBanner } from "@/components/admin/AdminField";
import { z } from "zod";

export const Route = createFileRoute("/admin/faq-categories")({
  validateSearch: z.object({ saved: z.coerce.string().optional() }),
  loader: () => getFaqCategoriesFn(),
  component: FaqCategoriesEditor,
  head: () => ({
    meta: [{ title: "FAQ categories — Imperial Admin" }],
  }),
});

function FaqCategoriesEditor() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const data = Route.useLoaderData();
  const { saved } = Route.useSearch();

  return (
    <AdminShell
      title="FAQ categories"
      subtitle="Names and order for FAQ groups on /faqs. Assign each question to a category when editing FAQs."
      user={adminUser ?? ""}
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <a href="/admin/faqs" className="text-sm font-medium text-brand-blue hover:underline">
            Edit FAQs
          </a>
          <a href="/faqs" className="text-sm font-medium text-brand-blue hover:underline">
            View FAQs page
          </a>
        </div>
      }
    >
      <SavedBanner show={saved === "1"} />
      <ItemForm
        collection="faq-categories"
        id="faq-categories"
        fields={FAQ_CATEGORIES_FIELDS}
        initial={data}
        redirectTo="/admin/faq-categories"
        publicPath="/faqs"
      />
    </AdminShell>
  );
}
