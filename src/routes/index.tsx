import { createFileRoute } from "@tanstack/react-router";
import TopBar from "../components/TopBar";
import SiteHeader from "../components/SiteHeader";
import SimpleHero from "../components/SimpleHero";
import ContinueSection from "../components/ContinueSection";
import ServicesSection from "../components/ServicesSection";
import ToolsSection from "../components/ToolsSection";
import PaymentBankingSection from "../components/PaymentBankingSection";
import BranchesSection from "../components/BranchesSection";
import BlogSection from "../components/BlogSection";
import CTASection from "../components/CTASection";
import SiteFooter from "../components/SiteFooter";
import { publicBootFn } from "@/cms/functions";
import { seoMeta } from "@/cms/seo";

export const Route = createFileRoute("/")({
  loader: () => publicBootFn(),
  component: Index,
  head: ({ loaderData }) => ({
    meta: seoMeta(
      loaderData?.settings.defaultTitle ?? "Imperial Securities — Stock Broker No. 45 | NEPSE",
      loaderData?.settings.defaultDescription ??
        "Imperial Securities Company Limited is a NEPSE member and CDSC depository participant in Anamnagar, Kathmandu. Broker No. 45.",
    ),
  }),
});

function Index() {
  const { homepage, posts, paymentBanking } = Route.useLoaderData();

  return (
    <div className="[overflow-x:clip] bg-white">
      <TopBar />
      <SiteHeader compact flushHero />
      <SimpleHero homepage={homepage} />
      <ContinueSection />

      <ServicesSection />

      <BranchesSection />

      <CTASection />
      <BlogSection posts={posts} />
      <PaymentBankingSection data={paymentBanking} />
      <ToolsSection />

      <SiteFooter />
    </div>
  );
}
