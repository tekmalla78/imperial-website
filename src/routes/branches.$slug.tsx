import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight, Navigation } from "lucide-react";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import teamPhoto from "../assets/branch-team.jpg";
import { loadPublished, loadPublishedBySlug } from "@/cms/load-public";
import liveSeed from "@/cms/live-seed.json";

interface BranchDetail {
  slug: string;
  name: string;
  city: string;
  addr: string;
  phone: string;
  email: string;
  hours: string;
  mapsQuery: string;
  description: string;
  manager: string;
  established: string;
  staffPhotoUrl: string;
}

const branchDetails: Record<string, BranchDetail> = Object.fromEntries(
  liveSeed.branches.map((branch) => [branch.slug, { ...branch, staffPhotoUrl: "" }]),
);

export const Route = createFileRoute("/branches/$slug")({
  loader: async ({ params }) => {
    const record = await loadPublishedBySlug("branches", params.slug);
    const others = await loadPublished("branches");
    const fallback = branchDetails[params.slug];
    const data = record?.data;
    const branch: BranchDetail | undefined = data
      ? {
          slug: String(data.slug ?? record.id),
          name: String(data.name ?? ""),
          city: String(data.city ?? ""),
          addr: String(data.addr ?? ""),
          phone: String(data.phone ?? ""),
          email: String(data.email ?? ""),
          hours: String(data.hours ?? ""),
          mapsQuery: String(data.mapsQuery ?? ""),
          description: String(data.description ?? ""),
          manager: String(data.manager ?? ""),
          established: String(data.established ?? ""),
          staffPhotoUrl: String(data.staffPhotoUrl ?? ""),
        }
      : fallback;
    if (!branch) throw notFound();
    return {
      branch,
      others: others
        .filter((item) => String(item.data.slug ?? item.id) !== branch.slug)
        .slice(0, 3)
        .map((item) => ({
          slug: String(item.data.slug ?? item.id),
          name: String(item.data.name ?? ""),
          addr: String(item.data.addr ?? ""),
          phone: String(item.data.phone ?? ""),
        })),
    };
  },
  head: ({ loaderData }) => {
    const b = loaderData?.branch;
    return {
      meta: [
        { title: `${b?.name ?? "Branch"} — Imperial Securities` },
        { name: "description", content: b?.description ?? "Visit our branch office for in-person support." },
        { property: "og:title", content: `${b?.name ?? "Branch"} — Imperial Securities` },
        { property: "og:description", content: b?.description ?? "Visit our branch office for in-person support." },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-[800px] px-6 py-32 text-center">
        <h1 className="font-heading text-4xl font-extrabold">Branch not found</h1>
        <p className="mt-4 text-brand-gray">We couldn't find that branch.</p>
        <Link to="/" hash="branches" className="mt-6 inline-block rounded-full bg-brand-blue px-6 py-3 font-semibold text-white">
          See all branches
        </Link>
      </div>
    </PageShell>
  ),
  component: BranchPage,
});

function BranchPage() {
  const { branch, others } = Route.useLoaderData();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${branch.mapsQuery}`;
  const embedUrl = `https://www.google.com/maps?q=${branch.mapsQuery}&output=embed`;

  return (
    <PageShell>
      <PageHero
        eyebrow="Our Branch"
        title={branch.name}
        subtitle={branch.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Branches", href: "/contact" },
          { label: branch.city },
        ]}
      />

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, label: "Address", value: branch.addr },
              { icon: Phone, label: "Phone", value: branch.phone },
              { icon: Mail, label: "Email", value: branch.email },
              { icon: Clock, label: "Office Hours", value: branch.hours },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border bg-card p-6 transition-all hover:border-brand-blue hover:shadow-[0_4px_24px_rgba(21,87,192,.08)]"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-gray">{item.label}</div>
                  <div className="mt-1 text-[14px] font-semibold text-foreground">{item.value}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dk"
            >
              <Navigation className="h-4 w-4" /> Get Directions
            </a>
            <a
              href={`tel:${branch.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground transition hover:border-brand-blue hover:text-brand-blue"
            >
              <Phone className="h-4 w-4" /> Call Branch
            </a>
          </div>
        </div>
      </section>

      <section className="bg-brand-gray-lt px-6 py-20">
        <div className="mx-auto max-w-[1280px]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 max-w-[640px]">
            <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[2px] text-brand-blue">Meet The Team</div>
            <h2 className="mb-3 font-heading text-[clamp(24px,3vw,38px)] font-extrabold leading-[1.2] text-foreground">
              {branch.city} Branch Staff
            </h2>
            <p className="text-[15.5px] leading-[1.72] text-brand-gray">
              Led by <span className="font-semibold text-foreground">{branch.manager}</span>, our {branch.city} team has been serving local investors since {branch.established}.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_10px_40px_rgba(0,0,0,.06)]"
          >
            <img
              src={branch.staffPhotoUrl || teamPhoto}
              alt={`Imperial Securities ${branch.city} branch staff group photo`}
              loading="lazy"
              width={1280}
              height={768}
              className="h-auto w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[2px] text-brand-blue">Get In Touch</div>
              <h2 className="mb-3 font-heading text-[clamp(24px,3vw,38px)] font-extrabold leading-[1.2] text-foreground">
                Contact our {branch.city} branch
              </h2>
              <p className="mb-6 text-[15.5px] leading-[1.72] text-brand-gray">
                Have a question or want to open an account? Send us a message and the {branch.city} team will get back within one business day.
              </p>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you! We'll get back to you shortly.");
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required placeholder="Full Name" className="h-12 rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-brand-blue" />
                  <input required type="tel" placeholder="Phone Number" className="h-12 rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-brand-blue" />
                </div>
                <input required type="email" placeholder="Email Address" className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-brand-blue" />
                <input placeholder="Subject" className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm outline-none transition focus:border-brand-blue" />
                <textarea required rows={5} placeholder="Your message..." className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-blue" />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dk"
                >
                  Send Message <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_10px_40px_rgba(0,0,0,.06)]">
                <iframe
                  title={`${branch.city} branch location`}
                  src={embedUrl}
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-brand-gray-lt px-6 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[2px] text-brand-blue">Nationwide</div>
              <h2 className="font-heading text-[clamp(22px,2.5vw,32px)] font-extrabold leading-[1.2] text-foreground">Other Branches</h2>
            </div>
            <Link to="/" hash="branches" className="hidden text-sm font-semibold text-brand-blue hover:underline sm:inline">
              View all →
            </Link>
          </div>

          <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
            {others.map((b) => (
              <Link
                key={b.slug}
                to="/branches/$slug"
                params={{ slug: b.slug }}
                className="group block rounded-lg border-[1.5px] border-border bg-white p-5 transition-all hover:border-brand-blue hover:shadow-[0_4px_24px_rgba(21,87,192,.10)]"
              >
                <h4 className="mb-1.5 text-[14.5px] font-bold text-foreground">{b.name}</h4>
                <p className="text-[12.5px] leading-relaxed text-brand-gray">
                  {b.addr}
                  <br />
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3 shrink-0 text-brand-gray" strokeWidth={2} />
                    {b.phone}
                  </span>
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-blue">
                  View Branch <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
