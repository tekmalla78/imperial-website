import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { getNavigationFn } from "@/cms/functions";
import { NAVIGATION_FIELDS } from "@/cms/singleton-fields";
import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import { SavedBanner } from "@/components/admin/AdminField";
import { z } from "zod";

export const Route = createFileRoute("/admin/navigation")({
  validateSearch: z.object({ saved: z.coerce.string().optional() }),
  loader: () => getNavigationFn(),
  component: NavigationEditor,
  head: () => ({
    meta: [{ title: "Navigation — Imperial Admin" }],
  }),
});

function NavigationEditor() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const data = Route.useLoaderData();
  const { saved } = Route.useSearch();

  return (
    <AdminShell
      title="Navigation"
      subtitle="Header menus, optional custom menus with subpages, plus footer Company, Useful, Legal, and Social links. Quick Links in the footer use Company details URLs. Branch and Tools stay automatic."
      user={adminUser ?? ""}
      actions={
        <a href="/" className="text-sm font-medium text-brand-blue hover:underline">
          View site
        </a>
      }
    >
      <SavedBanner show={saved === "1"} />
      <ItemForm
        collection="navigation"
        id="navigation"
        fields={NAVIGATION_FIELDS}
        initial={data}
        redirectTo="/admin/navigation"
        publicPath="/"
      />
    </AdminShell>
  );
}
