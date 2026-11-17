#!/usr/bin/env python3
"""One-off: turn dumped imperialsecurities.com.np API JSON into src/cms/live-seed.json."""

from __future__ import annotations

import datetime
import json
import pathlib
import re
from html import unescape

P = pathlib.Path("/tmp/imperial-api")
OUT = pathlib.Path(__file__).resolve().parents[1] / "src/cms/live-seed.json"


def strip_html(s: object, limit: int | None = None) -> str:
    if not s:
        return ""
    text = unescape(str(s))
    text = re.sub(r"(?i)<br\s*/?>", "\n", text)
    text = re.sub(r"(?i)</(p|div|h[1-6]|li|tr|td)>", "\n", text)
    text = re.sub(r"(?i)<li[^>]*>", "- ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = text.replace("\r", "").replace("\u00a0", " ").replace("&nbsp;", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n[ \t]+", "\n", text)
    text = re.sub(r"(?m)^[ \t]*$", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = text.strip()
    if limit and len(text) > limit:
        trimmed = text[:limit].rsplit("\n", 1)[0].rstrip()
        text = trimmed + "\n\n[Full notice published on imperialsecurities.com.np.]"
    return text


def slugify(text: str) -> str:
    text = text.lower().strip().replace("'", "").replace("’", "")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:72]


def name_key(name: str) -> str:
    return re.sub(r"[^a-z]", "", name.lower())


def pos_name(person: dict) -> str:
    pos = person.get("position")
    if isinstance(pos, dict):
        return pos.get("name") or ""
    return str(pos or "")


def dept_name(person: dict) -> str:
    dep = person.get("department")
    if isinstance(dep, dict):
        return dep.get("name") or ""
    return str(dep or "")


def parse_news_date(raw: str) -> str:
    raw = (raw or "").strip()
    for fmt in ("%b %d, %Y", "%Y-%m-%d", "%d %b %Y"):
        try:
            return datetime.datetime.strptime(raw, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    if len(raw) >= 10 and raw[4] == "-":
        return raw[:10]
    return "2023-12-01"


def faq_category(q: str) -> str:
    ql = q.lower()
    if any(x in ql for x in ["demat", "meroshare", "pan", "broker account", "trading account"]):
        return "Account & Registration"
    if "ipo" in ql:
        return "IPO & Rights Shares"
    if any(
        x in ql
        for x in [
            "stock broker",
            "brokerage",
            "secondary",
            "settle",
            "selling",
            "choose good stocks",
            "investment risky",
            "minimum amount",
        ]
    ):
        return "Trading"
    return "Support & Services"


def download_group(name: str) -> tuple[str, str]:
    n = name.lower()
    if "institution" in n or "corporate" in n:
        return ("Institutional Forms", "For companies and other institutions.")
    if any(
        x in n
        for x in ["kyc", "demat registration", "mero share", "online agreement", "in-person", "in-persion"]
    ):
        return ("New Account Registration", "Open a trading and Demat account with Imperial Securities.")
    return ("Other Forms", "Dematerialisation, order slips, margin, and CIC forms.")


def clean_person_name(name: str) -> str:
    return (name or "").replace("Mr. ", "").replace("Ms. ", "").replace("Mrs. ", "").strip()


def main() -> None:
    home = json.loads((P / "home.json").read_text())
    about = json.loads((P / "about-us.json").read_text())
    chairman = json.loads((P / "chairman-message.json").read_text())
    faqs_raw = json.loads((P / "faqs.json").read_text())["faqs"]
    downloads_raw = json.loads((P / "downloads.json").read_text())
    member = json.loads((P / "member.json").read_text())
    news_raw = json.loads((P / "latest-news.json").read_text())
    if isinstance(news_raw, dict):
        news_raw = news_raw.get("data") or news_raw.get("news") or news_raw.get("latest_news") or []

    about_by_name = {a["name"]: strip_html(a["description"]) for a in about["about_us"]}
    chairman_body = re.sub(r"\n{2,}", "\n\n", strip_html(chairman["description"]))
    chairman_body = re.sub(r"(?i)\n*warm regards,?\s*$", "", chairman_body).strip()

    by_live = {s.get("slug"): s for s in home.get("services") or []}
    stock = by_live.get("stock-brokerage-service-1") or {}
    margin = by_live.get("margin-lending") or {}
    dp = by_live.get("depository-participan") or {}

    settings = {
        "siteName": "Imperial Securities Company Limited",
        "tagline": "Stock broking and wealth management — NEPSE member, CDSC depository participant",
        "foundingYear": "2010",
        "brokerNo": "45",
        "phone": "01-5970145",
        "phoneHref": "tel:015970145",
        "email": "45.imperial@gmail.com",
        "hours": "Sun–Thu 9:30 AM–6:00 PM · Fri 9:30 AM–5:00 PM",
        "headOffice": "Kathmandu-29, Anamnagar, Hanumansthan, Kathmandu",
        "registrationUrl": "https://ckyc.imperialsecurities.com.np/auth/type-selection",
        "tmsUrl": "https://tms45.nepsetms.com.np",
        "meroshareUrl": "https://meroshare.cdsc.com.np/",
        "clientLoginUrl": "https://client45.cmt.com.np",
        "noticeText": "Margin Trading Guidelines is here",
        "noticeCta": "View Guidelines",
        "noticeHref": "https://admin-dashboard.imperialsecurities.com.np/storage/final_m_t_f_guideline_imperial_2026-07-08_06-28-08.pdf",
        "footerAbout": about_by_name.get("About Us", ""),
        "defaultTitle": "Imperial Securities Company Limited — Stock Broker No. 45 | NEPSE",
        "defaultDescription": "Imperial Securities Company Limited is a NEPSE member and CDSC depository participant headquartered in Anamnagar, Kathmandu. Open Demat, TMS, and trading accounts with Broker No. 45.",
    }

    homepage = {
        "kicker": "NEPSE Member · CDSC Depository Participant · Broker No. 45",
        "title": "Welcome To Imperial Securities Company Limited",
        "subtitle": about_by_name.get("About Us", ""),
        "ctaLabel": "Open Account",
        "ctaHref": "https://ckyc.imperialsecurities.com.np/auth/type-selection",
        "secondaryCtaLabel": "Contact Us",
        "stats": "\n".join(
            [
                "Broker | No. 45",
                "Founded | 2010",
                "Offices | 6 across Nepal",
                "Hours | Sun–Thu 9:30AM–6PM",
            ]
        ),
        "cards": "\n".join(
            [
                "Stock Brokerage | Trade NEPSE-listed securities through Imperial TMS with published brokerage rates.",
                "Margin Trading | Buy eligible securities with 30% initial margin — facilities from NPR 10 lakh to 1 crore.",
                "Depository Participant | Open a BO/Demat account with CDSC through Imperial, including MeroShare access.",
                "Apply Online | Register for TMS and Demat from the website — KYC, video verification, and payment online.",
            ]
        ),
    }

    pages = [
        {
            "id": "chairman-message",
            "title": "Chairman's Message",
            "slug": "chairman-message",
            "subtitle": "A message from the Chairperson of the Board",
            "personName": chairman.get("name") or "Bhaktiram Ghimire",
            "personRole": chairman.get("designation") or "Chairman",
            "email": "sbrghimire@imperialsecurites.com.np",
            "phone": "01-5970145",
            "linkedin": "",
            "seoTitle": "Chairman's Message — Imperial Securities Company Limited",
            "seoDescription": "A message from Chairman Bhaktiram Ghimire of Imperial Securities Company Limited.",
            "body": chairman_body,
        },
        {
            "id": "about",
            "title": "About Us",
            "slug": "about",
            "subtitle": "Founded in 2010 · NEPSE member · CDSC depository participant",
            "seoTitle": "About Us — Imperial Securities Company Limited",
            "seoDescription": about_by_name.get("About Us", "")[:160],
            "body": "\n\n".join(
                [
                    about_by_name.get("About Us", ""),
                    about_by_name.get("Our Story", ""),
                    "Mission\n" + about_by_name.get("Mission", ""),
                    "Vision\n" + about_by_name.get("Vision", ""),
                    "Values\n" + about_by_name.get("Values", ""),
                ]
            ),
        },
        {
            "id": "support",
            "title": "Support",
            "slug": "support",
            "subtitle": "Help with Demat, TMS, MeroShare, and branch services",
            "seoTitle": "Support — Imperial Securities Company Limited",
            "seoDescription": "Contact Imperial Securities Company Limited for Demat, TMS, MeroShare, and branch support.",
            "body": "Call 01-5970145 or email 45.imperial@gmail.com. Office hours are Sunday to Thursday 9:30 AM–6:00 PM and Friday 9:30 AM–5:00 PM. Head office: Kathmandu-29, Anamnagar, Hanumansthan.",
        },
    ]

    services = [
        {
            "slug": "stock-brokerage",
            "title": "Stock Brokerage",
            "subtitle": strip_html(stock.get("summary") or "")[:420],
            "description": strip_html(stock.get("description") or ""),
            "features": "\n".join(
                [
                    "NEPSE member broker | Execute buy and sell orders on the Nepal Stock Exchange through Imperial TMS.",
                    "Published tariff | Equity commission follows the SEBON-approved scale from 0.36% (or Rs 10) down to 0.24%.",
                    "Online registration | TMS account opening with KYC, online agreement, citizenship, photos, PAN, and bank details.",
                    "Individuals, minors & institutions | Separate document checklists for each account type, including corporate board minutes.",
                ]
            ),
            "benefits": "\n".join(
                [
                    "SEBON licensed Broker No. 45",
                    "Member of Nepal Stock Exchange",
                    "Online TMS registration",
                    "Transparent equity commission scale",
                    "Support for individual, minor, and institutional accounts",
                ]
            ),
            "seoTitle": "Stock Brokerage — Imperial Securities Company Limited",
            "seoDescription": strip_html(stock.get("summary") or "")[:160],
        },
        {
            "slug": "margin-trading",
            "title": "Margin Trading",
            "subtitle": strip_html(margin.get("summary") or "")[:420],
            "description": strip_html(margin.get("description") or ""),
            "features": "\n".join(
                [
                    "30% initial margin | Contribute 30% of the facility value; Imperial finances the remaining 70%.",
                    "Facilities from 10 lakh to 1 crore | Fixed facility sizes with published monthly interest and service fees.",
                    "Tenure 1 / 3 / 6 months | Interest and service fee of 0.9% per month, payable upfront and non-refundable.",
                    "Maintenance margin 20% | Eligible NEPSE scripts as published for margin trading; CIC report required.",
                ]
            ),
            "benefits": "\n".join(
                [
                    "Initial margin 30%",
                    "Loan amount up to NPR 1 crore",
                    "Published monthly fees",
                    "SEBON margin guidelines available as PDF",
                    "Required documents listed on the service page",
                ]
            ),
            "seoTitle": "Margin Trading — Imperial Securities Company Limited",
            "seoDescription": strip_html(margin.get("summary") or "")[:160],
        },
        {
            "slug": "depository-services",
            "title": "Depository Participant",
            "subtitle": strip_html(dp.get("summary") or "")[:420],
            "description": strip_html(dp.get("description") or ""),
            "features": "\n".join(
                [
                    "CDSC Depository Participant | Open a Beneficiary Owner (BO) account and hold shares in demat form.",
                    "MeroShare | Register MeroShare with your Demat account for IPOs, holdings, and EDIS.",
                    "Individual, minor & institution | Document checklists for each account type.",
                    "Published DP fees | Account opening Rs 50; annual maintenance Rs 100; on-market Rs 25 per BO per stock per settlement.",
                ]
            ),
            "benefits": "\n".join(
                [
                    "CDSC-linked Demat / BO account",
                    "MeroShare access",
                    "Paperless share holding",
                    "Published DP tariff",
                    "Online Demat registration from the website",
                ]
            ),
            "seoTitle": "Depository Participant — Imperial Securities Company Limited",
            "seoDescription": strip_html(dp.get("summary") or "")[:160],
        },
        {
            "slug": "ipo-fpo",
            "title": "IPO / FPO Application",
            "subtitle": "Apply for public offerings through MeroShare once your Demat and bank accounts are linked.",
            "description": "Imperial is a CDSC depository participant. Investors with a Demat and MeroShare account can apply for IPOs and FPOs through meroshare.cdsc.com.np. Our branches and customer service team can help with account opening and application issues during issue windows.",
            "features": "\n".join(
                [
                    "MeroShare applications | Apply online once Demat, bank, and MeroShare are active.",
                    "Demat credit | Allotted shares are credited to your BO account.",
                    "Branch help | Walk-in support at Anamnagar and other offices.",
                    "Published FAQs | See the FAQ page for IPO basics and minimum investment.",
                ]
            ),
            "benefits": "\n".join(
                [
                    "Apply via MeroShare",
                    "Allotment to your Demat",
                    "FAQs covering IPO basics",
                    "Customer service at 01-5970145",
                ]
            ),
            "seoTitle": "IPO / FPO — Imperial Securities Company Limited",
            "seoDescription": "Apply for IPOs and FPOs through MeroShare with a Demat account at Imperial Securities, Broker No. 45.",
        },
        {
            "slug": "portfolio-management",
            "title": "Portfolio & Account Support",
            "subtitle": "Review holdings, settlements, and account servicing with our trading, DP, and accounts teams.",
            "description": "Imperial's published contacts include Trading, DP, Accounts, KYC, and Customer Service desks at head office. Visit a branch or call 01-5970145 (ask for the relevant extension) for statements, EDIS, pledges, and account updates.",
            "features": "\n".join(
                [
                    "Trading desk | Order and settlement queries with the Trading Department.",
                    "DP desk | Demat, pledge, freeze, and transfer support.",
                    "Accounts | Payments, charges, and bank details.",
                    "KYC updates | PAN, NID, and KYC document changes.",
                ]
            ),
            "benefits": "\n".join(
                [
                    "Named department contacts",
                    "Six branch offices",
                    "Published office hours",
                    "EDIS assistance",
                ]
            ),
            "seoTitle": "Account Support — Imperial Securities Company Limited",
            "seoDescription": "Portfolio and account support from Imperial Securities desks for trading, Demat, KYC, and settlements.",
        },
        {
            "slug": "research-advisory",
            "title": "News & Market Notes",
            "subtitle": "Company notices and published articles on Nepal's capital market.",
            "description": "Imperial publishes news and notices on its website, including operational guides (such as EDIS in MeroShare) and longer articles on NEPSE and mutual funds. These are educational notes, not personalised investment advice.",
            "features": "\n".join(
                [
                    "News and notices | Operational updates such as dematerialisation lists and process guides.",
                    "Published articles | Longer-form notes on NEPSE and mutual funds.",
                    "Not personal advice | Articles are for general information.",
                    "Ask the desk | Trading and customer service can help with process questions.",
                ]
            ),
            "benefits": "\n".join(
                [
                    "EDIS how-to guide",
                    "Market articles on the news page",
                    "Process support from branches",
                ]
            ),
            "seoTitle": "News & Notes — Imperial Securities Company Limited",
            "seoDescription": "News, notices, and market notes published by Imperial Securities Company Limited.",
        },
    ]

    branches = [
        {
            "slug": "kathmandu",
            "name": "Head Office (Kathmandu)",
            "city": "Kathmandu",
            "addr": "Kathmandu-29, Anamnagar, Hanumansthan, Kathmandu",
            "phone": "01-5970145",
            "email": "45.imperial@gmail.com",
            "hours": "Sun–Thu 9:30 AM–6:00 PM · Fri 9:30 AM–5:00 PM",
            "mapsQuery": "Imperial+Securities+Hanumansthan+Anamnagar+Kathmandu",
            "description": "Head office of Imperial Securities Company Limited, serving as NEPSE member broker and CDSC depository participant.",
            "manager": "Bhaktiram Ghimire",
            "established": "2010",
        },
        {
            "slug": "nepalgunj",
            "name": "Nepalgunj",
            "city": "Nepalgunj",
            "addr": "HICOLA Building, Nepalgunj-1, Dhamboji Chok, Nepalgunj, Banke",
            "phone": "081-534932",
            "email": "npj@imperialsecurities.com.np",
            "hours": "Sun–Thu 9:30 AM–6:00 PM · Fri 9:30 AM–5:00 PM",
            "mapsQuery": "Imperial+Securities+Nepalgunj+Broker+45",
            "description": "Nepalgunj branch of Imperial Securities Company Limited (Broker No. 45).",
            "manager": "Uday Raj Adhikari",
            "established": "",
        },
        {
            "slug": "surkhet",
            "name": "Surkhet",
            "city": "Surkhet",
            "addr": "Birendranagar-6, Jumla Road, Surkhet",
            "phone": "083-590906",
            "email": "Surkhet@imperialsecurities.com.np",
            "hours": "Sun–Thu 9:30 AM–6:00 PM · Fri 9:30 AM–5:00 PM",
            "mapsQuery": "Imperial+Securities+Jumla+Road+Surkhet",
            "description": "Surkhet branch on Jumla Road, Birendranagar.",
            "manager": "Kabita Adhikari",
            "established": "",
        },
        {
            "slug": "bhaktapur",
            "name": "Suryabinayak",
            "city": "Bhaktapur",
            "addr": "Suryabinayak chok -06, Bhaktapur (Opposite Nepal Investment Mega Bank, Seepadole)",
            "phone": "01-5917985",
            "email": "45.imperial@gmail.com",
            "hours": "Sun–Thu 9:30 AM–6:00 PM · Fri 9:30 AM–5:00 PM",
            "mapsQuery": "Imperial+securities+bhaktapur+branch+45",
            "description": "Suryabinayak (Bhaktapur) branch of Imperial Securities Company Limited.",
            "manager": "Madhab Khanal",
            "established": "",
        },
        {
            "slug": "dhading",
            "name": "Dhading",
            "city": "Dhading",
            "addr": "Nilkantha-03, Bichbazar, Dhading",
            "phone": "010-590200",
            "email": "Dhading@imperialsecurities.com.np",
            "hours": "Sun–Thu 9:30 AM–6:00 PM · Fri 9:30 AM–5:00 PM",
            "mapsQuery": "Nilkantha-03+Bichbazar+Dhading",
            "description": "Dhading branch at Nilkantha-03, Bichbazar.",
            "manager": "Sujan Sapkota",
            "established": "",
        },
        {
            "slug": "pokhara",
            "name": "Pokhara",
            "city": "Pokhara",
            "addr": "Pokhara-07, Rastra Bank Chowk, Kaski",
            "phone": "061-579000",
            "email": "45.imperial@gmail.com",
            "hours": "Sun–Thu 9:30 AM–6:00 PM · Fri 9:30 AM–5:00 PM",
            "mapsQuery": "Imperial+Securities+Pokhara+Rastra+Bank+Chowk",
            "description": "Pokhara branch at Rastra Bank Chowk.",
            "manager": "",
            "established": "",
        },
    ]

    faqs = []
    for i, item in enumerate(faqs_raw, 1):
        q = (item.get("question") or "").strip()
        faqs.append(
            {
                "id": f"faq-{i}",
                "question": q,
                "answer": strip_html(item.get("answer")),
                "category": faq_category(q),
                "order": str(i),
            }
        )

    downloads = []
    for item in downloads_raw:
        name = item.get("name") or "Form"
        files = item.get("files") or []
        loc = files[0].get("location") if files else ""
        group, group_desc = download_group(name)
        title = name.title() if name.isupper() else name
        downloads.append(
            {
                "id": slugify(name),
                "title": title,
                "group": group,
                "groupDescription": group_desc,
                "file": loc or "#",
            }
        )

    team: list[dict] = []
    mgmt_keys: set[str] = set()
    for person in member.get("management") or []:
        name = clean_person_name(person.get("name") or "")
        sid = slugify(name)
        key = name_key(name)
        if not sid or key in mgmt_keys:
            continue
        mgmt_keys.add(key)
        desc = strip_html(person.get("description") or "")
        if desc.lower().startswith("imperial securities"):
            desc = ""
        fb = str(person.get("facebook") or "")
        team.append(
            {
                "id": sid,
                "name": name,
                "role": pos_name(person),
                "dept": dept_name(person) or pos_name(person),
                "group": "management",
                "desc": desc,
                "email": person.get("email") or "",
                "phone": "",
                "linkedin": fb if fb.startswith("http") else "",
            }
        )

    staff_keys = set(mgmt_keys)
    for person in member.get("human_resources") or []:
        name = clean_person_name(person.get("name") or "")
        sid = slugify(name)
        key = name_key(name)
        if not sid or key in staff_keys:
            continue
        staff_keys.add(key)
        team.append(
            {
                "id": sid,
                "name": name,
                "role": pos_name(person),
                "dept": dept_name(person),
                "group": "staff",
                "desc": "",
                "email": person.get("email") or "",
                "phone": "",
                "linkedin": "",
            }
        )

    news: list[dict] = []
    blog: list[dict] = []
    for article in news_raw:
        title = article.get("name") or article.get("title") or "Notice"
        slug = article.get("slug") or slugify(title)
        raw_date = article.get("date") or (article.get("created_at") or "")[:10]
        body = strip_html(article.get("description") or "", limit=6000)
        excerpt = re.sub(r"\s+", " ", body)[:220].rstrip()
        if excerpt and not excerpt.endswith((".", "…", "!")):
            excerpt = excerpt.rsplit(" ", 1)[0] + "…"
        item = {
            "title": title,
            "slug": slug,
            "excerpt": excerpt or title,
            "body": body,
            "date": parse_news_date(str(raw_date)),
            "seoTitle": f"{title} — Imperial Securities",
            "seoDescription": (excerpt or title)[:160],
        }
        title_l = title.lower()
        if any(x in title_l for x in ["edis", "rejection", "notice", "dematerialization", "dematerialisation"]):
            item["category"] = "Announcement" if "edis" in title_l else "Corporate"
            news.append(item)
        else:
            item["category"] = "Analysis"
            item["author"] = "Imperial Securities"
            item["readTime"] = "8 min"
            blog.append(item)

    board = []
    for person in member.get("bod") or []:
        bio = strip_html(person.get("description") or "")
        if bio.lower().startswith("imperial securities"):
            bio = "Director, Imperial Securities Company Limited."
        board.append(
            {
                "name": clean_person_name(person.get("name") or ""),
                "role": pos_name(person),
                "bio": bio,
                "email": person.get("email") or "",
            }
        )

    payload = {
        "settings": settings,
        "homepage": homepage,
        "pages": pages,
        "services": services,
        "branches": branches,
        "faqs": faqs,
        "downloads": downloads,
        "team": team,
        "news": news,
        "blog": blog,
        "socials": {
            "facebook": "https://www.facebook.com/imperial45",
            "instagram": "https://www.instagram.com/imperial_securities_45",
            "linktree": "https://linktr.ee/45imperial",
        },
        "foundation": {
            "mission": about_by_name.get("Mission", ""),
            "vision": about_by_name.get("Vision", ""),
            "values": about_by_name.get("Values", ""),
        },
        "board": board,
    }

    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        "wrote",
        OUT,
        OUT.stat().st_size,
        "team",
        len(team),
        "faqs",
        len(faqs),
        "news",
        len(news),
        "blog",
        len(blog),
        "downloads",
        len(downloads),
    )


if __name__ == "__main__":
    main()
