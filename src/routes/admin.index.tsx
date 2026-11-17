import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { dashboardFn } from "@/cms/functions";
import { COLLECTIONS, NAV_GROUPS } from "@/cms/collections";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/")({
  loader: () => dashboardFn(),
  component: DashboardPage,
  head: () => ({
    meta: [{ title: "Dashboard — Imperial Admin" }],
  }),
});

function DashboardPage() {
  const { adminUser } = useRouteContext({ from: "/admin" });
  const { counts } = Route.useLoaderData();

  return (
    <AdminShell
      title="What do you want to change?"
      subtitle="Pick a section. Saved text appears on the public site after reload."
      user={adminUser ?? ""}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {NAV_GROUPS.flatMap((group) => [...group.items])
          .filter((item) => item.to !== "/admin")
          .map((item) => {
            const id = item.to.replace("/admin/", "");
            const count = counts[id];
            const def = COLLECTIONS[id];
            return (
              <a
                key={item.to}
                href={item.to}
                className="rounded-xl border border-border bg-white p-5 hover:border-brand-blue hover:shadow-sm"
              >
                <p className="font-semibold">{item.label}</p>
                <p className="mt-1 text-sm text-brand-gray">
                  {def?.description ?? "Company and search details used across the site."}
                </p>
                {typeof count === "number" ? (
                  <p className="mt-3 text-xs font-medium text-brand-blue">{count} items</p>
                ) : null}
              </a>
            );
          })}
      </div>
    </AdminShell>
  );
}
