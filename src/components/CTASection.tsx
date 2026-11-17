import {
  UserPlus,
  FileText,
  ShieldCheck,
  Wallet,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const REGISTRATION_URL = "https://ckyc.imperialsecurities.com.np/auth/type-selection";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up Online",
    desc: "Register with your mobile number and email. No branch visit required.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Upload KYC Documents",
    desc: "Submit citizenship, PAN, photo, and signature digitally through the portal.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "e-KYC Verification",
    desc: "Complete video KYC from home. Verified during business hours.",
  },
  {
    icon: Wallet,
    step: "04",
    title: "Link Bank & DEMAT",
    desc: "Connect your bank account and open a DEMAT account with CDSC settlement.",
  },
  {
    icon: TrendingUp,
    step: "05",
    title: "Start Trading",
    desc: "Receive TMS credentials and trade on NEPSE via web or mobile.",
  },
];

const highlights = [
  "No branch visit",
  "Video KYC",
  "Typically within 24 hours",
];

export default function CTASection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-white via-brand-green-lt to-brand-green-lt px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-brand-green/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-brand-blue/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-foreground">
            Digital Account Opening in{" "}
            <span className="text-brand-green-dk">5 Simple Steps</span>
          </h2>
          <p className="mt-3 text-[15px] leading-[1.72] text-brand-gray">
            Open a trading and DEMAT account online. SEBON compliant, typically processed within one business day.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[13px] font-semibold text-brand-green-dk"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-3">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <li
                key={s.title}
                className="group relative overflow-hidden rounded-xl border border-brand-green/15 bg-white p-5 shadow-[0_8px_32px_rgba(42,184,0,0.12)] sm:p-6"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-green to-brand-green-dk" />
                <span className="absolute right-4 top-5 font-heading text-[26px] font-extrabold leading-none text-brand-green/20 transition-colors group-hover:text-brand-green/30">
                  {s.step}
                </span>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-green-dk text-white">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mb-2 text-[14px] font-bold leading-snug text-foreground sm:text-[15px]">
                  {s.title}
                </h3>
                <p className="text-[12.5px] leading-[1.6] text-brand-gray sm:text-[13px]">{s.desc}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 rounded-xl border border-brand-green/15 bg-white p-6 shadow-[0_10px_40px_rgba(42,184,0,0.14)] sm:mt-12 sm:p-8">
          <p className="mb-5 max-w-xl text-[15px] font-medium text-foreground">
            Register online or speak with our KYC team to get started.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-green to-brand-green-dk px-7 py-3.5 text-[14px] font-bold text-white shadow-[0_8px_24px_-8px_rgba(55,210,0,0.55)] transition-all hover:-translate-y-0.5"
            >
              Open Account
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="tel:015970145"
              className="rounded-xl border-2 border-brand-green-dk/25 bg-white px-7 py-3.5 text-[14px] font-semibold text-brand-green-dk transition-colors hover:border-brand-green-dk hover:bg-brand-green-lt/50"
            >
              Call KYC Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
