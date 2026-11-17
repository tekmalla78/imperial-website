import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { useBranches, type BranchNavItem } from "@/cms/site-chrome";

export default function BranchesSection({ items }: { items?: BranchNavItem[] }) {
  const fromChrome = useBranches();
  const list = items && items.length > 0 ? items : fromChrome;

  return (
    <section id="branches" className="bg-white px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-heading text-[clamp(24px,3vw,40px)] font-extrabold leading-[1.2] text-foreground">
            Our Branches Across <span className="text-brand-green-dk">Nepal</span>
          </h2>
          <p className="mt-3 text-[15px] leading-[1.72] text-brand-gray">
            Visit a branch for in-person support, account opening, and advisory services.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-2 sm:gap-[18px] lg:grid-cols-3">
          {list.map((b) => (
            <Link
              key={b.slug}
              to="/branches/$slug"
              params={{ slug: b.slug }}
              className="group block rounded-lg border border-border bg-white p-3 sm:p-5 transition-colors hover:border-brand-blue hover:shadow-[0_4px_24px_rgba(21,87,192,.10)]"
            >
              <h4 className="mb-1 text-[12px] font-bold leading-snug text-foreground sm:text-[14.5px]">{b.name}</h4>
              <p className="text-[11px] leading-relaxed text-brand-gray sm:text-[12.5px]">
                {b.addr}
                <br />
                <span className="mt-1 inline-flex items-center gap-1">
                  <Phone className="h-3 w-3 shrink-0 text-brand-gray" strokeWidth={2} />
                  {b.phone}
                </span>
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue sm:mt-2 sm:text-[12.5px]">
                View Branch{" "}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 sm:h-3.5 sm:w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
