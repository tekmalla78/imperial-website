---
target: homepage
total_score: 31
p0_count: 0
p1_count: 0
timestamp: 2026-06-29T03-23-26Z
slug: src-routes-index-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Market/tools sections lack live/offline cues |
| 2 | Match System / Real World | 4 | Broker terminology, NEPSE context, license visible |
| 3 | User Control and Freedom | 3 | App store links in DownloadSection are `#` placeholders |
| 4 | Consistency and Standards | 3 | Eyebrow pattern on SimpleHero/Services/Tools matches legacy site cadence |
| 5 | Error Prevention | 3 | External KYC links open correctly; tools modals need clearer exit |
| 6 | Recognition Rather Than Recall | 4 | Clear Open Account CTA, services named in plain language |
| 7 | Flexibility and Efficiency | 3 | Power users rely on header dropdowns; no skip links |
| 8 | Aesthetic and Minimalist Design | 3 | Many sections on one scroll; Tools + Services both card-forward |
| 9 | Error Recovery | 2 | No offline/fallback messaging on homepage widgets |
| 10 | Help and Documentation | 3 | FAQs/Support linked from footer, not hero band |
| **Total** | | **31/40** | **Good — institutional and clear, room to reduce scaffold repetition** |

## Anti-Patterns Verdict

**Pass (narrow).** Homepage reads as a regulated Nepali broker, not generic crypto/SaaS. Blue/green committed palette, Syne + DM Sans, green primary CTA. Remaining tells: uppercase tracked kickers on SimpleHero and ServicesSection, identical service/tool card rhythm, DownloadSection `#` app links.

**Detector:** 16 hits on homepage components — mostly transition/color tokens in ServicesSection (legacy hex in hover shadows), not slop-family tells.

## Overall Impression

The homepage successfully communicates trust and the Open Account path. The biggest opportunity is reducing repeated eyebrow + card scaffolding so the page feels editorial rather than template-stacked.

## What's Working

- **SimpleHero** — license-forward headline, single green CTA, cool blue wash (not cream default)
- **CTASection + SiteHeader** — consistent registration URL and broker No. 45
- **Section rhythm** — white / gray-lt alternation without nested cards

## Priority Issues

**[P2] Eyebrow repetition on homepage sections**
- **Why:** SimpleHero, Services, Tools each use small-caps tracked labels — AI grammar per PRODUCT.md
- **Fix:** Keep one kicker in hero only; use weight/size for other section intros
- **Suggested command:** `/impeccable quieter homepage`

**[P2] DownloadSection app store dead links**
- **Why:** `href="#"` fails Jordan (first-timer) and breaks trust at conversion moment
- **Fix:** Wire real store URLs or hide until available with honest copy
- **Suggested command:** `/impeccable harden DownloadSection`

**[P2] ServicesSection token drift**
- **Why:** Detector flags hard-coded rgba in hover shadows
- **Fix:** Map to `--color-brand-blue` shadow tokens
- **Suggested command:** `/impeccable polish ServicesSection`

**[P3] Homepage section density**
- **Why:** Long scroll with similar card grids may overwhelm first-time investors
- **Fix:** Consider merging Tools preview into Services or demoting one band
- **Suggested command:** `/impeccable distill homepage`

## Persona Red Flags

**Jordan (First-Timer):** App Store / Google Play buttons go nowhere (`#`). Tools section opens modals without explaining NEPSE jargon upfront.

**Alex (Power User):** No keyboard shortcut to market tools; must traverse header dropdown.

## Minor Observations

- ContinueSection adds value but duplicates CTA language from SimpleHero
- BranchesSection could surface phone numbers as `tel:` links for mobile

## Questions to Consider

- Should the homepage lead with regulation (SEBON) or with a live market snapshot?
- If app links aren't ready, is a "Notify me" capture more honest than placeholder badges?
