import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { getAboutFn } from "@/cms/functions";
import { ABOUT_FIELDS } from "@/cms/singleton-fields";
import { AdminShell } from "@/components/admin/AdminShell";
import { ItemForm } from "@/components/admin/ItemForm";
import { SavedBanner } from "@/components/admin/AdminField";
import { z } from "zod";

export const Route = createFileRoute("/admin/about")({
  validateSearch: z.object({ saved: z.coerce.string().optional() }),
  loader: () => getAboutFn(),
  component: AboutEditor,
  head: () => ({
    meta: [{ title: "About page — Imperial Admin" }],
  }),
});

function AboutEditor() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const data = Route.useLoaderData();
  const { saved } = Route.useSearch();

  return (
    <AdminShell
      title="About page"
      subtitle="Hero, foundation, timeline, board, regulation band, and bottom CTA on /about."
      user={adminUser ?? ""}
      actions={
        <a href="/about" className="text-sm font-medium text-brand-blue hover:underline">
          View About page
        </a>
      }
    >
      <SavedBanner show={saved === "1"} />
      <ItemForm
        collection="about"
        id="about"
        fields={ABOUT_FIELDS}
        initial={data}
        redirectTo="/admin/about"
        publicPath="/about"
      />
    </AdminShell>
  );
}
