import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { splitPairs } from "@/cms/collections";
import { DEFAULT_HOMEPAGE, type Homepage } from "@/cms/types";
import { useSettings } from "@/cms/site-chrome";

const CARD_ACCENTS = [
  "from-brand-blue to-brand-blue-dk",
  "from-brand-blue to-brand-green-dk",
  "from-brand-green to-brand-green-dk",
  "from-brand-blue-dk to-brand-blue",
];

export default function SimpleHero({ homepage = DEFAULT_HOMEPAGE }: { homepage?: Homepage }) {
  const settings = useSettings();
  const stats = splitPairs(homepage.stats);
  const cards = splitPairs(homepage.cards);
  const ctaHref = homepage.ctaHref || settings.registrationUrl;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-blue-lt via-brand-blue-lt/50 to-white pb-16 pt-5 sm:pb-20 sm:pt-6 lg:pb-24">
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="mt-2 grid items-center gap-10 lg:mt-4 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mb-3 text-[11.5px] font-bold uppercase tracking-[2px] text-brand-blue">
              {homepage.kicker}
            </p>

            <h1 className="font-heading text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-balance text-foreground">
              {homepage.title}
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
              {homepage.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-green to-brand-green-dk px-6 py-3.5 text-[14px] font-bold text-white shadow-[0_8px_24px_-8px_rgba(55,210,0,0.55)] transition-all hover:-translate-y-0.5"
              >
                {homepage.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-brand-blue/20 bg-white px-6 py-3.5 text-[14px] font-semibold text-brand-blue transition-all hover:border-brand-blue"
              >
                <MessageCircle className="h-4 w-4" />
                {homepage.secondaryCtaLabel}
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-brand-blue/10 pt-7 sm:grid-cols-4 sm:gap-6">
              {stats.map((item) => (
                <div key={item.title}>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{item.title}</p>
                  <p className="font-heading text-base font-bold text-foreground sm:text-lg">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {cards.map((card, index) => (
              <div key={card.title} className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
                <div className={`mb-2.5 h-1 w-9 rounded-full bg-gradient-to-r ${CARD_ACCENTS[index % CARD_ACCENTS.length]}`} />
                <h3 className="text-[13px] font-bold text-foreground sm:text-sm">{card.title}</h3>
                <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground sm:text-xs">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
