import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSessionFn } from "@/cms/functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return { adminUser: null };
    const session = await getSessionFn();
    if (!session?.user) {
      throw redirect({
        to: "/admin/login",
        search: { next: location.pathname },
      });
    }
    return { adminUser: session.user };
  },
  component: AdminLayout,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Admin — Imperial Securities" },
    ],
  }),
});

function AdminLayout() {
  return <Outlet />;
}
