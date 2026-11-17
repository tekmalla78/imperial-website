import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileText, Download, ClipboardList } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { loadPublished } from "@/cms/load-public";
import { seoMeta, str } from "@/cms/seo";

export const Route = createFileRoute("/downloads")({
  loader: async () => {
    const items = await loadPublished("downloads");
    const groups: { heading: string; description: string; forms: { title: string; file: string }[] }[] = [];
    const index = new Map<string, (typeof groups)[number]>();
    for (const item of items) {
      const heading = str(item.data.group, "Forms");
      if (!index.has(heading)) {
        const group = {
          heading,
          description: str(item.data.groupDescription),
          forms: [] as { title: string; file: string }[],
        };
        index.set(heading, group);
        groups.push(group);
      }
      index.get(heading)?.forms.push({
        title: str(item.data.title),
        file: str(item.data.file, "#"),
      });
    }
    return { groups };
  },
  component: DownloadsPage,
  head: () => ({
    meta: seoMeta(
      "Downloads — Forms & Documents | Imperial Securities",
      "Download KYC, Demat, Mero Share, and order slip forms required for trading with Imperial Securities.",
    ),
  }),
});

function DownloadsPage() {
  const { groups } = Route.useLoaderData();
  return (
    <PageShell>
      <PageHero
        eyebrow="Resources"
        title="Downloads & Forms"
        subtitle="All the forms you need to open an account, register for demat services, or place trade instructions."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Downloads" }]}
      />

      <section className="bg-muted/30 px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1100px]">
          

          <div className="space-y-14">
            {groups.map((group) => (
                <div key={group.heading}>
                  {/* Group header */}
                  <div className="mb-5 border-b-2 border-brand-blue/15 pb-3">
                    <h2 className="font-heading text-xl font-extrabold text-foreground sm:text-2xl">
                      {group.heading}
                    </h2>
                    <p className="mt-1 text-[13px] text-muted-foreground">{group.description}</p>
                  </div>

                  {/* Form rows */}
                  <ul className="space-y-3">
                    {group.forms.map((form, i) => (
                      <motion.li
                        key={form.title}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                      >
                        <a
                          href={form.file}
                          download
                          className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-border bg-white px-4 py-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-blue/50 hover:shadow-[0_14px_30px_-18px_rgba(21,87,192,.45)] sm:px-5 sm:py-4"
                        >
                          {/* PDF icon */}
                          <span className="relative flex h-11 w-9 items-center justify-center rounded-md bg-gradient-to-b from-brand-blue-lt to-white ring-1 ring-brand-blue/20">
                            <FileText className="h-5 w-5 text-brand-blue" />
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-sm bg-brand-blue px-1 text-[8.5px] font-bold leading-tight tracking-wide text-white">
                              PDF
                            </span>
                          </span>

                          {/* Title */}
                          <div className="min-w-0">
                            <h3 className="truncate font-heading text-[14.5px] font-semibold text-foreground sm:text-[15.5px]">
                              {form.title}
                            </h3>
                          </div>

                          {/* CTA */}
                          <span className="inline-flex items-center gap-2 rounded-lg border border-brand-blue/30 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-brand-blue transition-all group-hover:bg-gradient-to-br group-hover:from-brand-blue group-hover:to-brand-green-dk group-hover:text-white sm:px-4">
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Download</span>
                          </span>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          {/* Help CTA */}
          <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white to-brand-blue-lt/40 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-heading text-lg font-bold text-foreground">Need help filling these forms?</h4>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Bring a valid photo ID, PAN, citizenship certificate and a passport-size photo to any branch — our team will guide you end-to-end.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="/contact" className="rounded-lg bg-gradient-to-br from-brand-blue to-brand-green-dk px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5">
                  Contact Support
                </a>
                <a href="/faqs" className="rounded-lg border border-border bg-white px-5 py-2.5 text-[13.5px] font-semibold text-foreground transition-all hover:bg-muted">
                  Read FAQs
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
