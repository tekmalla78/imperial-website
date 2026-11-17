import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import {
  DEFAULT_PAYMENT_METHODS,
  parsePaymentMethods,
  type PaymentMethod,
} from "@/cms/payment-methods";
import { DEFAULT_PAYMENT_BANKING, type PaymentBanking } from "@/cms/types";

function PlatformIcon({ icon, name }: { icon: string; name: string }) {
  if (!icon) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-brand-blue-lt text-sm font-bold text-brand-blue">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={icon}
      alt={name}
      className="block h-full w-full object-contain"
    />
  );
}

function Modal({ platform, onClose }: { platform: PaymentMethod; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-dark/55 p-5 backdrop-blur-[6px]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={platform.name}
          className="max-h-[min(90vh,720px)] w-[calc(100%-32px)] max-w-[480px] overflow-auto rounded-3xl border border-border bg-white shadow-2xl"
        >
          <div
            className="relative border-b border-border px-5 py-5 sm:px-7 sm:py-7"
            style={{
              background: `linear-gradient(135deg, color-mix(in oklab, ${platform.accent} 14%, white) 0%, color-mix(in oklab, ${platform.accent} 6%, white) 100%)`,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-brand-gray transition-colors hover:bg-brand-blue-lt"
            >
              <X size={15} strokeWidth={2.2} />
            </button>

            <div className="flex items-center gap-4 pr-9">
              <div
                className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[18px] bg-white shadow-md"
                style={{ boxShadow: `0 8px 24px color-mix(in oklab, ${platform.accent} 28%, transparent)` }}
              >
                <PlatformIcon icon={platform.icon} name={platform.name} />
              </div>
              <div>
                {platform.tag ? (
                  <div
                    className="mb-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{ background: platform.accentLight, color: platform.accent }}
                  >
                    {platform.tag}
                  </div>
                ) : null}
                <h3 className="m-0 font-heading text-[22px] font-extrabold leading-tight text-foreground">
                  {platform.name}
                </h3>
                {platform.desc ? (
                  <p className="mt-1 text-[13px] text-brand-gray">{platform.desc}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="px-5 py-5 sm:px-7 sm:pb-7">
            {platform.body?.trim() ? (
              <div
                className="payment-popup-body prose prose-sm max-w-none text-[14px] leading-relaxed text-foreground [&_img]:mx-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:my-1 [&_ol]:my-2 [&_ul]:my-2"
                dangerouslySetInnerHTML={{ __html: platform.body }}
              />
            ) : (
              <p className="text-sm leading-relaxed text-brand-gray">
                Details for this payment method will appear here.
              </p>
            )}

            {platform.website ? (
              <a
                href={platform.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{
                  background: platform.accent,
                  boxShadow: `0 4px 16px color-mix(in oklab, ${platform.accent} 35%, transparent)`,
                }}
              >
                Visit {platform.name} <ExternalLink size={13} strokeWidth={2.5} />
              </a>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PlatformCard({ platform, onClick }: { platform: PaymentMethod; onClick: () => void }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="w-[136px] shrink-0 rounded-[14px] border-[1.5px] border-border bg-white p-[14px_13px_13px] text-left outline-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        borderColor: hov ? `${platform.accent}60` : undefined,
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov
          ? `0 12px 32px color-mix(in oklab, ${platform.accent} 18%, transparent)`
          : undefined,
      }}
    >
      <div
        className="pay-card-icon mb-2.5 h-11 w-11 overflow-hidden rounded-[10px] bg-white shadow-sm transition-shadow"
        style={{
          boxShadow: hov
            ? `0 6px 16px color-mix(in oklab, ${platform.accent} 28%, transparent)`
            : undefined,
        }}
      >
        <PlatformIcon icon={platform.icon} name={platform.name} />
      </div>

      {platform.tag ? (
        <div
          className="pay-card-tag mb-1.5 inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.07em] transition-colors"
          style={
            hov
              ? { background: platform.accentLight, color: platform.accent }
              : { background: "var(--brand-blue-lt)", color: "var(--brand-gray)" }
          }
        >
          {platform.tag}
        </div>
      ) : null}

      <div className="pay-card-name mb-1 font-heading text-xs font-extrabold leading-snug text-foreground">
        {platform.name}
      </div>

      {platform.desc ? (
        <div className="pay-card-desc text-[10.5px] leading-snug text-brand-gray">{platform.desc}</div>
      ) : null}

      <div
        className="pay-card-hint mt-2 flex items-center gap-1 text-[9.5px] font-semibold transition-all duration-200"
        style={{
          color: platform.accent,
          opacity: hov ? 1 : 0,
          transform: hov ? "translateY(0)" : "translateY(4px)",
        }}
      >
        View details →
      </div>
    </button>
  );
}

export default function PaymentBankingSection({
  data = DEFAULT_PAYMENT_BANKING,
}: {
  data?: PaymentBanking;
}) {
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const platforms = useMemo(() => {
    const parsed = parsePaymentMethods(data.methods);
    return parsed.length ? parsed : DEFAULT_PAYMENT_METHODS;
  }, [data.methods]);
  const loop = [...platforms, ...platforms];
  const eyebrow = data.eyebrow || DEFAULT_PAYMENT_BANKING.eyebrow;
  const title = data.title || DEFAULT_PAYMENT_BANKING.title;
  const titleAccent = data.titleAccent || DEFAULT_PAYMENT_BANKING.titleAccent;
  const subtitle = data.subtitle || DEFAULT_PAYMENT_BANKING.subtitle;

  return (
    <>
      <section id="payment-banking" className="bg-white px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 max-w-2xl">
            <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[2px] text-brand-blue">
              {eyebrow}
            </p>
            <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-foreground">
              {title}{" "}
              <span className="text-brand-green-dk">{titleAccent}</span>
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.72] text-brand-gray">{subtitle}</p>
          </div>

          <div className="pay-marquee-wrap">
            <div
              className="pay-marquee-track"
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = "paused";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = "running";
              }}
            >
              {loop.map((p, i) => (
                <PlatformCard
                  key={`${p.name}-${i}`}
                  platform={p}
                  onClick={() => setSelected(p)}
                />
              ))}
            </div>
          </div>
          <div className="pay-mobile-grid">
            {platforms.map((p) => (
              <PlatformCard key={p.name} platform={p} onClick={() => setSelected(p)} />
            ))}
          </div>
        </div>
      </section>

      {selected ? <Modal platform={selected} onClose={() => setSelected(null)} /> : null}

      <style>{`
        @keyframes marquee-pay {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .pay-marquee-wrap {
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }
        .pay-marquee-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: marquee-pay 38s linear infinite;
          padding: 8px 0 16px;
        }
        .pay-mobile-grid { display: none; }
        @media (max-width: 640px) {
          .pay-marquee-wrap { display: none; }
          .pay-mobile-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            padding: 4px 0 8px;
          }
          .pay-mobile-grid button {
            width: 100% !important;
            padding: 14px 10px !important;
            border-radius: 14px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .pay-mobile-grid .pay-card-icon {
            width: 48px !important;
            height: 48px !important;
            border-radius: 12px !important;
            margin-bottom: 0 !important;
          }
          .pay-mobile-grid .pay-card-tag,
          .pay-mobile-grid .pay-card-name,
          .pay-mobile-grid .pay-card-desc,
          .pay-mobile-grid .pay-card-hint {
            display: none !important;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .pay-marquee-track { animation-duration: 28s; }
        }
      `}</style>
    </>
  );
}
