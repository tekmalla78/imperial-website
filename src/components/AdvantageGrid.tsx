"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export type AdvantageItem = {
  title: string;
  desc: string;
  tone: "blue" | "green";
};

const toneClass = {
  blue: "border-brand-blue/20 bg-brand-blue/[0.08] active:border-brand-blue/35 active:bg-brand-blue/[0.12] [@media(hover:hover)]:hover:border-brand-blue/35 [@media(hover:hover)]:hover:bg-brand-blue/[0.12]",
  green:
    "border-brand-green/20 bg-brand-green/[0.06] active:border-brand-green/35 active:bg-brand-green/[0.1] [@media(hover:hover)]:hover:border-brand-green/35 [@media(hover:hover)]:hover:bg-brand-green/[0.1]",
} as const;

export default function AdvantageGrid({ items }: { items: AdvantageItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div
      ref={ref}
      className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 1, y: reduceMotion ? 0 : 14 }}
          animate={
            reduceMotion || inView
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: 14 }
          }
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            delay: reduceMotion ? 0 : Math.min(index * 0.05, 0.35),
            ease: EASE,
          }}
          className={`rounded-xl border p-5 md:p-6 ${toneClass[item.tone]}`}
        >
          <h3 className="font-heading text-base font-bold text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/90">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
