import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Design tokens ─────────────────────────────────────────── */
const T = {
  ink:     "#0A0F1E",
  navy:    "#0B1A35",
  blue:    "#1557C0",
  blueMid: "#2563EB",
  accent:  "#1557C0",
  gold:    "#F59E0B",
  surface: "#FFFFFF",
  glass:   "rgba(21,87,192,0.04)",
  border:  "#E4ECF7",
  bg:      "#EEF3FB",
  card:    "#FFFFFF",
  cardHov: "#F0F6FF",
  txtPri:  "#0B1A35",
  txtSec:  "#4B5563",
  txtMute: "#94A3B8",
  line:    "#EDF2FA",
};

/* ─── Tag palette ──────────────────────────────────────────── */
const TAGS: Record<string, { fg: string; bg: string }> = {
  "Market Update": { fg: "#1557C0", bg: "#DBEAFE" },
  "Announcement":  { fg: "#6D28D9", bg: "#EDE9FE" },
  "Regulation":    { fg: "#92400E", bg: "#FEF3C7" },
  "Corporate":     { fg: "#065F46", bg: "#D1FAE5" },
  "IPO Alert":     { fg: "#991B1B", bg: "#FEE2E2" },
  "Economy":       { fg: "#0E7490", bg: "#CFFAFE" },
  "Education":     { fg: "#1557C0", bg: "#DBEAFE" },
  "Analysis":      { fg: "#065F46", bg: "#D1FAE5" },
  "Guide":         { fg: "#6D28D9", bg: "#EDE9FE" },
  "Strategy":      { fg: "#92400E", bg: "#FEF3C7" },
};

/* ─── Placeholder images (Unsplash, topic-matched) ─────────── */
const IMG: Record<string, string> = {
  "Market Update": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
  "Announcement":  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  "Regulation":    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
  "Corporate":     "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  "IPO Alert":     "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&q=80",
  "Economy":       "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80",
  "Education":     "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
  "Analysis":      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  "Guide":         "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
  "Strategy":      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80",
};

/* ─── Data ──────────────────────────────────────────────────── */
interface Item { tag:string; date:string; read:string; author:string; title:string; desc:string; href:string; }

const NEWS: Item[] = [
  { tag: "Market Update", date: "Mar 24, 2026", read: "3 min", author: "Market Desk",    title: "NEPSE Crosses 2,850 Mark Amid Strong Hydropower Rally",          desc: "The benchmark index extended gains driven by renewed investor interest in hydropower and banking stocks.",             href: "/news/nepse-2850"     },
  { tag: "Announcement",  date: "Mar 5, 2026",  read: "2 min", author: "Imperial Team",  title: "Imperial Securities Launches Redesigned Mobile Trading App",     desc: "Our revamped mobile app brings enhanced charting, faster order execution, and a cleaner modern interface.",            href: "/news/mobile-app"     },
  { tag: "Regulation",    date: "Feb 25, 2026", read: "4 min", author: "Compliance",     title: "SEBON Issues Updated Margin Lending Guidelines for FY 2083",     desc: "The Securities Board of Nepal released new guidelines for margin lending effective from the next fiscal year.",        href: "/news/sebon-margin"   },
  { tag: "Corporate",     date: "Feb 18, 2026", read: "2 min", author: "Imperial Team",  title: "Annual General Meeting Notice — 27th AGM of Imperial Securities", desc: "The 27th AGM will be held on Chaitra 15, 2080 at the company's registered head office in Kathmandu.",               href: "/news/agm-notice"     },
  { tag: "IPO Alert",     date: "Mar 18, 2026", read: "4 min", author: "Research Team",  title: "Upcoming IPO: XYZ Hydropower Opens Application Window",          desc: "XYZ Hydropower is opening a 3 lakh unit IPO at Rs. 100 per share. Application window opens Chaitra 15.",            href: "/news/xyz-ipo"        },
  { tag: "Economy",       date: "Mar 12, 2026", read: "3 min", author: "Economics Desk", title: "Nepal Remittance Inflows Hit Record High in Fiscal Year 2082",   desc: "Remittance inflows surged to an all-time high, positively impacting liquidity across the Nepali banking sector.",     href: "/news/remittance"     },
];

const BLOGS: Item[] = [
  { tag: "Education", date: "Mar 15, 2026", read: "8 min", author: "Sunil Maharjan",  title: "Understanding NEPSE: A Beginner's Complete Guide",                    desc: "Everything you need to know about Nepal Stock Exchange — from opening an account to placing your first trade.",         href: "/blog/understanding-nepse" },
  { tag: "Analysis",  date: "Mar 10, 2026", read: "6 min", author: "Rajesh Shrestha", title: "Top 5 Sectors to Watch in Nepal's Stock Market in 2026",               desc: "An in-depth analysis of the most promising sectors including hydropower, banking, and microfinance for 2026.",           href: "/blog/top-5-sectors"       },
  { tag: "Guide",     date: "Feb 28, 2026", read: "5 min", author: "Priya Tamang",    title: "Step-by-Step: How to Apply for IPOs Through MeroShare",                desc: "A clear walkthrough of the MeroShare IPO application process, ASBA method, and common first-timer mistakes to avoid.",  href: "/blog/ipo-meroshare"       },
  { tag: "Education", date: "Feb 20, 2026", read: "7 min", author: "Anil Karki",      title: "Fundamental vs Technical Analysis: Which Approach Suits You?",         desc: "A comprehensive comparison of two major investment analysis methodologies and practical guidance on when to use each.",  href: "/blog/analysis-methods"    },
  { tag: "Strategy",  date: "Feb 14, 2026", read: "6 min", author: "Sunil Maharjan",  title: "Dividend Investing Strategy for Long-Term Nepali Investors",           desc: "How to build a portfolio focused on dividend-paying NEPSE-listed stocks to generate steady passive income.",            href: "/blog/dividend-strategy"   },
  { tag: "Education", date: "Feb 5, 2026",  read: "9 min", author: "Priya Tamang",    title: "Risk Management: Protecting Your Portfolio in Volatile Markets",       desc: "Essential techniques every investor should know: stop-loss orders, diversification, position sizing, and rebalancing.",  href: "/blog/risk-management"     },
];

/* ─── Tag badge ─────────────────────────────────────────────── */
function TagBadge({ label, size = "sm" }: { label: string; size?: "sm" | "md" }) {
  const c = TAGS[label] ?? { fg: T.accent, bg: "rgba(59,130,246,0.12)" };
  return (
    <span style={{
      fontSize: size === "md" ? 10.5 : 9, fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: size === "md" ? "4px 10px" : "3px 8px",
      borderRadius: 20, background: c.bg, color: c.fg,
      whiteSpace: "nowrap", border: `1px solid ${c.fg}22`,
    }}>
      {label}
    </span>
  );
}

/* ─── Hero Card (featured / first item) ────────────────────── */
function HeroCard({ item, cta }: { item: Item; cta: string }) {
  const [hov, setHov] = useState(false);
  const img = IMG[item.tag] ?? IMG["Market Update"];
  const tagC = TAGS[item.tag] ?? { fg: T.accent, bg: "rgba(59,130,246,0.12)" };

  return (
    <a
      href={item.href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block", textDecoration: "none",
        position: "relative", overflow: "hidden",
        borderRadius: 16, height: 260,
        transition: "box-shadow 0.3s",
        boxShadow: hov
          ? `0 0 0 1px ${tagC.fg}55, 0 20px 60px rgba(0,0,0,0.6)`
          : "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${img})`,
        backgroundSize: "cover", backgroundPosition: "center",
        transform: hov ? "scale(1.04)" : "scale(1)",
        transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
      }} />

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(6,13,31,0.97) 40%, rgba(6,13,31,0.3) 100%)",
      }} />

      {/* Accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 3, width: hov ? "100%" : "40%",
        background: `linear-gradient(90deg, ${tagC.fg}, transparent)`,
        transition: "width 0.4s ease",
      }} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end", padding: "20px 22px",
      }}>
        <div style={{ marginBottom: 10 }}>
          <TagBadge label={item.tag} size="md" />
        </div>
        <div style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700, fontSize: 18, lineHeight: 1.35,
          color: "#F0F4FF", marginBottom: 8,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {item.title}
        </div>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap: 12 }}>
            <span style={{ fontSize: 11, color: T.txtSec }}>{item.author}</span>
            <span style={{ fontSize: 11, color: T.txtMute }}>·</span>
            <span style={{ fontSize: 11, color: T.txtSec }}>{item.date}</span>
            <span style={{ fontSize: 11, color: T.txtMute }}>·</span>
            <span style={{ fontSize: 11, color: T.txtSec }}>{item.read} read</span>
          </div>
          <span style={{
            fontSize: 12, fontWeight: 700, color: tagC.fg,
            display: "flex", alignItems: "center", gap: 4,
            opacity: hov ? 1 : 0.7, transition: "opacity 0.2s",
          }}>
            {cta}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6h8M7 3l3 3-3 3"/>
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

/* ─── Compact list card ─────────────────────────────────────── */
function ListCard({ item, cta }: { item: Item; cta: string }) {
  const [hov, setHov] = useState(false);
  const img = IMG[item.tag] ?? IMG["Market Update"];
  const tagC = TAGS[item.tag] ?? { fg: T.accent, bg: "rgba(59,130,246,0.12)" };

  return (
    <a
      href={item.href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", gap: 14, textDecoration: "none",
        padding: "14px 20px", alignItems: "center",
        borderBottom: `1px solid ${T.line}`,
        background: hov ? T.cardHov : "transparent",
        transition: "background 0.2s",
        cursor: "pointer",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        flexShrink: 0, width: 70, height: 60,
        borderRadius: 10, overflow: "hidden",
        position: "relative",
        border: `1px solid ${T.border}`,
      }}>
        <img
          src={img}
          alt={item.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hov ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(21,87,192,0.25) 0%, transparent 60%)",
        }} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 5 }}>
          <TagBadge label={item.tag} />
        </div>
        <div style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 600, fontSize: 13, lineHeight: 1.4,
          color: hov ? T.navy : T.txtSec,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
          transition: "color 0.2s", marginBottom: 5,
        }}>
          {item.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10.5, color: T.txtMute }}>{item.date}</span>
          <span style={{ fontSize: 10.5, color: T.txtMute }}>·</span>
          <span style={{ fontSize: 10.5, color: T.txtMute }}>{item.read} read</span>
        </div>
      </div>

      {/* Arrow */}
      <div style={{
        flexShrink: 0,
        opacity: hov ? 1 : 0, transform: hov ? "translateX(0)" : "translateX(-6px)",
        transition: "all 0.2s", color: tagC.fg,
      }}>
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6h8M7 3l3 3-3 3"/>
        </svg>
      </div>
    </a>
  );
}

/* ─── Animated column with hero + list ─────────────────────── */
function NewsColumn({ title, icon, items, dir, ms, cta, href, accentColor }: {
  title: string;
  icon: React.ReactNode;
  items: Item[];
  dir: "up" | "down";
  ms: number;
  cta: string;
  href: string;
  accentColor: string;
}) {
  const [offset, setOffset] = useState(0);
  const total = items.length;
  const LIST_COUNT = 3; // list cards below hero

  useEffect(() => {
    if (total <= 1 + LIST_COUNT) return;
    const id = setInterval(
      () => setOffset(p => dir === "up" ? (p + 1) % total : (p - 1 + total) % total),
      ms
    );
    return () => clearInterval(id);
  }, [total, dir, ms]);

  const hero      = items[offset % total];
  const listItems = Array.from({ length: LIST_COUNT }, (_, i) => items[(offset + 1 + i) % total]);

  return (
    <div style={{
      background: T.card,
      borderRadius: 20,
      border: `1px solid ${T.border}`,
      overflow: "hidden",
      boxShadow: "0 2px 24px rgba(21,87,192,0.08)",
    }}>
      {/* Column header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: `1px solid ${T.line}`,
        background: "#FAFCFF",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: accentColor,
          }}>
            {icon}
          </div>
          <span style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700, fontSize: 16, color: T.navy,
          }}>
            {title}
          </span>
          {/* Live pulse */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
              animation: "pulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: accentColor, letterSpacing: "0.08em" }}>
              LIVE
            </span>
          </div>
        </div>
        <a href={href} style={{
          fontSize: 11.5, fontWeight: 600, color: T.txtSec,
          textDecoration: "none", letterSpacing: "0.04em",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          View all
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6h8M7 3l3 3-3 3"/>
          </svg>
        </a>
      </div>

      {/* Hero */}
      <div style={{ padding: "16px 16px 0" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`hero-${offset}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <HeroCard item={hero} cta={cta} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* List */}
      <div style={{ padding: "8px 0 0" }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {listItems.map((item, i) => (
            <motion.div
              key={`list-${offset}-${i}-${item.href}`}
              initial={{ opacity: 0, x: dir === "up" ? 16 : -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir === "up" ? -16 : 16 }}
              transition={{ duration: 0.32, delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
            >
              <ListCard item={item} cta={cta} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer dots */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "12px 0",
        borderTop: `1px solid ${T.line}`,
      }}>
        {Array.from({ length: Math.min(total, 6) }).map((_, i) => (
          <div key={i} style={{
            width: i === offset % Math.min(total, 6) ? 20 : 5,
            height: 4, borderRadius: 99,
            background: i === offset % Math.min(total, 6) ? accentColor : "#D1D9E6",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Icons ─────────────────────────────────────────────────── */
const BellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2a6 6 0 0 1 6 6c0 3.5 1.5 5 1.5 5h-15S4 11.5 4 8a6 6 0 0 1 6-6z"/>
    <path d="M8.5 17a1.5 1.5 0 0 0 3 0"/>
  </svg>
);

const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11H5a2 2 0 0 1-2-2V5z"/>
    <path d="M3 14h14M7 3v11"/>
  </svg>
);

/* ─── Main ──────────────────────────────────────────────────── */
export default function NewsSection() {
  return (
    <section id="news" style={{
      background: T.bg,
      padding: "80px 0 90px",
      fontFamily: "var(--font-body)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle background accent */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(ellipse 900px 500px at 5% 0%, rgba(21,87,192,0.06) 0%, transparent 70%)`,
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", position: "relative" }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 32 }}
        >
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase", color: T.accent,
            marginBottom: 14,
            padding: "5px 14px", borderRadius: 99,
            background: "rgba(21,87,192,0.08)",
            border: "1px solid rgba(21,87,192,0.18)",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent, boxShadow: `0 0 6px ${T.accent}` }} />
            Market Intelligence
          </div>

          <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700,
              lineHeight: 1.15, color: T.navy, margin: 0,
            }}>
              Market Insights{" "}
              <span style={{
                background: "linear-gradient(135deg, #1557C0, #2563EB)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                & News
              </span>
            </h2>
        </motion.div>

        {/* Two columns */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 24, alignItems: "start",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <NewsColumn
              title="Latest News"
              icon={<BellIcon />}
              items={NEWS}
              dir="up"
              ms={3200}
              cta="Read more"
              href="/news"
              accentColor="#1557C0"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.22 }}
          >
            <NewsColumn
              title="Blog & Insights"
              icon={<BookIcon />}
              items={BLOGS}
              dir="down"
              ms={3900}
              cta="Read article"
              href="/blog"
              accentColor="#F59E0B"
            />
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 768px) {
          #news > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}