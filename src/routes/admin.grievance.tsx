import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { getGrievanceFn } from "@/cms/functions";
import { GRIEVANCE_FIELDS } from "@/cms/singleton-fields";
import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import { SavedBanner } from "@/components/admin/AdminField";
import { z } from "zod";

export const Route = createFileRoute("/admin/grievance")({
  validateSearch: z.object({ saved: z.coerce.string().optional() }),
  loader: () => getGrievanceFn(),
  component: GrievanceEditor,
  head: () => ({
    meta: [{ title: "Grievance page — Imperial Admin" }],
  }),
});

function GrievanceEditor() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const data = Route.useLoaderData();
  const { saved } = Route.useSearch();

  return (
    <AdminShell
      title="Grievance page"
      subtitle="Officer details, process steps, and copy on /grievance."
      user={adminUser ?? ""}
      actions={
        <a href="/grievance" className="text-sm font-medium text-brand-blue hover:underline">
          View Grievance page
        </a>
      }
    >
      <SavedBanner show={saved === "1"} />
      <ItemForm
        collection="grievance"
        id="grievance"
        fields={GRIEVANCE_FIELDS}
        initial={data}
        redirectTo="/admin/grievance"
        publicPath="/grievance"
      />
    </AdminShell>
  );
}
