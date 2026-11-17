import { Phone, Mail, Clock, FileText } from "lucide-react";
import { useSettings } from "@/cms/site-chrome";

export default function TopBar() {
  const settings = useSettings();

  return (
    <div className="bg-gradient-to-r from-brand-blue-dk via-brand-blue to-brand-blue py-1 text-[11px] text-white/85 sm:text-[11.5px]">
      <style>{`
        @keyframes blink-guidelines {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .guidelines-blink {
          animation: blink-guidelines 1.1s step-start infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .guidelines-blink { animation: none; }
        }
      `}</style>

      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <FileText className="h-3 w-3 shrink-0 text-yellow-300" />
          <span className="hidden font-medium text-white/90 sm:inline">{settings.noticeText}</span>
          <span className="font-medium text-white/90 sm:hidden">{settings.noticeCta}</span>
          <a
            href={settings.noticeHref}
            className="guidelines-blink ml-1 rounded bg-brand-green px-2 py-0.5 text-[10.5px] font-bold tracking-wide text-white no-underline whitespace-nowrap hover:bg-brand-green-dk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            {settings.noticeCta}
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:gap-6">
          <a
            href={settings.phoneHref || `tel:${settings.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
          >
            <Phone className="h-3 w-3" /> {settings.phone}
          </a>
          <a
            href={`mailto:${settings.email}`}
            className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-white sm:flex"
          >
            <Mail className="h-3 w-3" /> {settings.email}
          </a>
          <span className="flex items-center gap-1.5 text-white/80">
            <Clock className="h-3 w-3" /> {settings.hours}
          </span>
        </div>
      </div>
    </div>
  );
}
