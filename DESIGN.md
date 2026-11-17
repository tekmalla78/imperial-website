---
name: Imperial Securities
description: Trustworthy, established Nepalese stock brokerage — blue and green OKLCH brand system
colors:
  brand-blue: "oklch(0.45 0.18 255)"
  brand-blue-dk: "oklch(0.32 0.15 255)"
  brand-blue-lt: "oklch(0.95 0.03 255)"
  brand-green: "oklch(0.72 0.22 155)"
  brand-green-dk: "oklch(0.42 0.14 160)"
  brand-green-lt: "oklch(0.95 0.04 155)"
  brand-dark: "oklch(0.15 0.03 265)"
  brand-gray: "oklch(0.55 0.01 260)"
  brand-gray-lt: "oklch(0.97 0.005 260)"
  background: "oklch(1 0 0)"
  foreground: "oklch(0.15 0.03 265)"
  border: "oklch(0.92 0.01 260)"
  primary: "oklch(0.45 0.18 255)"
  muted-foreground: "oklch(0.55 0.01 260)"
typography:
  display:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "clamp(24px, 3vw, 40px)"
    fontWeight: 800
    lineHeight: 1.2
  title:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "clamp(1.125rem, 2vw, 1.375rem)"
    fontWeight: 700
    lineHeight: 1.26
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.72
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "11.5px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "2px"
rounded:
  sm: "calc(0.875rem - 4px)"
  md: "calc(0.875rem - 2px)"
  lg: "0.875rem"
  xl: "12px"
  pill: "9999px"
spacing:
  section-y: "48px"
  section-y-md: "64px"
  container-x: "16px"
  container-x-sm: "24px"
  content-max: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.brand-green}"
    textColor: "oklch(0.99 0 0)"
    rounded: "{rounded.xl}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.brand-green-dk}"
    textColor: "oklch(0.99 0 0)"
    rounded: "{rounded.xl}"
    padding: "14px 24px"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.brand-blue}"
    rounded: "{rounded.xl}"
    padding: "14px 24px"
  button-ghost-dark:
    backgroundColor: "transparent"
    textColor: "oklch(0.99 0 0)"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  link-nav:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    padding: "10px 12px"
---

# Design System: Imperial Securities

## 1. Overview

**Creative North Star: "The Clear Broker"**

Imperial Securities reads as a regulated institution that happens to be digital — not a startup trading app dressed in bank cosplay. The visual system is **Committed** on blue and green: institutional blue carries navigation, heroes, and trust; growth green carries primary conversion (Open Account). Surfaces stay clean white or cool gray-lt with tinted neutrals toward hue 255–265, never warm cream defaults.

Layout favors **editorial rhythm** on key pages (About Foundation, History, FAQs): left-aligned headers at `max-w-[1280px]`, prose blocks, and sticky section nav on desktop. Marketing sections use generous vertical padding (`py-12 md:py-16`) and restrained decorative blurs — never glassmorphism as the default container style.

The system explicitly rejects generic AI landing-page grammar, startup SaaS motion, crypto-terminal aesthetics, and cluttered legacy broker tables — per PRODUCT.md anti-references.

**Key Characteristics:**
- OKLCH brand tokens in `src/styles.css`; extend, don't replace with off-palette hex
- Syne (display) + DM Sans (body) — geometric display + humanist body
- Primary CTA: green gradient pill/rounded-xl; secondary: white + blue border
- Dark hero bands (`brand-dark` → `brand-blue-dk` gradients) for page intros
- Flat-at-rest surfaces; shadow only on hover or elevated CTAs
- Content max width 1280px; horizontal padding `px-4 sm:px-6`
- WCAG AA contrast; no `text-white/55` body copy on dark backgrounds

## 2. Colors

A cool blue-green institutional palette anchored in OKLCH — blue for trust and regulation, green for action and growth.

### Primary
- **Institutional Blue** (`oklch(0.45 0.18 255)` / ~#1557C0): Primary links, nav emphasis, PageHero backgrounds (via `brand-blue-dk`), regulation callouts, focus rings (`--ring`).
- **Deep Broker Blue** (`oklch(0.32 0.15 255)` / ~#0E3D8C): Hero gradients, footer-adjacent dark bands, gradient endpoints.

### Secondary
- **Growth Green** (`oklch(0.72 0.22 155)` / ~#37D200): Primary CTA fills, success states, accent dots, TopBar highlights.
- **Committed Green** (`oklch(0.42 0.14 160)` / ~#1F7A12): CTA gradient end states, hover on green buttons, sticky nav active markers.

### Tertiary
- **Cool Paper** (`oklch(0.95 0.03 255)` / ~#E8F0FB): Hero wash backgrounds (`brand-blue-lt`), soft section tints.
- **Mint Wash** (`oklch(0.95 0.04 155)` / ~#E8F9E8): Green-tinted section backgrounds (`brand-green-lt`).

### Neutral
- **Ink** (`oklch(0.15 0.03 265)` / ~#0A1628): Headings, primary body on white (`--foreground`, `--brand-dark`).
- **Slate Body** (`oklch(0.55 0.01 260)` / ~#6B7280): Secondary prose (`--brand-gray`, `--muted-foreground`) — **only on white or gray-lt**, never as low-opacity white on dark.
- **Cool Gray Surface** (`oklch(0.97 0.005 260)` / ~#F5F6F8): Section alternates (`brand-gray-lt`), FAQ/downloads backgrounds.
- **Hairline Border** (`oklch(0.92 0.01 260)` / ~#E5E7EB): Cards, inputs, dividers (`--border`).

### Named Rules
**The Two-Voice Rule.** Blue speaks institution; green speaks action. Do not introduce purple, indigo, cyan, or orange as section accents — they are off-brand and read as AI-generated.

**The Dark-Surface Text Rule.** On `brand-dark` or blue gradient backgrounds, body copy uses `oklch(0.99 0 0 / 0.85)` minimum equivalent — never `text-white/55` for readable paragraphs.

## 3. Typography

**Display Font:** Syne (Google Fonts, weights 400–800)  
**Body Font:** DM Sans (Google Fonts, weights 300–600)  
**Label Font:** DM Sans at 11.5px uppercase (section kickers — use sparingly)

**Character:** Syne's geometric confidence carries headlines; DM Sans keeps forms, FAQs, and long copy approachable. The pairing is established site-wide — do not swap to Inter, Outfit, or reflex-reject defaults on new pages.

### Hierarchy
- **Display** (800, `clamp(2rem, 5vw, 3.25rem)`, lh 1.08): Homepage hero h1 only. `text-wrap: balance` recommended.
- **Headline** (800, `clamp(24px, 3vw, 40px)`, lh 1.2): PageHero h1, major section h2s.
- **Title** (800, `clamp(1.125rem, 2vw, 1.375rem)`, lh 1.26): FAQ category titles, Foundation pillar statements, card headings.
- **Body** (400–500, 14–16px, lh 1.72): Prose, descriptions, form labels. Max **65–75ch** on long copy blocks.
- **Label** (700, 11.5px, tracking 2px, uppercase): **One deliberate kicker per page maximum** — license line in hero or section intro, not every block.

### Named Rules
**The Eyebrow Budget Rule.** Tiny uppercase tracked labels (`11.5px tracking-[2px]`) are a legacy pattern on this site. New work must not add eyebrows to every section; one named kicker per page is the ceiling.

**The Clamp Ceiling Rule.** Display headings max at ~3.25rem (52px) on this site — never exceed 6rem. Test long Nepali/English headlines at tablet widths for overflow.

## 4. Elevation

This system is **flat-by-default with selective lift**. Most content sits on white or gray-lt with 1px borders. Depth appears through:

1. **Tonal layering** — `brand-blue-lt` → white → `brand-gray-lt` section alternation
2. **Hover lift** — `hover:-translate-y-0.5` + shadow increase on cards and CTAs
3. **Colored ambient shadows** on green CTAs only — not generic gray drop shadows everywhere

Decorative **blur orbs** (`blur-3xl`, low-opacity brand colors) sit behind content in heroes — never as glass cards on foreground content.

### Shadow Vocabulary
- **Header ambient** (`0 2px 20px rgba(21,87,192,.08)`): SiteHeader default border shadow.
- **Green CTA glow** (`0 8px 24px -8px rgba(55,210,0,0.55)`): Primary Open Account buttons.
- **Card hover** (`shadow-sm` → `shadow-md`): Download rows, team cards — state only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces at rest have no shadow. Elevation responds to hover, sticky headers, or primary CTAs only.

**The No-Glass Rule.** `backdrop-blur` is prohibited on content cards unless a single purposeful overlay (e.g. mobile sticky nav scrim). Decorative glassmorphism reads as AI slop.

## 5. Components

### Buttons
- **Shape:** Rounded-xl (12px) for marketing CTAs; rounded-full for secondary pill CTAs on dark bands; shadcn `rounded-md` (14px base radius) for form UI.
- **Primary:** Green gradient `from-brand-green to-brand-green-dk`, white text, bold 14px, px-6 py-3.5, green glow shadow. Hover: `-translate-y-0.5`.
- **Secondary:** White background, `border-brand-blue/20`, brand-blue text, same padding. Hover: solid border.
- **On dark:** White fill + `brand-blue-dk` text, or white/10 border ghost with white text.
- **Focus:** `focus-visible:ring-2 focus-visible:ring-brand-blue/10` on form controls.

### Chips / Tags
- **Style:** `rounded-full`, 10–11px semibold, used for team dept badges and blog categories — not as section eyebrows.
- **State:** Muted background on white; avoid pill badges on every feature row.

### Cards / Containers
- **Corner Style:** `rounded-xl` (12px) or `rounded-2xl` (16px) for team/download cards.
- **Background:** White on gray sections; `white/[0.03]` only on intentional dark bands (Our Advantage).
- **Border:** `border-border` (1px hairline) — full border, never `border-l-2` accent stripes.
- **Internal Padding:** `p-5 md:p-6` for cards; `py-4` for list rows.

### Inputs / Fields
- **Style:** `rounded-lg`, `border-border`, `bg-muted/30`, 14px text (contact form pattern).
- **Focus:** Border shifts to `brand-blue` + ring `brand-blue/10`.
- **Labels:** Must use `htmlFor`/`id` pairing — visual label alone is insufficient.

### Navigation
- **SiteHeader:** Sticky top, white/95 + backdrop-blur, 1280px max container. Dropdown panels: white, rounded-xl, border, shadow `[0_12px_40px_rgba(0,0,0,.12)]`.
- **Typography:** 14px semibold items; brand-blue for active/hover.
- **Mobile:** Full-screen white sheet, accordion sections.

### PageHero
- **Background:** `gradient-to-br from-brand-dark via-brand-blue-dk to-brand-dark`, py-14 md:py-16.
- **Title:** White, Syne extrabold, `text-3xl md:text-4xl lg:text-5xl`.
- **Subtitle:** `text-white/60` — large text only; keep short.

### Editorial Section (Foundation / FAQs pattern)
- **Layout:** `max-w-[1280px]`, sticky left nav at `top-28` on lg+, content column with divided lists or accordions.
- **No icon headers** on download groups; PDF icon on rows only.

## 6. Do's and Don'ts

Concrete guardrails derived from PRODUCT.md and the live codebase.

### Do:
- **Do** use OKLCH brand tokens from `src/styles.css` for all new color work.
- **Do** pair Syne headings with DM Sans body copy.
- **Do** lead regulated pages with license context (SEBON, Broker No. 45) in hero or first screen.
- **Do** keep section padding at `py-12 md:py-16` and container at `max-w-[1280px] px-4 sm:px-6`.
- **Do** honor `prefers-reduced-motion` on all new animations.
- **Do** use green gradient for the single primary CTA per viewport section.

### Don't:
- **Don't** use generic AI template patterns: Inter/system fonts, purple-to-blue gradients, identical icon+card grids on every section, gradient text, decorative glassmorphism, hero-metric stat blocks.
- **Don't** use startup SaaS tells: bounce/elastic easing, excessive motion, pill badges everywhere, nested cards, gray muted text on tinted backgrounds below 4.5:1 contrast.
- **Don't** use flashy fintech/crypto aesthetics: neon accents, terminal-dark UI, gamified elements, aggressive non-brand gradients.
- **Don't** ship dated legacy broker UI: cluttered tables, tiny type, mobile-unfriendly touch targets under 44px.
- **Don't** add `border-left` or `border-right` greater than 1px as colored accents on callouts — use full borders or background tints.
- **Don't** put uppercase tracked eyebrows on every section — one kicker per page maximum on new work.
- **Don't** use numbered `01 / 02 / 03` markers unless the section is a genuine ordered sequence (timeline, process steps).
- **Don't** introduce purple, indigo, or cyan accent colors outside the brand token set.
