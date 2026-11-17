"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  faqCategories,
  type Faq,
  type FaqCategory,
  type FaqLink,
} from "../data/faqs";
import { CmsHtml } from "@/components/CmsHtml";

function FaqLinkItem({ link }: { link: FaqLink }) {
  const className =
    "inline-flex items-center gap-1 rounded-md bg-brand-blue-lt/60 px-2.5 py-1 text-[12px] font-semibold text-brand-blue transition-colors hover:bg-brand-blue-lt";

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {link.label}
        <ArrowRight className="h-3 w-3" />
      </a>
    );
  }

  if (link.href.includes("#")) {
    const [path, hash] = link.href.split("#");
    return (
      <Link to={path || "/"} hash={hash} className={className}>
        {link.label}
        <ArrowRight className="h-3 w-3" />
      </Link>
    );
  }

  return (
    <Link to={link.href} className={className}>
      {link.label}
      <ArrowRight className="h-3 w-3" />
    </Link>
  );
}

function FaqAnswer({ faq }: { faq: Faq }) {
  return (
    <div className="space-y-3">
      <CmsHtml
        value={faq.a}
        className="prose prose-sm max-w-none text-[14px] leading-[1.72] text-brand-gray md:text-[15px] prose-a:text-brand-blue"
      />
      {faq.links && faq.links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {faq.links.map((link) => (
            <FaqLinkItem key={`${link.href}-${link.label}`} link={link} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryBlock({
  category,
  openItem,
  onOpenChange,
  setRef,
}: {
  category: FaqCategory;
  openItem?: string;
  onOpenChange: (value: string) => void;
  setRef: (el: HTMLElement | null) => void;
}) {
  return (
    <div
      id={category.id}
      ref={setRef}
      className="scroll-mt-36 lg:scroll-mt-28"
    >
      <h2 className="mb-4 font-heading text-[clamp(1.125rem,2vw,1.375rem)] font-extrabold text-foreground">
        {category.name}
      </h2>
      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={onOpenChange}
      >
        {category.faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            id={`${category.id}-${faq.id}`}
            value={faq.id}
            className="border-b border-border/60 last:border-0"
          >
            <AccordionTrigger className="py-4 text-[14px] font-semibold text-foreground hover:no-underline md:text-[15px]">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent>
              <FaqAnswer faq={faq} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default function FAQsSection({ categories = faqCategories }: { categories?: FaqCategory[] }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openItems, setOpenItems] = useState<Record<string, string>>({});
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const isScrollingRef = useRef(false);

  const registerCategory = useCallback(
    (categoryId: string) => (el: HTMLElement | null) => {
      categoryRefs.current[categoryId] = el;
    },
    [],
  );

  useEffect(() => {
    const updateActive = () => {
      if (isScrollingRef.current) return;

      const marker = window.innerHeight * 0.42;
      let closest = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      categories.forEach((cat, index) => {
        const el = categoryRefs.current[cat.id];
        if (!el) return;

        const { top, bottom } = el.getBoundingClientRect();
        if (bottom < 0 || top > window.innerHeight) return;

        const center = (top + bottom) / 2;
        const distance = Math.abs(center - marker);
        if (distance < minDistance) {
          minDistance = distance;
          closest = index;
        }
      });

      setActiveCategory(closest);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [categories]);

  const scrollToCategory = (categoryId: string) => {
    const el = categoryRefs.current[categoryId] ?? document.getElementById(categoryId);
    if (!el) return;

    const index = categories.findIndex((cat) => cat.id === categoryId);
    if (index >= 0) setActiveCategory(index);

    isScrollingRef.current = true;
    const offset = window.innerWidth >= 1024 ? 112 : 168;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });

    window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  };

  return (
    <>
      <section className="relative bg-gradient-to-b from-brand-gray-lt via-brand-gray-lt/50 to-white py-14 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-brand-blue/[0.06] blur-3xl"
        />

        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-[2px] text-brand-blue">
              Help Center
            </p>
            <h2 className="font-heading text-[clamp(24px,3vw,36px)] font-extrabold leading-[1.2] text-foreground">
              Common questions, clear answers
            </h2>
            <p className="mt-3 text-[14px] leading-[1.72] text-brand-gray md:text-[15px]">
              Browse by topic — account opening, trading, IPOs, and support.
            </p>
          </div>

          <div className="sticky top-[4.5rem] z-20 -mx-4 mt-8 bg-brand-gray-lt/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden">
            <div className="flex gap-2">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollToCategory(cat.id)}
                  className={`relative flex-1 rounded-md py-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                    activeCategory === i ? "text-brand-blue" : "text-brand-gray"
                  }`}
                >
                  {activeCategory === i && (
                    <span className="absolute inset-0 rounded-md bg-white/80" />
                  )}
                  <span className="relative line-clamp-1">{cat.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:items-start lg:gap-x-16 xl:gap-x-24">
            <nav
              className="sticky top-24 z-10 hidden self-start lg:block"
              aria-label="FAQ categories"
            >
              <ul className="space-y-1">
                {categories.map((cat, i) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => scrollToCategory(cat.id)}
                      className={`relative w-full py-2.5 text-left text-[11px] font-bold uppercase tracking-[2px] transition-colors ${
                        activeCategory === i
                          ? "text-brand-blue"
                          : "text-brand-gray hover:text-foreground"
                      }`}
                    >
                      {activeCategory === i && (
                        <span className="absolute -left-3 h-6 w-0.5 rounded-full bg-brand-green-dk" />
                      )}
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-12 md:space-y-14">
              {categories.map((cat) => (
                <CategoryBlock
                  key={cat.id}
                  category={cat}
                  openItem={openItems[cat.id]}
                  onOpenChange={(value) =>
                    setOpenItems((prev) => ({ ...prev, [cat.id]: value }))
                  }
                  setRef={registerCategory(cat.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-brand-blue-dk via-brand-blue to-brand-blue-dk py-12 md:py-14">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-xl font-extrabold text-white md:text-2xl">
              Still need help?
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-white/75 md:text-[15px]">
              Our support team can help with account setup, trading, and technical
              issues during business hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/support"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand-blue-dk transition-transform hover:-translate-y-0.5"
            >
              Support center
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Contact us
            </Link>
            <Link
              to="/grievance"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Submit grievance
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
