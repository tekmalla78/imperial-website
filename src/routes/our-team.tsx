import { createFileRoute } from "@tanstack/react-router";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import { loadPublished } from "@/cms/load-public";
import { seoMeta, str } from "@/cms/seo";

const deptAccents = [
  "from-brand-blue to-brand-blue-dk",
  "from-brand-green-dk to-brand-green",
  "from-brand-blue-dk to-brand-green-dk",
  "from-brand-green to-brand-green-dk",
] as const;

export const Route = createFileRoute("/our-team")({
  loader: async () => {
    const items = await loadPublished("team");
    const departments: { name: string; members: { name: string; role: string; initials: string }[] }[] = [];
    const index = new Map<string, (typeof departments)[number]>();
    for (const item of items.filter((member) => str(member.data.group) === "staff")) {
      const name = str(item.data.dept, "Team");
      if (!index.has(name)) {
        const dept = { name, members: [] as { name: string; role: string; initials: string }[] };
        index.set(name, dept);
        departments.push(dept);
      }
      index.get(name)?.members.push({
        name: str(item.data.name),
        role: str(item.data.role),
        initials: str(item.data.name)
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2),
      });
    }
    return { departments };
  },
  component: OurTeamPage,
  head: () => ({
    meta: seoMeta("Our Team — Imperial Securities", "Meet the dedicated professionals behind Imperial Securities."),
  }),
});

function OurTeamPage() {
  const { departments } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHero
        title="Our Team"
        subtitle="The talented individuals who make Imperial Securities a success every day"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Our Team" }]}
      />

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:py-16">
        {departments.map((dept, di) => (
          <div key={dept.name} className="mb-12 last:mb-0">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div
                className={`h-1 w-8 rounded-full bg-gradient-to-r ${deptAccents[di % deptAccents.length]}`}
                aria-hidden
              />
              <h2 className="font-heading text-xl font-bold text-foreground">{dept.name}</h2>
              <span className="rounded-full bg-brand-blue-lt px-2.5 py-0.5 text-xs font-semibold text-brand-blue-dk">
                {dept.members.length} members
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {dept.members.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${deptAccents[di % deptAccents.length]} text-xs font-bold text-white`}
                  >
                    {m.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{m.name}</h4>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
