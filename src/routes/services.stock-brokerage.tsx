import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Shield, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import PageShell from "../components/PageShell";
import PageHero from "../components/PageHero";
import { loadService } from "@/cms/load-public";
import { seoMeta } from "@/cms/seo";

export const Route = createFileRoute("/services/stock-brokerage")({
  loader: () => loadService("stock-brokerage"),
  component: StockBrokeragePage,
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.seoTitle || "Stock Brokerage — Imperial Securities",
      loaderData?.seoDescription ||
        "Trade NEPSE-listed equities with real-time order execution, competitive brokerage rates, and instant trade confirmation.",
    ),
  }),
});

const features = [
  { icon: Zap, title: "Real-Time Execution", desc: "Sub-second order routing directly to NEPSE TMS with live confirmation." },
  { icon: BarChart3, title: "Competitive Rates", desc: "Transparent brokerage tiers — the more you trade, the less you pay." },
  { icon: Shield, title: "SEBON Regulated", desc: "Licensed broker #45 — your trades are fully compliant and protected." },
  { icon: TrendingUp, title: "Advanced Order Types", desc: "Limit, market, stop-loss, and after-market orders for every strategy." },
];

const benefits = [
  "Zero account opening fees",
  "Dedicated relationship manager",
  "Mobile & web trading platforms",
  "Daily contract notes via email",
  "Live NEPSE depth and ticker",
  "Same-day settlement support",
];

function StockBrokeragePage() {
  const cms = Route.useLoaderData();
  const displayFeatures = cms?.features.length
    ? cms.features.map((item, i) => ({
        icon: features[i]?.icon ?? Zap,
        title: item.title,
        desc: item.desc,
      }))
    : features;
  const displayBenefits = cms?.benefits.length ? cms.benefits : benefits;

  return (
    <PageShell>
      <PageHero
        title={cms?.title || "Stock Brokerage"}
        subtitle={cms?.subtitle || "Execute buy and sell orders on NEPSE with real-time market access, competitive brokerage rates, and instant trade confirmation."}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }, { label: cms?.title || "Stock Brokerage" }]}
      />

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-[0_8px_30px_rgba(21,87,192,.10)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue-lt">
                  <f.icon className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="mb-2 text-[16px] font-bold text-foreground">{f.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-brand-gray">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[2px] text-brand-blue">Why Choose Us</div>
            <h2 className="mb-4 font-heading text-[clamp(24px,3vw,38px)] font-extrabold leading-[1.2]">Trade smarter with Nepal's trusted broker</h2>
            <p className="mb-6 text-[15px] leading-[1.72] text-brand-gray">
              {cms?.description ||
                "Imperial Securities is a licensed brokerage firm and NEPSE member, executing buy and sell orders for clients on published commission scales."}
            </p>
            <ul className="space-y-3">
              {displayBenefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-[14px] text-foreground">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green-dk" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-white p-8 shadow-[0_12px_40px_rgba(21,87,192,.10)]">
            <h3 className="mb-1 font-heading text-xl font-extrabold">Brokerage Tariff (Equity)</h3>
            <p className="mb-6 text-[13px] text-brand-gray">As per SEBON-approved scale</p>
            <div className="space-y-3">
              {[
                { range: "Up to NPR 50,000", rate: "0.40%" },
                { range: "NPR 50,001 – 5,00,000", rate: "0.37%" },
                { range: "NPR 5,00,001 – 20,00,000", rate: "0.34%" },
                { range: "NPR 20,00,001 – 1,00,00,000", rate: "0.30%" },
                { range: "Above NPR 1,00,00,000", rate: "0.27%" },
              ].map((t) => (
                <div key={t.range} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                  <span className="text-[13.5px] text-foreground">{t.range}</span>
                  <span className="text-[14px] font-bold text-brand-blue">{t.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </PageShell>
  );
}

function CTABanner() {
  return (
    <section className="bg-gradient-to-br from-brand-blue to-brand-green-dk px-6 py-16 text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div>
          <h2 className="font-heading text-2xl font-extrabold md:text-3xl">Ready to start trading?</h2>
          <p className="mt-2 text-white/80">Open a brokerage account in minutes — fully online.</p>
        </div>
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-[14px] font-semibold text-brand-blue transition-all hover:-translate-y-0.5">
          Get Started <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
