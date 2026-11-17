import { motion, useReducedMotion } from "framer-motion";
import { REGISTRATION_URL } from "@/data/faqs";

const features = [
  { icon: "📱", title: "Trading App", desc: "Place orders and manage your portfolio on the go" },
  { icon: "⚡", title: "Instant Orders", desc: "One-tap buy/sell with instant confirmation" },
  { icon: "🔔", title: "Smart Alerts", desc: "Price and news alerts for your watchlist" },
  { icon: "🧾", title: "Digital Statements", desc: "View contract notes & portfolio reports" },
];

const MOTION_EASE = [0.16, 1, 0.3, 1] as const;

export default function DownloadSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-gradient-to-br from-brand-blue-dk via-brand-blue to-brand-green-dk px-4 py-14 sm:px-6 sm:py-[70px]">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: MOTION_EASE }}
        >
          <h2 className="mb-3 text-balance font-heading text-[clamp(24px,3vw,38px)] font-extrabold text-hero-fg">
            Trade NEPSE From Your Phone
          </h2>
          <p className="mb-7 text-pretty text-[15px] leading-[1.70] text-hero-fg-muted">
            Our mobile app is launching soon. Until then, open an account online and trade through our web client portal with instant order placement.
          </p>
          <div className="rounded-xl border border-hero-border bg-hero-surface/80 px-4 py-4">
            <p className="text-sm font-semibold text-hero-fg">Mobile app — coming soon</p>
            <p className="mt-1 text-xs leading-relaxed text-hero-fg-muted">
              App Store and Google Play links will be published here when the app is live.
            </p>
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-accent/50"
            >
              Open account online
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: reduceMotion ? 0 : 0.15,
            duration: reduceMotion ? 0 : 0.45,
            ease: MOTION_EASE,
          }}
          className="grid grid-cols-2 gap-3"
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-hero-border bg-hero-surface p-4"
            >
              <div className="mb-2 text-lg" aria-hidden>{f.icon}</div>
              <h5 className="mb-1 text-[13.5px] font-bold text-hero-fg">{f.title}</h5>
              <p className="text-pretty text-[12px] leading-relaxed text-hero-fg-muted">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
