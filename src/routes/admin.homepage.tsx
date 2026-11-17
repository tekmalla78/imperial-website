import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { getHomepageFn } from "@/cms/functions";
import { HOMEPAGE_FIELDS } from "@/cms/singleton-fields";
import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import { SavedBanner } from "@/components/admin/AdminField";
import { z } from "zod";

export const Route = createFileRoute("/admin/homepage")({
  validateSearch: z.object({ saved: z.coerce.string().optional() }),
  loader: () => getHomepageFn(),
  component: HomepageEditor,
  head: () => ({
    meta: [{ title: "Homepage — Imperial Admin" }],
  }),
});

function HomepageEditor() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const data = Route.useLoaderData();
  const { saved } = Route.useSearch();

  return (
    <AdminShell
      title="Homepage"
      subtitle="The first screen visitors see: headline, buttons, and trust numbers."
      user={adminUser ?? ""}
      actions={
        <a href="/" className="text-sm font-medium text-brand-blue hover:underline">
          View homepage
        </a>
      }
    >
      <SavedBanner show={saved === "1"} />
      <ItemForm
        collection="homepage"
        id="homepage"
        fields={HOMEPAGE_FIELDS}
        initial={data}
        redirectTo="/admin/homepage"
        publicPath="/"
      />
    </AdminShell>
  );
}
