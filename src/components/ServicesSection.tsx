"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

interface Service {
  number: string;
  title: string;
  desc: string;
  tag: string;
  accent: string;
  accentLight: string;
  alt: string;
  href: string;
}

const SERVICES: Service[] = [
  {
    number: "01",
    title: "Stock Brokerage",
    desc: "Execute buy and sell orders on NEPSE with real-time market access, competitive brokerage rates, and instant trade confirmation.",
    tag: "Equities",
    accent: "var(--brand-blue)",
    accentLight: "var(--brand-blue-lt)",
    alt: "Stock Brokerage",
    href: "/services/stock-brokerage",
  },
  {
    number: "02",
    title: "Depository Services (DP)",
    desc: "Open and manage your DEMAT account. Receive IPO allotments, transfer shares digitally — all CDSC-linked.",
    tag: "DEMAT",
    accent: "var(--brand-green-dk)",
    accentLight: "var(--brand-green-lt)",
    alt: "Depository Services",
    href: "/services/depository-services",
  },
  {
    number: "03",
    title: "Margin Trading",
    desc: "Borrow against your portfolio under our margin facility. Interest rates and limits are published upfront.",
    tag: "Margin",
    accent: "var(--brand-blue-dk)",
    accentLight: "var(--brand-blue-lt)",
    alt: "Margin Trading",
    href: "/services/margin-trading",
  },
  {
    number: "04",
    title: "Portfolio Management",
    desc: "SEBON-certified advisors manage a customized portfolio aligned to your risk appetite with monthly reports.",
    tag: "Advisory",
    accent: "var(--brand-green-dk)",
    accentLight: "var(--brand-green-lt)",
    alt: "Portfolio Management",
    href: "/services/portfolio-management",
  },
  {
    number: "05",
    title: "IPO / FPO Application",
    desc: "Apply for upcoming IPOs & FPOs online without visiting a branch. Get automatic allotment to your DEMAT.",
    tag: "Primary Market",
    accent: "var(--brand-blue)",
    accentLight: "var(--brand-blue-lt)",
    alt: "IPO FPO Application",
    href: "/services/ipo-fpo",
  },
  {
    number: "06",
    title: "Research & Advisory",
    desc: "Daily market reports, company fundamentals, sector analysis, and expert stock recommendations from our team.",
    tag: "Insights",
    accent: "var(--brand-green-dk)",
    accentLight: "var(--brand-green-lt)",
    alt: "Research Advisory",
    href: "/services/research-advisory",
  },
];

const TOTAL = SERVICES.length;
const VISIBLE = 3;
const DURATION = 3000;

type ServiceStyle = React.CSSProperties & {
  "--svc-accent"?: string;
  "--svc-accent-light"?: string;
};

function serviceStyle(s: Service): ServiceStyle {
  return {
    "--svc-accent": s.accent,
    "--svc-accent-light": s.accentLight,
  };
}

export default function ServicesSection() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState<number[]>(Array(TOTAL).fill(0));
  const [trackOffset, setTrackOffset] = useState(0);
  const [animated, setAnimated] = useState(false);
  const navigate = useNavigate();

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const prevWSRef = useRef(-1);
  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const swipeTouchStartX = useRef<number | null>(null);
  const swipeTouchStartY = useRef<number | null>(null);

  const getHeights = useCallback((): number[] => {
    if (!trackRef.current) return [];
    return Array.from(
      trackRef.current.querySelectorAll<HTMLDivElement>(".svc-item"),
    ).map((el) => el.getBoundingClientRect().height);
  }, []);

  const syncWindowHeight = useCallback(
    (idx: number) => {
      if (!windowRef.current) return;
      const hs = getHeights();
      if (!hs.length) return;
      let ws = idx - 1;
      if (ws < 0) ws = 0;
      if (ws + VISIBLE > TOTAL) ws = TOTAL - VISIBLE;
      let h = 0;
      for (let i = ws; i < ws + VISIBLE; i++)
        h += hs[i] + (i < ws + VISIBLE - 1 ? 4 : 0);
      windowRef.current.style.height = h + "px";
    },
    [getHeights],
  );

  const computeScroll = useCallback(
    (idx: number) => {
      const hs = getHeights();
      if (!hs.length) return { offset: 0, ws: 0 };
      const tops: number[] = [];
      let y = 0;
      hs.forEach((h) => {
        tops.push(y);
        y += h + 4;
      });
      let ws = idx - 1;
      if (ws < 0) ws = 0;
      if (ws + VISIBLE > TOTAL) ws = TOTAL - VISIBLE;
      return { offset: tops[ws] ?? 0, ws };
    },
    [getHeights],
  );

  const applyScroll = useCallback(
    (idx: number, animate: boolean) => {
      const { offset, ws } = computeScroll(idx);
      const shouldAnimate = animate && ws !== prevWSRef.current;
      setAnimated(shouldAnimate);
      setTrackOffset(offset);
      prevWSRef.current = ws;
    },
    [computeScroll],
  );

  const selectService = useCallback(
    (idx: number, animate = true) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      setCurrent(idx);
      setProgress(Array(TOTAL).fill(0));

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          syncWindowHeight(idx);
          applyScroll(idx, animate);
        });
      });

      const tick = (ts: number) => {
        if (pausedRef.current) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        if (!startRef.current) startRef.current = ts;
        const pct = Math.min(((ts - startRef.current) / DURATION) * 100, 100);
        setProgress((prev) => {
          const n = [...prev];
          n[idx] = pct;
          return n;
        });
        if (pct < 100) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          selectService((idx + 1) % TOTAL, true);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [syncWindowHeight, applyScroll],
  );

  useEffect(() => {
    const t = setTimeout(() => selectService(0, false), 100);
    return () => {
      clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [selectService]);

  useEffect(() => {
    const onResize = () => {
      syncWindowHeight(currentRef.current);
      applyScroll(currentRef.current, false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncWindowHeight, applyScroll]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
    startRef.current = null;
  };
  const svc = SERVICES[current];

  const handleMobileSwipeStart = (e: React.TouchEvent) => {
    swipeTouchStartX.current = e.touches[0].clientX;
    swipeTouchStartY.current = e.touches[0].clientY;
    pause();
  };

  const handleMobileSwipeEnd = (e: React.TouchEvent) => {
    if (swipeTouchStartX.current === null || swipeTouchStartY.current === null)
      return;
    const dx = e.changedTouches[0].clientX - swipeTouchStartX.current;
    const dy = e.changedTouches[0].clientY - swipeTouchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) {
        selectService((currentRef.current + 1) % TOTAL, true);
      } else {
        selectService((currentRef.current - 1 + TOTAL) % TOTAL, true);
      }
    } else {
      resume();
    }
    swipeTouchStartX.current = null;
    swipeTouchStartY.current = null;
  };

  return (
    <>
      <style>{`
        #services-section { font-family: var(--font-body); background: var(--background); padding: 56px 16px; width: 100%; }
        .svc-wrap    { max-width: 1280px; margin: 0 auto; }
        .svc-desktop { display: grid; grid-template-columns: 1fr 1.1fr; gap: 60px; align-items: center; }
        .svc-mobile  { display: none; flex-direction: column; align-items: stretch; }

        .svc-window  { overflow: hidden; position: relative; }
        .svc-track          { display: flex; flex-direction: column; gap: 4px; will-change: transform; }
        .svc-track.animated { transition: transform .55s cubic-bezier(.4,0,.2,1); }

        .svc-item    { border-radius: 12px; padding: 14px 16px 14px 20px; cursor: pointer; transition: background .3s,box-shadow .3s; position: relative; overflow: hidden; flex-shrink: 0; }
        .svc-item.is-active { background: var(--svc-accent-light); box-shadow: 0 2px 16px color-mix(in oklch, var(--svc-accent) 8%, transparent); }
        .svc-bar     { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; overflow: hidden; background: color-mix(in oklch, var(--svc-accent) 20%, transparent); }
        .svc-item:not(.is-active) .svc-bar { background: transparent; }
        .svc-bar-fill{ position: absolute; left: 0; top: 0; width: 100%; background: var(--svc-accent); transform-origin: top; transform: scaleY(calc(var(--bar-progress, 0) / 100)); transition: transform .05s linear; height: 100%; }
        .svc-top     { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .svc-num     { font-size: 10px; font-weight: 800; color: var(--muted-foreground); letter-spacing: .05em; opacity: 0.55; }
        .svc-tag     { font-size: 9.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px; transition: color .3s,background .3s; color: var(--brand-gray); }
        .svc-item.is-active .svc-tag { color: var(--svc-accent); background: color-mix(in oklch, var(--svc-accent) 10%, transparent); }
        .svc-name    { font-family: var(--font-heading); font-size: 14px; font-weight: 700; margin-bottom: 4px; letter-spacing: -.01em; transition: color .3s; color: var(--foreground); }
        .svc-item.is-active .svc-name { color: var(--svc-accent); }
        .svc-desc    { font-size: 12.5px; color: var(--brand-gray); line-height: 1.6; }
        .svc-cta     { display: none; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; margin-top: 8px; text-decoration: none; color: var(--svc-accent); }

        .svc-dots    { display: flex; gap: 8px; margin-top: 16px; }
        .svc-dot     { height: 4px; width: 12px; border-radius: 9999px; overflow: hidden; cursor: pointer; transition: transform .3s ease,background .3s ease; background: var(--border); transform-origin: left center; }
        .svc-dot.is-active { transform: scaleX(2.33); background: color-mix(in oklch, var(--svc-accent) 20%, transparent); }
        .svc-dot-fill{ height: 100%; border-radius: 9999px; background: var(--svc-accent); transform-origin: left center; transform: scaleX(calc(var(--dot-progress, 0) / 100)); transition: transform .05s linear; width: 100%; }

        .svc-mockup  { position: relative; height: 420px; display: flex; align-items: center; justify-content: center; }
        .svc-panel   { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1; transition: opacity .55s cubic-bezier(.4,0,.2,1), transform .55s cubic-bezier(.4,0,.2,1); }
        .svc-img-wrap { width: 100%; height: 100%; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer; background: linear-gradient(135deg, var(--svc-accent-light), color-mix(in oklch, var(--svc-accent) 18%, transparent)); }
        .svc-mock-num { font-family: var(--font-heading); font-size: 4rem; font-weight: 800; color: color-mix(in oklch, var(--svc-accent) 28%, transparent); line-height: 1; }
        .svc-badge   { position: absolute; bottom: 24px; right: 24px; z-index: 2; display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 6px 14px; border-radius: 9999px; background: var(--background); color: var(--svc-accent); box-shadow: 0 4px 20px color-mix(in oklch, var(--svc-accent) 13%, transparent); pointer-events: none; transition: color .3s,box-shadow .5s; }
        .svc-bdot    { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: var(--svc-accent); transition: background .3s; }

        .svc-mob-img-wrap { width: 100%; height: 240px; position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; cursor: pointer; touch-action: pan-y; }
        .svc-mob-panel    { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transition: opacity .5s ease,transform .5s ease; }
        .svc-mob-img      { width: 100%; height: 100%; border-radius: 0.875rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--svc-accent-light), color-mix(in oklch, var(--svc-accent) 18%, transparent)); }
        .svc-mob-info     { text-align: center; padding: 0 8px; margin-bottom: 16px; width: 100%; cursor: pointer; touch-action: pan-y; }
        .svc-mob-tag      { display: inline-block; font-size: 9.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 2px 10px; border-radius: 9999px; margin-bottom: 8px; color: var(--svc-accent); background: var(--svc-accent-light); }
        .svc-mob-name     { font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: var(--foreground); line-height: 1.3; min-height: calc(1.3em * 2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 6px; }
        .svc-mob-desc     { font-size: 13px; color: var(--brand-gray); line-height: 1.6; max-width: 340px; margin: 0 auto; min-height: calc(1.6em * 3); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .svc-mob-explore  { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; margin-top: 12px; padding: 7px 18px; border-radius: 9999px; border: 1.5px solid currentColor; text-decoration: none; cursor: pointer; transition: opacity .2s; color: var(--svc-accent); }
        .svc-mob-explore:hover { opacity: .75; }
        .svc-mob-explore svg   { transition: transform .2s; }
        .svc-mob-explore:hover svg { transform: translateX(3px); }
        .svc-mob-dots { display: flex; gap: 8px; justify-content: center; }
        .svc-mob-swipe-hint { font-size: 10.5px; color: var(--muted-foreground); text-align: center; margin-top: 10px; letter-spacing: .04em; user-select: none; }

        @media (max-width: 900px) {
          .svc-desktop { grid-template-columns: 1fr; gap: 32px; }
          .svc-mockup  { height: 300px; }
        }
        @media (max-width: 660px) {
          .svc-desktop { display: none; }
          .svc-mobile  { display: flex; }
          #services-section { padding: 56px 16px; }
        }
        @media (min-width: 640px) {
          #services-section { padding: 64px 24px; }
        }
      `}</style>

      <section
        id="services-section"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        <div className="svc-wrap">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-foreground">
              Our Core{" "}
              <span className="text-brand-green-dk">Services</span>
            </h2>
            <p className="mt-3 text-[15px] leading-[1.72] text-brand-gray">
              Brokerage, depository, margin, IPO application, and research
              services for NEPSE investors.
            </p>
          </div>

          <div className="svc-desktop">
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div className="svc-window" ref={windowRef}>
                <div
                  ref={trackRef}
                  className={`svc-track${animated ? " animated" : ""}`}
                  style={{ transform: `translateY(-${trackOffset}px)` }}
                >
                  {SERVICES.map((s, i) => (
                    <div
                      key={i}
                      className={`svc-item${i === current ? " is-active" : ""}`}
                      style={{
                        ...serviceStyle(s),
                        ["--bar-progress" as string]: progress[i],
                      }}
                      onClick={() => selectService(i)}
                    >
                      <div className="svc-bar">
                        <div className="svc-bar-fill" />
                      </div>
                      <div className="svc-top">
                        <span className="svc-num">{s.number}</span>
                        <span className="svc-tag">{s.tag}</span>
                      </div>
                      <div className="svc-name">{s.title}</div>
                      <div className="svc-desc">{s.desc}</div>
                      {i === current && (
                        <Link
                          to={s.href}
                          className="svc-cta"
                          style={{ display: "inline-flex" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Explore Service</span>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M2 7h10M8 3l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="svc-dots">
                {SERVICES.map((s, i) => (
                  <div
                    key={i}
                    className={`svc-dot${i === current ? " is-active" : ""}`}
                    style={{
                      ...serviceStyle(s),
                      ["--dot-progress" as string]: progress[i],
                    }}
                    onClick={() => selectService(i)}
                  >
                    <div className="svc-dot-fill" />
                  </div>
                ))}
              </div>
            </div>

            <div className="svc-mockup" style={serviceStyle(svc)}>
              {SERVICES.map((s, i) => (
                <div
                  key={i}
                  className="svc-panel"
                  style={{
                    ...serviceStyle(s),
                    opacity: i === current ? 1 : 0,
                    transform:
                      i === current
                        ? "translateX(0) scale(1)"
                        : "translateX(24px) scale(0.97)",
                    pointerEvents: i === current ? "auto" : "none",
                  }}
                >
                  <div
                    className="svc-img-wrap"
                    onClick={() => navigate({ to: s.href })}
                  >
                    <span className="svc-mock-num" aria-hidden>
                      {s.number}
                    </span>
                    <span className="sr-only">{s.alt}</span>
                  </div>
                </div>
              ))}
              <div className="svc-badge">
                <span className="svc-bdot" />
                {svc.tag}
              </div>
            </div>
          </div>

          <div className="svc-mobile" style={serviceStyle(svc)}>
            <div
              className="svc-mob-img-wrap"
              onTouchStart={handleMobileSwipeStart}
              onTouchEnd={handleMobileSwipeEnd}
              onClick={() => navigate({ to: svc.href })}
            >
              {SERVICES.map((s, i) => (
                <div
                  key={i}
                  className="svc-mob-panel"
                  style={{
                    ...serviceStyle(s),
                    opacity: i === current ? 1 : 0,
                    transform: i === current ? "scale(1)" : "scale(0.97)",
                    pointerEvents: i === current ? "auto" : "none",
                  }}
                >
                  <div className="svc-mob-img">
                    <span className="svc-mock-num" aria-hidden>
                      {s.number}
                    </span>
                    <span className="sr-only">{s.alt}</span>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="svc-mob-info"
              onTouchStart={handleMobileSwipeStart}
              onTouchEnd={handleMobileSwipeEnd}
              onClick={() => navigate({ to: svc.href })}
            >
              <span className="svc-mob-tag">{svc.tag}</span>
              <div className="svc-mob-name">{svc.title}</div>
              <p className="svc-mob-desc">{svc.desc}</p>
              <Link
                to={svc.href}
                className="svc-mob-explore"
                onClick={(e) => e.stopPropagation()}
              >
                Explore Service
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            <div className="svc-dots svc-mob-dots">
              {SERVICES.map((s, i) => (
                <div
                  key={i}
                  className={`svc-dot${i === current ? " is-active" : ""}`}
                  style={{
                    ...serviceStyle(s),
                    ["--dot-progress" as string]: progress[i],
                  }}
                  onClick={() => selectService(i)}
                >
                  <div className="svc-dot-fill" />
                </div>
              ))}
            </div>
            <p className="svc-mob-swipe-hint">← swipe to explore →</p>
          </div>
        </div>
      </section>
    </>
  );
}
