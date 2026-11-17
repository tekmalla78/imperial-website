import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { getContactFn } from "@/cms/functions";
import { CONTACT_FIELDS } from "@/cms/singleton-fields";
import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import { SavedBanner } from "@/components/admin/AdminField";
import { z } from "zod";

export const Route = createFileRoute("/admin/contact")({
  validateSearch: z.object({ saved: z.coerce.string().optional() }),
  loader: () => getContactFn(),
  component: ContactEditor,
  head: () => ({
    meta: [{ title: "Contact page — Imperial Admin" }],
  }),
});

function ContactEditor() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const data = Route.useLoaderData();
  const { saved } = Route.useSearch();

  return (
    <AdminShell
      title="Contact page"
      subtitle="Hero and form intro on /contact. Phone, email, and hours still come from Company details."
      user={adminUser ?? ""}
      actions={
        <a href="/contact" className="text-sm font-medium text-brand-blue hover:underline">
          View Contact page
        </a>
      }
    >
      <SavedBanner show={saved === "1"} />
      <ItemForm
        collection="contact"
        id="contact"
        fields={CONTACT_FIELDS}
        initial={data}
        redirectTo="/admin/contact"
        publicPath="/contact"
      />
    </AdminShell>
  );
}
