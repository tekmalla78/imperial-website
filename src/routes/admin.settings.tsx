import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { getSettingsFn } from "@/cms/functions";
import { SETTINGS_FIELDS } from "@/cms/singleton-fields";
import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import { SavedBanner } from "@/components/admin/AdminField";
import { z } from "zod";

export const Route = createFileRoute("/admin/settings")({
  validateSearch: z.object({ saved: z.coerce.string().optional() }),
  loader: () => getSettingsFn(),
  component: SettingsPage,
  head: () => ({
    meta: [{ title: "Company details — Imperial Admin" }],
  }),
});

function SettingsPage() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const data = Route.useLoaderData();
  const { saved } = Route.useSearch();

  return (
    <AdminShell
      title="Company details"
      subtitle="Phone, email, hours, and login links used in the header and footer."
      user={adminUser ?? ""}
    >
      <SavedBanner show={saved === "1"} />
      <ItemForm
        collection="settings"
        id="site"
        fields={SETTINGS_FIELDS}
        initial={data}
        redirectTo="/admin/settings"
      />
    </AdminShell>
  );
}
