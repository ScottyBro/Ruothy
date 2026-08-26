# Ruothy International — Website

A premium, human-centred, mobile-first marketing website for **Ruothy International (Private) Limited** — *"Connecting learning, talent and global opportunity."*

Built as a fast, hostable, SEO-friendly **static site** (plain HTML/CSS/JS — no build step, no framework), implementing the *Updated Website Design & Development Brief 2026* and the approved design direction (Ruothy blue `#004F84`, lime `#D9FF00`, white / light-grey, Inter typography).

## Pages

| File | Page | Brief section |
|------|------|---------------|
| `index.html` | Home — full storyboard (hero, journey selector, integrated model, how-it-works, featured pathways, why Ruothy, responsible practice, partner ecosystem, final invitation) | §6 |
| `explore.html` | Explore Opportunities — 2-question intent questionnaire + pathway grid | §7.1 |
| `services.html` | Services — the five connected pillars (Education, Skills/GAP, Assessment, Mobility, Advisory) | §7.2–7.6, §8 |
| `gap.html` | GAP — Global Access Program (as a Ruothy programme) + cohort registration | §7.3 |
| `partners.html` | For Partners — six partnership types + partner enquiry form | §7.6, §10 |
| `about.html` | About — story, values, leadership (Moses Arogo), operating structure | §5 |
| `insights.html` | Insights & Resources — guides, events, FAQs | §5 |
| `contact.html` | Contact — individual journey enquiry form + direct details + WhatsApp | §10 |
| `legal.html` | Legal & Safeguards — privacy, cookies, terms, disclaimers, safeguarding, complaints, accessibility, no-guarantee | §11 |

Plus `robots.txt`, `sitemap.xml`, and a shared design system.

## Structure

```
Ruothy/
├── index.html … legal.html      # 9 pages (shared header/footer inline for SEO/static rendering)
├── assets/
│   ├── css/styles.css           # complete design system (tokens, components, responsive)
│   ├── js/main.js               # progressive enhancement (nav, reveal, accordion, quiz, forms)
│   └── img/favicon.svg          # brand mark
├── robots.txt, sitemap.xml
├── server.js                    # tiny local preview server (Node, no dependencies)
└── .claude/launch.json          # preview config
```

## Run locally

```bash
node server.js
```

Then open <http://localhost:4173>. (Opening the `.html` files directly via `file://` will not load the CSS because of relative paths — use the server.)

## What's built vs. what needs your input before launch

**Done:** responsive layout, brand system, real photography with brand-overlay backgrounds, a device-mockup showcase, accessibility scaffolding (skip link, semantic landmarks, labelled forms, visible focus, `aria-current`, reduced-motion support, alt text), WhatsApp click-to-chat, SEO meta + Open Graph/Twitter card with a branded `og-image.png`, per-page structured data (Organization, BreadcrumbList, FAQPage, ItemList, Article), favicon set + `apple-touch-icon`, a styled `404.html`, three real Insights guide pages, sitemap/robots, and the "no-guarantee" and data-minimisation safeguards throughout.

**Needs real content / decisions (brief-mandated, intentionally left as placeholders):**
- **Photography** — real photos (students, campuses, library, airport/travel, graduation, meetings) are now in place across Home, Services (all five pillars), About and Partners, sourced from **Pexels (free for commercial use, no attribution required)** and stored in `assets/img/`. Two notes before launch: (1) do a final licensing check for your jurisdiction, and consider swapping in your own/branded photography over time; (2) the **CEO headshot on About is still a silhouette placeholder** — replace `about.html`'s leadership figure with a real photo of Moses Arogo (never a stock face for a named person). Also add `assets/img/og-image.png` (1200×630) for social sharing. The hero uses a designed "coordinated journey" glass panel (no photo needed).
- **Forms have no backend** — they validate and show a success message client-side only. Connect them to your CRM / email / consent-logging endpoint and add anti-spam + CSRF protection before launch (brief §12, §13).
- **Legal copy** — `legal.html` contains drafting starting points. Have them reviewed and approved by your safeguards/data reviewer and legal advisor.
- **Real programmes & opportunities** — featured cards and events use representative examples. Replace with CMS-managed, dated, status-carrying entries (brief §9).
- **Analytics** — add a privacy-respecting analytics setup and the event map (journey selections, form starts/completions, WhatsApp clicks, etc.) from brief §14.
- **Domain** — deploy to `www.ruothy.com` over HTTPS with canonical URLs (already set in `<head>`).

## Approved corporate details used
Ruothy International (Private) Limited · 83 Sam Nujoma Street, Harare, Zimbabwe · study.info@ruothy.com · +263 773 438 086 / +263 777 948 986 · Founder & CEO: Moses Arogo.
