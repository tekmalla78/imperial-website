"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import liveSeed from "@/cms/live-seed.json";

type FoundationContent = {
  mission?: string;
  vision?: string;
  values?: string;
};

type Pillar = {
  id: "mission" | "vision" | "values";
  label: string;
  labelClass: string;
  desc: string;
  points: readonly string[];
};

const pillarMeta = [
  {
    id: "mission" as const,
    label: "Mission",
    labelClass: "text-brand-blue",
    points: [
      "Quality in process and continuous improvement",
      "Exceptional service that delights clients",
      "Contribute to Nepal's capital market",
    ],
  },
  {
    id: "vision" as const,
    label: "Vision",
    labelClass: "text-brand-green-dk",
    points: [
      "Best value for money for investors",
      "Innovative products and trading strategies",
      "State-of-the-art technology and personalised service",
    ],
  },
  {
    id: "values" as const,
    label: "Values",
    labelClass: "text-brand-blue-dk",
    points: [
      "Harmony between quality and improvement",
      "Service that delights customers and clients",
      "Motto: Guides Towards Prosperity",
    ],
  },
];

function buildPillars(content?: FoundationContent): Pillar[] {
  const copy = {
    mission: content?.mission || liveSeed.foundation.mission,
    vision: content?.vision || liveSeed.foundation.vision,
    values: content?.values || liveSeed.foundation.values,
  };
  return pillarMeta.map((item) => ({
    ...item,
    desc: copy[item.id],
  }));
}

const EASE = [0.16, 1, 0.3, 1] as const;

const navFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 focus-visible:ring-offset-2";

function useSmoothScroll(
  target: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.82", "start 0.38"],
    enabled,
  });
  return useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0008,
  });
}

function ScrollPoint({
  progress,
  range,
  reduceMotion,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  const y = useTransform(progress, range, [14, 0]);

  if (reduceMotion) {
    return (
      <li className="flex items-start gap-4 md:gap-5">{children}</li>
    );
  }

  return (
    <motion.li style={{ y }} className="flex items-start gap-4 md:gap-5">
      {children}
    </motion.li>
  );
}

function PhilosophySection({
  item,
  index,
  sectionRef,
  reduceMotion,
}: {
  item: Pillar;
  index: number;
  sectionRef: (el: HTMLElement | null) => void;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const smooth = useSmoothScroll(ref, !reduceMotion);

  const y = useTransform(smooth, [0, 1], [32, 0]);
  const lineScale = useTransform(smooth, [0, 0.4], [0, 1]);
  const labelY = useTransform(smooth, [0, 0.35], [10, 0]);

  const mergedRef = useCallback(
    (el: HTMLElement | null) => {
      ref.current = el;
      sectionRef(el);
    },
    [sectionRef],
  );

  const motionStyle = reduceMotion ? undefined : { y };

  return (
    <article
      id={item.id}
      ref={mergedRef}
      className={`scroll-mt-28 py-10 md:py-12 lg:py-14 ${index === 0 ? "pt-0" : ""}`}
    >
      <motion.div style={motionStyle} className="max-w-3xl">
        {reduceMotion ? (
          <p className={`mb-5 text-[11.5px] font-bold uppercase tracking-[2px] md:mb-6 ${item.labelClass}`}>
            {item.label}
          </p>
        ) : (
          <motion.p
            style={{ y: labelY }}
            className={`mb-5 text-[11.5px] font-bold uppercase tracking-[2px] md:mb-6 ${item.labelClass}`}
          >
            {item.label}
          </motion.p>
        )}

        <div className="relative mb-6 md:mb-7">
          {!reduceMotion && (
            <motion.div
              style={{ scaleY: lineScale }}
              className="pointer-events-none absolute -left-4 top-0 h-full w-0.5 origin-top rounded-full bg-gradient-to-b from-brand-blue to-brand-green-dk sm:-left-6"
              aria-hidden
            />
          )}
          <p className="relative font-heading text-[clamp(1.5rem,3.4vw,2.75rem)] font-extrabold leading-[1.26] tracking-tight text-foreground text-balance">
            {item.desc}
          </p>
        </div>

        <ol className="space-y-4 md:space-y-[1.125rem]">
          {item.points.map((point, i) => (
            <ScrollPoint
              key={point}
              progress={smooth}
              range={[0.28 + i * 0.1, 0.48 + i * 0.1]}
              reduceMotion={reduceMotion}
            >
              <span
                className="mt-0.5 font-heading text-sm font-extrabold tabular-nums text-brand-blue/40 md:text-base"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[14px] leading-[1.68] text-foreground/88 md:text-[15px] md:leading-[1.72]">
                {point}
              </span>
            </ScrollPoint>
          ))}
        </ol>
      </motion.div>
    </article>
  );
}

export default function FoundationSection({
  mission,
  vision,
  values,
}: FoundationContent = {}) {
  const pillars = buildPillars({ mission, vision, values });
  const reduceMotion = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const registerSection = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      sectionRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const updateActive = () => {
      const sections = sectionRefs.current.filter(Boolean) as HTMLElement[];
      if (!sections.length) return;

      const marker = window.innerHeight * 0.42;
      let closest = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      sections.forEach((el, i) => {
        const { top, bottom } = el.getBoundingClientRect();
        if (bottom < 0 || top > window.innerHeight) return;

        const center = (top + bottom) / 2;
        const distance = Math.abs(center - marker);
        if (distance < minDistance) {
          minDistance = distance;
          closest = i;
        }
      });

      setActive(closest);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  const scrollTo = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-brand-green-lt/30 to-brand-green-lt py-12 md:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-brand-green/12 blur-3xl" />
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand-blue/[0.06] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 1, y: reduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: reduceMotion ? 0 : 0.75, ease: EASE }}
          className="max-w-3xl"
        >
          <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[2px] text-brand-blue">
            Our Foundation
          </p>
          <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-foreground text-balance">
            Mission, Vision{" "}
            <span className="text-brand-green-dk">&amp; Values</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.72] text-brand-gray md:text-[15px] text-pretty">
            We define our{" "}
            <span className="font-medium text-foreground">Mission</span> as how we
            serve investors today, our{" "}
            <span className="font-medium text-foreground">Vision</span> as the
            company we are building toward, and our{" "}
            <span className="font-medium text-foreground">Values</span> as the
            standards behind every client relationship, market obligation, and
            regulatory duty.
          </p>
        </motion.div>

        <div className="mt-7 md:mt-8 lg:grid lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:items-start lg:gap-x-14 xl:gap-x-20">
          <div className="sticky top-[4.5rem] z-20 -mx-4 bg-white/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden">
            <div className="flex gap-2" role="tablist" aria-label="Foundation sections">
              {pillars.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-controls={item.id}
                  onClick={() => scrollTo(i)}
                  className={`relative flex min-h-11 flex-1 items-center justify-center rounded-md px-2 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 ${navFocus} ${
                    active === i
                      ? "text-brand-blue"
                      : "text-brand-gray hover:text-foreground"
                  }`}
                >
                  {active === i && !reduceMotion && (
                    <motion.span
                      layoutId="foundation-mobile-rail"
                      className="absolute inset-0 rounded-md bg-brand-blue-lt/60"
                      transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  {active === i && reduceMotion && (
                    <span className="absolute inset-0 rounded-md bg-brand-blue-lt/60" aria-hidden />
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <nav
            className="sticky top-28 z-10 hidden self-start lg:block lg:top-28 xl:top-36"
            aria-label="Mission, vision, and values"
          >
            <ul className="space-y-1">
              {pillars.map((item, i) => {
                const isActive = active === i;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(i)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative flex min-h-11 w-full items-center gap-3 rounded-md px-1 py-2.5 text-left transition-colors duration-300 ${navFocus} ${
                        isActive ? "text-foreground" : "text-brand-gray hover:text-foreground"
                      }`}
                    >
                      {isActive && !reduceMotion && (
                        <motion.span
                          layoutId="foundation-rail"
                          className="absolute -left-3 h-6 w-0.5 rounded-full bg-brand-green-dk"
                          transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        />
                      )}
                      {isActive && reduceMotion && (
                        <span
                          className="absolute -left-3 h-6 w-0.5 rounded-full bg-brand-green-dk"
                          aria-hidden
                        />
                      )}
                      <span
                        className={`text-[11px] font-bold uppercase tracking-[2px] ${
                          isActive ? pillars[i].labelClass : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div>
            {pillars.map((item, i) => (
              <PhilosophySection
                key={item.id}
                item={item}
                index={i}
                sectionRef={registerSection(i)}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
