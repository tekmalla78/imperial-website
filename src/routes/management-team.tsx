import { createFileRoute } from "@tanstack/react-router";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import { Mail, Phone, Linkedin } from "lucide-react";
import sunilImg from "../assets/team/sunil-maharjan.png";
import deepakImg from "../assets/team/deepak-adhikari.png";
import meenaImg from "../assets/team/meena-rai.png";
import kiranImg from "../assets/team/kiran-pandey.png";
import nishaImg from "../assets/team/nisha-gurung.png";
import hariImg from "../assets/team/hari-bahadur.png";
import { loadPublished } from "@/cms/load-public";
import { seoMeta, str } from "@/cms/seo";
import { slugify } from "@/cms/collections";

const PHOTOS: Record<string, string> = {
  "sunil-maharjan": sunilImg,
  "deepak-adhikari": deepakImg,
  "meena-rai": meenaImg,
  "kiran-pandey": kiranImg,
  "nisha-gurung": nishaImg,
  "hari-bahadur": hariImg,
};

export const Route = createFileRoute("/management-team")({
  loader: async () => {
    const items = await loadPublished("team");
    return {
      team: items
        .filter((item) => str(item.data.group, "management") === "management")
        .map((item) => ({
          name: str(item.data.name),
          role: str(item.data.role),
          dept: str(item.data.dept),
          desc: str(item.data.desc),
          email: str(item.data.email),
          phone: str(item.data.phone),
          linkedin: str(item.data.linkedin),
          img: str(item.data.photo) || PHOTOS[slugify(str(item.data.name))],
          initials: str(item.data.name)
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2),
        })),
    };
  },
  component: ManagementTeamPage,
  head: () => ({
    meta: seoMeta(
      "Management Team — Imperial Securities",
      "Meet the management team driving daily operations at Imperial Securities.",
    ),
  }),
});

function ManagementTeamPage() {
  const { team } = Route.useLoaderData();
  return (
    <PageShell>
      <PageHero
        title="Management Team"
        subtitle="Dedicated professionals driving excellence in every aspect of our operations"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Management Team" }]}
      />

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {team.map((m) => (
            <div
              key={m.name}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Square photo — aspect-square matches card width */}
              <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-brand-blue/10 to-brand-green/10">
                {m.img ? (
                  <img
                    src={m.img}
                    alt={m.name}
                    className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-heading text-4xl font-bold text-brand-blue">
                    {m.initials}
                  </div>
                )}

                {/* Dept badge — top-left */}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-sm backdrop-blur-sm">
                  {m.dept}
                </span>

                {m.linkedin ? (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-lg bg-white/90 text-brand-blue shadow-sm transition-colors hover:bg-brand-blue hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                ) : null}
              </div>

              {/* Info */}
              <div className="px-4 pb-4 pt-3">
                <h3 className="font-heading text-sm font-bold text-foreground">{m.name}</h3>
                <p className="text-[11px] font-semibold text-brand-blue">{m.role}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.desc}</p>

                {/* Contact — icon-only buttons in one row, full text in tooltip */}
                <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                  {m.email ? (
                    <a
                      href={`mailto:${m.email}`}
                      title={m.email}
                      aria-label={`Email ${m.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue-lt text-brand-blue transition-colors hover:bg-brand-blue hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  {m.phone ? (
                    <a
                      href={`tel:${m.phone.replace(/\s/g, "")}`}
                      title={m.phone}
                      aria-label={`Call ${m.name}`}
                      className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue-lt text-brand-blue transition-colors hover:bg-brand-blue hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  {m.linkedin ? (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn Profile"
                      aria-label={`${m.name} on LinkedIn`}
                      className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue-lt text-brand-blue transition-colors hover:bg-brand-blue hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}