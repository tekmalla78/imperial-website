"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type HistoryEntry = {
  year: string;
  title: string;
  desc: string;
  icon?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

function YearBlock({ entry, index }: { entry: HistoryEntry; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 1, y: reduceMotion ? 0 : 12 }}
      animate={
        reduceMotion || inView
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 12 }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        delay: reduceMotion ? 0 : index * 0.04,
        ease: EASE,
      }}
      className={`group relative rounded-2xl border border-brand-blue/10 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/20 hover:shadow-[0_22px_46px_rgba(37,99,235,0.08)] sm:p-5 ${
        index > 0 ? "mt-4 md:mt-5" : ""
      }`}
    >
      <div className="absolute left-4 top-0 hidden h-full w-px -translate-y-5 bg-gradient-to-b from-transparent via-brand-blue/20 to-transparent md:block" />

      <div className="relative flex gap-4 sm:gap-5">
        <div className="relative flex shrink-0 items-center justify-center">
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-green/10 blur-sm" />
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-brand-blue/10 bg-white shadow-sm ring-4 ring-brand-blue/5 sm:h-16 sm:w-16">
            {entry.icon ? (
              <img
                src={entry.icon}
                alt=""
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
            ) : (
              <span className="font-heading text-lg font-extrabold text-brand-blue sm:text-xl">
                {entry.year}
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-brand-blue/15 bg-brand-blue-lt px-2.5 py-1 font-heading text-[11px] font-bold uppercase tracking-[1.4px] text-brand-blue">
              {entry.year}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-brand-blue/20 via-brand-blue/10 to-transparent" />
          </div>

          <h3 className="mb-2 font-heading text-[clamp(1.15rem,2vw,1.7rem)] font-extrabold leading-tight text-foreground">
            {entry.title}
          </h3>
          <p className="text-[15px] leading-[1.78] text-brand-gray md:text-[16px] md:leading-[1.82]">
            {entry.desc}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export default function HistoryTimeline({
  entries,
  intro,
}: {
  entries: HistoryEntry[];
  intro: React.ReactNode;
}) {
  return (
    <section className="relative bg-gradient-to-b from-brand-gray-lt via-brand-gray-lt/50 to-white py-12 md:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-brand-blue/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14 xl:gap-16">
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start xl:top-36">{intro}</div>

          <div className="space-y-0 md:space-y-0 lg:space-y-0">
            {entries.map((entry, i) => (
              <YearBlock key={`${entry.year}-${entry.title}-${i}`} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
