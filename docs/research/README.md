# Research pack: premium Christian wedding invitation website

Research completed 2026-10-02 before any code was written. Goal: build a premium, elegant, mobile-first digital wedding invitation like myshaadhilink.in's "Christian Elegance" template, and improve on it.

## Documents

| File | What it answers |
|---|---|
| [00-reference-site-teardown.md](00-reference-site-teardown.md) | Live Playwright teardown of the reference: tech stack, section-by-section structure with measured heights, design tokens (colours, fonts, spacing), motion inventory, envelope-video sequence, their content data model, their assets, performance, what to borrow vs. improve |
| [01-tech-stack-and-templates.md](01-tech-stack-and-templates.md) | How these sites are built; framework/animation/gallery/countdown libraries; RSVP backend options (WhatsApp deep link, Google Sheets, Formspree, DB); free hosting; mobile/WhatsApp-browser gotchas (dvh, autoplay, og:image) |
| [02-assets-and-resources.md](02-assets-and-resources.md) | Free, commercially usable assets with licences: Google Fonts pairings, floral/ornament SVG & PNG sources, Christian symbol icons (Christicons), Lottie animations, royalty-free soft piano music, paper/gold textures, UI icon sets, placeholder photos, optimisation tools |
| [03-design-and-content-conventions.md](03-design-and-content-conventions.md) | Six colour palettes with hex codes, information architecture tiers, Christian wedding wording (Catholic / Protestant / Indian-Christian / modern), 13 Bible verses (KJV), premium motion conventions, Indian e-invite UX norms |
| [04-competitor-feature-analysis.md](04-competitor-feature-analysis.md) | Feature matrix across myshaadhilink, Wowsly, Invifest, WithJoy, Zola, The Knot, Minted, Greenvelope, Bliss & Bone; must-have list; top UX patterns; anti-patterns from user complaints |
| [05-repos-inspiration-watercolor-assets.md](05-repos-inspiration-watercolor-assets.md) | 10 verified open-source wedding-invite repos (rampatra/wedding-website 1.8k★, dewanakl/undangan 809★, envelope-animation repos), 15+ verified design-inspiration links incl. CodePen envelope/petal demos, watercolor floral / cross / petal / wax-seal / paper-texture sources, and how to produce custom illustrations |
| `reference-site/` | Raw captures (screenshots, contact sheets, their data model and CSS, network logs, their assets for study only) — removed from the repo on 2026-10-04 in the cleanup (28 MB of third-party material); kept outside it in `~/wedding-cleanup-backup-2026-10-04/docs/research/reference-site/` |

## Headline findings

1. **Feasible, and we can beat it.** The reference is Next.js on Vercel + CSS variables + GSAP reveals + a React lightbox + a YouTube embed + Google Maps links, with a headless WordPress CMS behind it. For one wedding none of the CMS is needed: a single typed config file holds all content.
2. **Its premium feel comes from assets and restraint, not code.** A wax-seal envelope intro (an AI-generated 8-second Veo video), a blush/cream canvas with one dusty-rose accent, three fonts (Great Vibes script, Cormorant Garamond italic, Plus Jakarta Sans), watercolor florals, falling petals, and generous spacing.
3. **It has real gaps we can fill.** The guest's name from the `?to=` link is never shown; there is no Add-to-Calendar, no WhatsApp RSVP/share, no directions embed, no bottom navigation, no bilingual wording; first load is ~10 MB with five trackers; eyebrow text is 12 px low-contrast.
4. **All assets we need exist free or cheap.** Google Fonts cover the typography exactly; watercolor florals and petals are available free (Pixabay, Vecteezy, Rawpixel) or as $10–25 packs; Christian icons from Christicons; soft piano loops from Pixabay Music; a CSS/JS envelope can replace the heavy video.

## Recommended direction (to be confirmed with Sibin)

- **Stack:** Next.js (App Router) + TypeScript + Tailwind + Framer Motion (or GSAP), static export-friendly, deployed on Vercel free tier; `wedding.config.ts` for all content; guest name read from `?to=` on the client. RSVP via a tiny API route writing to Google Sheets or Neon, **plus** a WhatsApp deep-link RSVP button (what Indian guests actually use).
- **Look:** keep the reference's structure and rhythm but with our own palette and illustrations; default proposal is ivory + antique gold + sage/dusty-rose accent, Cormorant Garamond + a script (Great Vibes or Pinyon Script) + Jost/Plus Jakarta Sans.
- **Intro:** CSS/JS wax-seal envelope (flap opens, seal breaks, card slides up) that also unlocks the music; a short silent video is optional later.
- **Sections:** envelope → hero (names, date, guest greeting) → verse → parents' invitation → ceremony & reception cards (time, venue, directions, add-to-calendar, dress code) → countdown → couple → story/gallery → livestream → RSVP (form + WhatsApp) → blessings/gifts note → footer with hashtag; sticky bottom nav and floating music pill on mobile.

## Decisions needed before the spec

1. Who and when: couple's names, parents' names, date(s), church and reception venues, city. Any pre-wedding events (e.g. Madhurumveppu, engagement)?
2. Visual direction: keep the reference's blush/dusty-rose palette, or move to ivory/gold with sage or dusty-blue accents? Watercolor illustrations (generated/bought) or clean gold line-art?
3. Intro: CSS envelope with wax seal, or a video like the reference?
4. RSVP channel: WhatsApp button, web form to a sheet/database, or both? Should RSVP collect guest count and meal/veg preference?
5. Languages: English only, or add Malayalam/Tamil/Konkani lines for the parents' wording?
6. Music, livestream and gallery: do we have a track, a YouTube live link, and photos, or use placeholders for now?
7. Domain and sharing: custom domain or a free `.vercel.app` URL; per-guest personalised links from a guest list?
