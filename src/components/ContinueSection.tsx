import {
  LineChart,
  PieChart,
  Clock,
  Monitor,
  Zap,
  BarChart2,
  type LucideIcon,
} from "lucide-react";

import imgMargin from "@/assets/1zero.png";
import imgPortfolio from "@/assets/2port.webp";
import imgAmo from "@/assets/amo.png";
import imgClient from "@/assets/client.png";
import imgFast from "@/assets/5fast.webp";
import imgTradingView from "@/assets/6trading.webp";

interface Feature {
  name: string;
  desc: string;
  boldWord: string;
  image: string;
  alt: string;
  icon: LucideIcon;
}

const FEATURES: Feature[] = [
  {
    name: "Margin Lending Facility",
    desc: "Borrow against eligible holdings at published rates to increase your investable balance.",
    boldWord: "published rates",
    image: imgMargin,
    alt: "Margin Lending Facility",
    icon: LineChart,
  },
  {
    name: "Portfolio Advisory",
    desc: "Pre-built model portfolios and research notes to support allocation decisions.",
    boldWord: "model portfolios",
    image: imgPortfolio,
    alt: "Portfolio Advisory",
    icon: PieChart,
  },
  {
    name: "Offline Order Placement",
    desc: "Place buy/sell orders after market hours, from 3:00 PM to before 10:30 AM next day.",
    boldWord: "after market hours",
    image: imgAmo,
    alt: "Offline Order Placement",
    icon: Clock,
  },
  {
    name: "Client Login",
    desc: "Web terminal with live charts, fundamentals, and account summary in one view.",
    boldWord: "live charts",
    image: imgClient,
    alt: "Client Login",
    icon: Monitor,
  },
  {
    name: "Fast Order Placement",
    desc: "Low-latency order routing for market and limit orders on NEPSE.",
    boldWord: "Low-latency",
    image: imgFast,
    alt: "Fast Order Placement",
    icon: Zap,
  },
  {
    name: "Trade with TradingView",
    desc: "Place basket orders on TradingView, linked to your Imperial Securities account.",
    boldWord: "basket orders",
    image: imgTradingView,
    alt: "Trade with TradingView",
    icon: BarChart2,
  },
];

function FeatureDesc({ desc, boldWord }: { desc: string; boldWord: string }) {
  const parts = desc.split(boldWord);
  if (parts.length < 2) return <>{desc}</>;
  return (
    <>
      {parts[0]}
      <span className="font-medium text-foreground">{boldWord}</span>
      {parts[1]}
    </>
  );
}

export default function ContinueSection() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-16">
      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-foreground">
            Continue Your Journey{" "}
            <span className="text-brand-green-dk">With Us</span>
          </h2>
          <p className="mt-3 text-[15px] leading-[1.72] text-brand-gray">
            Margin lending, offline orders, client login, and TradingView integration.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <li
                key={f.name}
                className="flex flex-col rounded-xl bg-white p-5 shadow-[0_4px_24px_rgba(42,184,0,0.1)]"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green-lt text-brand-green-dk">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="pt-1.5 text-[15px] font-bold leading-snug text-foreground">
                    {f.name}
                  </h3>
                </div>

                <p className="mb-4 flex-1 text-[13.5px] leading-[1.65] text-brand-gray">
                  <FeatureDesc desc={f.desc} boldWord={f.boldWord} />
                </p>

                <div className="flex h-32 items-center justify-center rounded-lg bg-brand-green-lt/45 p-3">
                  <img
                    src={f.image}
                    alt={f.alt}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
