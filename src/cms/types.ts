import liveSeed from "./live-seed.json";
import { DEFAULT_PAYMENT_METHODS } from "./payment-methods";

export type Settings = {
  siteName: string;
  tagline: string;
  foundingYear: string;
  brokerNo: string;
  phone: string;
  phoneHref: string;
  email: string;
  hours: string;
  headOffice: string;
  registrationUrl: string;
  tmsUrl: string;
  meroshareUrl: string;
  clientLoginUrl: string;
  noticeText: string;
  noticeCta: string;
  noticeHref: string;
  footerAbout: string;
  defaultTitle: string;
  defaultDescription: string;
};

export type Homepage = {
  kicker: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  stats: string;
  cards: string;
};

export type AboutPage = {
  heroTitle: string;
  heroSubtitle: string;
  heroEyebrow: string;
  mission: string;
  vision: string;
  values: string;
  journeyEyebrow: string;
  journeyTitlePrefix: string;
  journeyTitleAccent: string;
  journeyTitleSuffix: string;
  introBody: string;
  quoteText: string;
  introBodyAfter: string;
  timeline: string;
  advantagesEyebrow: string;
  advantagesTitle: string;
  advantages: string;
  leadershipEyebrow: string;
  leadershipTitle: string;
  leadershipBody: string;
  board: string;
  regulationTitle: string;
  regulationBody: string;
  regulationBadges: string;
  ctaHeadline: string;
  ctaBody: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  seoTitle: string;
  seoDescription: string;
};

export type ContactPage = {
  heroTitle: string;
  heroSubtitle: string;
  formIntro: string;
  seoTitle: string;
  seoDescription: string;
};

export type GrievancePage = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  sectionBadge: string;
  sectionTitle: string;
  sectionBody: string;
  officerName: string;
  officerEmail: string;
  officerPhone: string;
  officerPhoneHref: string;
  officerAddress: string;
  officerHours: string;
  officerPhoto: string;
  steps: string;
  formTitle: string;
  formIntro: string;
  seoTitle: string;
  seoDescription: string;
};

export type Navigation = {
  resourcesLinks: string;
  servicesLinks: string;
  downloadLabel: string;
  downloadHref: string;
  /** Extra header menus (JSON). Empty by default — add when needed. */
  customMenus: string;
  loginLinks: string;
  openAccountLinks: string;
  footerCompanyLinks: string;
  footerUsefulLinks: string;
  footerLegalLinks: string;
  footerSocialLinks: string;
};

export type FaqCategories = {
  categories: string;
};

export type PaymentBanking = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  methods: string;
};

export type CmsPrimitive = string | number | boolean | null;
export type CmsData = Record<string, CmsPrimitive>;

export type CmsRecord = {
  id: string;
  collection: string;
  data: CmsData;
  updatedAt: number;
};

export const DEFAULT_SETTINGS: Settings = liveSeed.settings;
export const DEFAULT_HOMEPAGE: Homepage = liveSeed.homepage;

export const DEFAULT_ABOUT: AboutPage = {
  heroTitle: "Building Nepal's Most Trusted Investment Partner",
  heroSubtitle:
    "Imperial Securities Company Limited — at the forefront of Nepal's capital market since 2007.",
  heroEyebrow: "Established 2007 · Stock Broker No. 45",
  mission: liveSeed.foundation.mission,
  vision: liveSeed.foundation.vision,
  values: liveSeed.foundation.values,
  journeyEyebrow: "Our Journey",
  journeyTitlePrefix: "Two Decades of",
  journeyTitleAccent: "Excellence",
  journeyTitleSuffix: "in Nepal's Capital Market",
  introBody: [
    "Imperial Securities Company Limited was founded in 2007 with a singular vision — to make Nepal's stock market accessible to ordinary citizens. What started as a small brokerage firm with a handful of clients has grown into one of Nepal's most trusted and respected securities companies.",
    "Over the past two decades, we have witnessed NEPSE's transformation from a paper-based exchange to a fully electronic trading system. At every step, Imperial Securities has been at the forefront — adopting new technology, expanding our branch network, and continuously improving services for our clients.",
  ].join("\n\n"),
  quoteText:
    "Our success is measured not by our own growth, but by the financial growth and security we create for every one of our 200,000+ clients across Nepal.",
  introBodyAfter:
    "Today, with 6 branches across Nepal, a state-of-the-art digital trading platform, and a team of dedicated professionals, we continue our mission of building Nepal's most trusted investment ecosystem.",
  timeline: JSON.stringify([
    {
      year: "2007",
      title: "Company Founded",
      desc: "Founded in Kathmandu in 2007 as a Private Limited Company, marking the beginning of the company’s journey in Nepal’s securities and capital market industry.",
      icon: "/uploads/timeline-founded.png",
    },
    {
      year: "2011",
      title: "SEBON Member License Obtained",
      desc: "In 2011, the company obtained its membership and license from the Securities Board of Nepal (SEBON), allowing it to operate as a licensed securities market intermediary in accordance with Nepal’s regulatory framework.",
      icon: "/uploads/timeline-sebon.png",
    },
    {
      year: "2011",
      title: "NEPSE Membership",
      desc: "The company became a member of Nepal Stock Exchange (NEPSE) in 2011, enabling it to participate in securities trading activities on Nepal’s stock exchange.",
      icon: "/uploads/timeline-nepse.png",
    },
    {
      year: "2015",
      title: "CDSC Membership",
      desc: "In 2015, the company became a member of CDS and Clearing Limited (CDSC), strengthening its ability to provide securities settlement and related depository services to investors.",
      icon: "/uploads/timeline-cdsc.png",
    },
    {
      year: "2016",
      title: "Dematerialized Trading Introduced",
      desc: "From 2016, transactions in listed securities became mandatory in dematerialized (Demat) form for the regular market. This effectively ended the use of physical share certificates for regular trading and accelerated the digital transformation of Nepal’s securities market.",
      icon: "/uploads/timeline-demat.png",
    },
    {
      year: "2017",
      title: "First Branch – Nepalgunj",
      desc: "The company expanded its physical presence by opening its first branch in Nepalgunj, making securities and investment-related services more accessible to investors outside Kathmandu.",
      icon: "/uploads/timeline-branch.webp",
    },
    {
      year: "2018",
      title: "Online Trading System Launched",
      desc: "In 2018, the company launched its Online Trading System, enabling clients to participate in the securities market digitally and making trading more convenient and accessible.",
      icon: "/uploads/timeline-digital.png",
    },
    {
      year: "2019",
      title: "Second Branch – Surkhet",
      desc: "The company continued its regional expansion by opening its second branch in Surkhet, extending its services to investors in the Karnali region.",
      icon: "/uploads/timeline-branch.webp",
    },
    {
      year: "2023",
      title: "Converted to Public Limited Company",
      desc: "In 2023, the company was converted from a Private Limited Company to a Public Limited Company, representing an important milestone in its corporate development and growth.",
      icon: "/uploads/timeline-founded.png",
    },
    {
      year: "2023",
      title: "Third Branch – Dhading",
      desc: "The company opened its third branch in Dhading, further expanding its geographical reach and bringing its services closer to investors outside major urban centers.",
      icon: "/uploads/timeline-branch.webp",
    },
    {
      year: "2023",
      title: "Fourth Branch – Bhaktapur",
      desc: "In the same year, the company opened its fourth branch in Bhaktapur, strengthening its presence within the Kathmandu Valley.",
      icon: "/uploads/timeline-branch.webp",
    },
    {
      year: "2025",
      title: "200,000+ Active Investors",
      desc: "By 2025, the company had grown to serve more than 200,000 active investors across Nepal, supported by six branches and comprehensive digital services, establishing itself as a major and trusted securities platform.",
      icon: "/uploads/timeline-growth.png",
    },
    {
      year: "2026",
      title: "Fifth Branch – Pokhara",
      desc: "In 2026, the company expanded further by opening its fifth branch in Pokhara, strengthening its presence in one of Nepal’s major commercial and financial centers outside Kathmandu.",
      icon: "/uploads/timeline-branch.webp",
    },
  ]),
  advantagesEyebrow: "Our Advantage",
  advantagesTitle: "Why 200,000+ Investors Choose Imperial Securities",
  advantages: JSON.stringify([
    {
      title: "Real-Time Trading",
      desc: "Lightning-fast order execution with live NEPSE rate feeds, charts, and depth-of-market information in our trading app.",
    },
    {
      title: "SEBON Regulated",
      desc: "Fully licensed and regulated by SEBON and NEPSE. Your funds, shares, and data are protected under Nepal's financial regulations.",
    },
    {
      title: "Mobile App",
      desc: "Complete trading platform on Android & iOS. Buy/sell shares, apply for IPOs, check portfolio — all from your phone.",
    },
    {
      title: "Expert Support",
      desc: "Dedicated relationship managers and market experts available during trading hours to guide your investment decisions.",
    },
    {
      title: "Fast Settlement",
      desc: "T+3 settlement cycle. Fund your account with eSewa, Khalti, ConnectIPS, or direct bank transfer — reflected instantly.",
    },
    {
      title: "Research & Analysis",
      desc: "Daily market reports, company fundamentals, IPO analysis, and sector insights from our in-house research team.",
    },
    {
      title: "6 Branch Network",
      desc: "Physical branches across Nepal for in-person support — Kathmandu, Bhaktapur, Dhading, Pokhara, Surkhet, and Nepalgunj.",
    },
    {
      title: "Digital-First",
      desc: "100% online account opening, paperless KYC, online IPO applications, and digital statements. No branch visit needed.",
    },
  ]),
  leadershipEyebrow: "Leadership Team",
  leadershipTitle: "Board of Directors",
  leadershipBody:
    "Meet the experienced leaders guiding Imperial Securities through strategic planning, governance, and long-term growth.",
  board: JSON.stringify([
    {
      name: "Bhaktiram Ghimire",
      role: "Chairman",
      email: "sbrghimire@imperialsecurities.com.np",
      phone: "+977 98XXXXXXXX",
      linkedin: "https://linkedin.com/in/bhaktiram-ghimire",
      bio: "25+ years experience in capital markets and financial services.",
      photo: "/uploads/board-bhaktiram.png",
    },
    {
      name: "Sitaram Adhikari",
      role: "Vice Chairperson",
      email: "sitaram.adhikari@imperialsecurities.com.np",
      phone: "+977 98XXXXXXXX",
      linkedin: "https://linkedin.com/in/sitaram-adhikari",
      bio: "Former banking executive with expertise in corporate governance.",
      photo: "/uploads/board-sitaram.png",
    },
    {
      name: "Rabikala Pageni",
      role: "Director",
      email: "rabikala@imperialsecurities.com.np",
      phone: "+977 98XXXXXXXX",
      linkedin: "https://linkedin.com/in/rabikala-pageni",
      bio: "Chartered accountant with deep experience in audit and compliance.",
      photo: "/uploads/board-rabikala.png",
    },
    {
      name: "Ankit Paudel",
      role: "Director",
      email: "ankit@imperialsecurities.com.np",
      phone: "+977 98XXXXXXXX",
      linkedin: "https://linkedin.com/in/ankit-paudel",
      bio: "Investment management professional with 15+ years in portfolio strategy.",
      photo: "",
    },
  ]),
  regulationTitle: "Fully Licensed & Regulated",
  regulationBody:
    "Imperial Securities Company Limited operates under full regulatory oversight of SEBON, NEPSE and CDSC — ensuring the highest standards of compliance, transparency, and client protection.",
  regulationBadges: JSON.stringify([
    { title: "No. 45", desc: "Stock Broker No." },
    { title: "SEBON", desc: "Registered & Licensed" },
    { title: "NEPSE", desc: "Member Since" },
    { title: "CDSC", desc: "DP Authorized" },
  ]),
  ctaHeadline: "Ready to Start Your Investment Journey?",
  ctaBody:
    "Join 200,000+ Nepali investors who trust Imperial Securities. Open your free account in under 10 minutes — 100% online, no branch visit needed.",
  ctaLabel: "Open Free Account",
  ctaHref: liveSeed.settings.registrationUrl,
  secondaryCtaLabel: "Talk to an Advisor",
  secondaryCtaHref: "/contact",
  seoTitle: "About Us — Imperial Securities | Stock Broker No. 45",
  seoDescription:
    "Building Nepal's most trusted investment partner since 2007. SEBON licensed broker No. 45, NEPSE member, CDSC depository participant.",
};

export const DEFAULT_CONTACT: ContactPage = {
  heroTitle: "Contact Us",
  heroSubtitle: "Questions about accounts, trading, or branches — reach our team during business hours.",
  formIntro: "Send a message and our team will get back during business hours.",
  seoTitle: "Contact Us — Imperial Securities",
  seoDescription:
    "Get in touch with Imperial Securities. Visit our head office in Anamnagar, Hanumansthan, Kathmandu or reach us by phone and email.",
};

export const DEFAULT_GRIEVANCE: GrievancePage = {
  heroEyebrow: "Client Care · SEBON Compliant",
  heroTitle: "Grievance Handling",
  heroSubtitle:
    "Your concerns matter. Submit your complaint and our dedicated Grievance Officer will respond promptly.",
  sectionBadge: "Grievance Handling Office",
  sectionTitle: "We Take Every Concern Seriously",
  sectionBody:
    "At Imperial Securities, transparency and client trust are at the core of everything we do. Our Grievance Handling Office ensures every complaint is acknowledged, investigated, and resolved in line with SEBON guidelines.",
  officerName: "Mr. Lekhnath Paudel",
  officerEmail: "gunaso@imperialsecurities.com.np",
  officerPhone: "01-5970145",
  officerPhoneHref: "tel:015970145",
  officerAddress: "Anamnagar-29, Kathmandu, Nepal",
  officerHours: "Mon – Fri, 09:30 AM – 6:00 PM",
  officerPhoto: "/uploads/grievance-officer.png",
  steps: [
    "01 | Submit Complaint | Fill the form with details of your grievance.",
    "02 | Acknowledgement | Receive a confirmation within 2 working days.",
    "03 | Investigation | Our team reviews and investigates the issue.",
    "04 | Resolution | Final response within 15 working days.",
  ].join("\n"),
  formTitle: "Submit Your Grievance",
  formIntro: "Your submission is confidential and reviewed by our Grievance Officer.",
  seoTitle: "Grievance — Imperial Securities",
  seoDescription:
    "Submit your complaint or grievance to Imperial Securities. Our Grievance Handling Office is here to resolve your concerns promptly.",
};

export const DEFAULT_NAVIGATION: Navigation = {
  resourcesLinks: [
    "Company | About Us | /about",
    "Company | Chairman's Message | /chairman-message",
    "Company | Board of Directors | /about#leadership",
    "Company | Management Team | /management-team",
    "Company | Our Team | /our-team",
    "Help | FAQ's | /faqs",
    "Help | Contact Us | /contact",
    "Help | Support | /support",
    "Education | Blog | /blog",
    "Education | News & Events | /news-events",
  ].join("\n"),
  servicesLinks: [
    "Stock Brokerage | /services/stock-brokerage",
    "Depository Services (DP) | /services/depository-services",
    "Margin Trading | /services/margin-trading",
    "Portfolio Management | /services/portfolio-management",
    "IPO / FPO Application | /services/ipo-fpo",
    "Research & Advisory | /services/research-advisory",
  ].join("\n"),
  downloadLabel: "Download",
  downloadHref: "/downloads",
  customMenus: "[]",
  loginLinks: [
    "Client Login | Access your portfolio | https://client45.cmt.com.np",
    "Meroshare Login | IPO & share management | https://meroshare.cdsc.com.np/",
    "TMS Login | Live trading terminal | https://tms45.nepsetms.com.np",
  ].join("\n"),
  openAccountLinks: [
    "TMS / Broker Account | Trade on NEPSE via broker | https://ckyc.imperialsecurities.com.np/auth/type-selection",
    "Demat Account | Hold your securities digitally | https://ckyc.cdsc.com.np/registration",
    "Both TMS & Demat | Complete trading setup | https://ckyc.imperialsecurities.com.np/auth/type-selection",
  ].join("\n"),
  footerCompanyLinks: [
    "About Us | /about",
    "Services | /services/stock-brokerage",
    "Downloads | /downloads",
    "FAQs | /faqs",
    "Contact Us | /contact",
    "Grievance | /grievance",
  ].join("\n"),
  footerUsefulLinks: [
    "Securities Board of Nepal | https://www.sebon.gov.np",
    "Nepal Stock Exchange | https://www.nepalstock.com.np",
    "CDS and Clearing | https://www.cdsc.com.np",
    "UN Consolidated Sanction List | https://www.un.org/securitycouncil/content/un-sc-consolidated-list",
    "MOHA Sanction List | https://moha.gov.np",
  ].join("\n"),
  footerLegalLinks: [
    "Privacy Policy | /privacy-policy",
    "Terms of Service | /terms-of-service",
    "Disclaimer | /disclaimer",
    "SEBON Guidelines | /sebon-guidelines",
    "Grievance | /grievance",
  ].join("\n"),
  footerSocialLinks: [
    "Facebook | https://www.facebook.com/imperial45",
    "Instagram | https://www.instagram.com/imperial_securities_45",
    "Linktree | https://linktr.ee/45imperial",
  ].join("\n"),
};

export const DEFAULT_FAQ_CATEGORIES: FaqCategories = {
  categories: [
    "Account & Registration",
    "Trading",
    "IPO & Rights Shares",
    "Support & Services",
  ].join("\n"),
};

export const DEFAULT_PAYMENT_BANKING: PaymentBanking = {
  eyebrow: "Supported Platforms",
  title: "Payment &",
  titleAccent: "Banking",
  subtitle: "Fund your trading account through Nepal's payment gateways and partner banks.",
  methods: JSON.stringify(DEFAULT_PAYMENT_METHODS),
};
