import logoFooterUrl from "@/assets/footerlogo.png";
import { splitPairs } from "@/cms/collections";
import { useNavigation, useSettings } from "@/cms/site-chrome";
import { DEFAULT_NAVIGATION } from "@/cms/types";
import type { ReactNode } from "react";

function useQuickLinks() {
  const settings = useSettings();
  return [
    { label: "TMS Login", href: settings.tmsUrl },
    { label: "Client Login", href: settings.clientLoginUrl },
    { label: "Meroshare Login", href: settings.meroshareUrl },
    { label: "IPO Check", href: "https://iporesult.cdsc.com.np" },
    { label: "Open Online Account", href: settings.registrationUrl },
  ].filter((link) => Boolean(link.href));
}

function socialIcon(label: string): ReactNode {
  const key = label.trim().toLowerCase();
  if (key.includes("facebook")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (key.includes("instagram")) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (key.includes("linktree")) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    );
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function toLinks(value: string | undefined, fallback: string) {
  return splitPairs(value || fallback)
    .filter((row) => row.title && row.desc)
    .map((row) => ({ label: row.title, href: row.desc }));
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function SiteFooter() {
  const settings = useSettings();
  const navigation = useNavigation();
  const quickLinks = useQuickLinks();
  const companyLinks = toLinks(navigation.footerCompanyLinks, DEFAULT_NAVIGATION.footerCompanyLinks);
  const usefulLinks = toLinks(navigation.footerUsefulLinks, DEFAULT_NAVIGATION.footerUsefulLinks);
  const legalLinks = toLinks(navigation.footerLegalLinks, DEFAULT_NAVIGATION.footerLegalLinks);
  const socials = toLinks(navigation.footerSocialLinks, DEFAULT_NAVIGATION.footerSocialLinks);

  return (
    <>
      <style>{`
        /* ─── Base ─────────────────────────────── */
        .ft-root {
          background: var(--brand-blue-lt);
          font-family: var(--font-body);
          color: var(--brand-gray);
        }
        .ft-wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 28px;
        }

        /* ─── ROW 1: Logo | Contact | Socials ── */
        .ft-row1 {
          display: grid;
          grid-template-columns: 260px 1fr auto;
          gap: 56px;
          align-items: center;
          padding: 48px 0 36px;
          border-bottom: 1px solid var(--border);
        }

        /* Logo */
        .ft-logo img { height: 64px; width: auto; display: block; }
        .ft-tagline {
          margin-top: 14px;
          font-size: 13px;
          line-height: 1.72;
          color: var(--muted-foreground);
          max-width: 240px;
        }

        /* Contact */
        .ft-contact-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--brand-blue);
          margin-bottom: 14px;
        }
        .ft-contact-row {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13.5px;
          color: var(--foreground);
          margin-bottom: 9px;
        }
        .ft-contact-row:last-child { margin-bottom: 0; }
        .ft-contact-row svg { color: var(--brand-blue); flex-shrink: 0; }
        .ft-contact-row a {
          color: var(--foreground);
          text-decoration: none;
          transition: color 0.2s;
        }
        .ft-contact-row a:hover { color: var(--brand-blue); }

        /* Socials */
        .ft-socials { display: flex; gap: 8px; align-items: center; }
        .ft-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--brand-blue);
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .ft-social-btn:hover {
          background: var(--brand-blue);
          border-color: var(--brand-blue);
          color: white;
        }

        /* ─── ROW 2: 4 columns ── */
        .ft-row2 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          padding: 40px 0 36px;
          border-bottom: 1px solid var(--border);
        }
        .ft-col-heading {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--brand-blue);
          margin-bottom: 16px;
        }
        .ft-link-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .ft-link-list a {
          display: block;
          padding: 4px 0;
          font-size: 13.5px;
          color: var(--foreground);
          text-decoration: none;
          transition: color 0.2s;
        }
        .ft-link-list a:hover { color: var(--brand-blue); }

        /* ─── Bottom ── */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 0 28px;
          flex-wrap: wrap;
        }
        .ft-copy {
          margin: 0;
          font-size: 12.5px;
          color: var(--muted-foreground);
        }
        .ft-badges { display: flex; flex-wrap: wrap; gap: 8px; }
        .ft-badge {
          font-size: 11px;
          font-weight: 600;
          color: var(--brand-blue-dk);
          background: white;
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 4px 10px;
        }

        @media (max-width: 960px) {
          .ft-row1 {
            grid-template-columns: 1fr;
            gap: 28px;
            text-align: left;
          }
          .ft-socials { justify-content: flex-start; }
          .ft-row2 {
            grid-template-columns: 1fr 1fr;
            gap: 28px 24px;
          }
        }
        @media (max-width: 560px) {
          .ft-wrap { padding: 0 18px; }
          .ft-row2 { grid-template-columns: 1fr; gap: 24px; }
          .ft-company-links a { font-size: 12px; }
          .ft-link-list a { font-size: 12px; }
          .ft-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .ft-badges { justify-content: flex-start; }
        }
      `}</style>

      <footer className="ft-root">
        <div className="ft-wrap">
          <div className="ft-row1">
            <div className="ft-logo">
              <a href="/">
                <img src={logoFooterUrl} alt="Imperial Securities" decoding="async" loading="lazy" />
              </a>
              <p className="ft-tagline">{settings.footerAbout}</p>
            </div>

            <div>
              <div className="ft-contact-label">Get In Touch</div>
              <div className="ft-contact-row">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                  <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 7 3a1.5 1.5 0 0 1 0 3z" />
                </svg>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.headOffice || "Anamnagar, Kathmandu")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {settings.headOffice}
                </a>
              </div>
              <div className="ft-contact-row">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                  <path d="M2.5 2h2.3l1 2.5-1.3 1.3a8.5 8.5 0 0 0 3.7 3.7L9.5 8.2 12 9.2v2.3A1.5 1.5 0 0 1 10.5 13C5.25 13 1 8.75 1 3.5A1.5 1.5 0 0 1 2.5 2z" />
                </svg>
                <a href={settings.phoneHref || `tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
              </div>
              <div className="ft-contact-row">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                  <rect x="1" y="3" width="12" height="8" rx="1" />
                  <path d="M1 4l6 4.5L13 4" strokeLinecap="round" />
                </svg>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </div>
            </div>

            <div className="ft-socials">
              {socials.map((s) => (
                <a
                  key={`${s.label}-${s.href}`}
                  href={s.href}
                  aria-label={s.label}
                  className="ft-social-btn"
                  target={isExternal(s.href) ? "_blank" : undefined}
                  rel={isExternal(s.href) ? "noopener noreferrer" : undefined}
                >
                  {socialIcon(s.label)}
                </a>
              ))}
            </div>
          </div>

          <div className="ft-row2">
            <div>
              <div className="ft-col-heading">Company Overview</div>
              <ul className="ft-link-list ft-company-links">
                {companyLinks.map((l) => (
                  <li key={`${l.label}-${l.href}`}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="ft-col-heading">Quick Links</div>
              <ul className="ft-link-list">
                {quickLinks.map((l) => (
                  <li key={`${l.label}-${l.href}`}>
                    <a
                      href={l.href}
                      target={isExternal(l.href) ? "_blank" : undefined}
                      rel={isExternal(l.href) ? "noopener noreferrer" : undefined}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="ft-col-heading">Useful Links</div>
              <ul className="ft-link-list">
                {usefulLinks.map((l) => (
                  <li key={`${l.label}-${l.href}`}>
                    <a
                      href={l.href}
                      target={isExternal(l.href) ? "_blank" : undefined}
                      rel={isExternal(l.href) ? "noopener noreferrer" : undefined}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="ft-col-heading">Legal</div>
              <ul className="ft-link-list">
                {legalLinks.map((l) => (
                  <li key={`${l.label}-${l.href}`}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ft-bottom">
            <p className="ft-copy">
              © {new Date().getFullYear()} Imperial Securities Company Ltd. All rights reserved.
            </p>
            <div className="ft-badges">
              {["SEBON Reg.", "CDSC Member", "NEPSE #45"].map((b) => (
                <span key={b} className="ft-badge">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
