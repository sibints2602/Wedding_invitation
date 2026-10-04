# Reference Site Teardown: myshaadhilink.in "Christian Elegance" template

**URL inspected:** https://myshaadhilink.in/invitation/christian-elegance?to=Guest&demo=true
**Inspected on:** 2026-10-02, live, with Playwright (Chromium, iPhone 14 Pro emulation + 1440px desktop).
**Raw captures:** the `reference-site/` folder (screenshots `m-*` mobile scroll, `r-*` interactions, `d-*` desktop, contact sheets, `template-data-model.json`, network logs, their assets) was removed from the repo on 2026-10-04; a copy sits outside it in `~/wedding-cleanup-backup-2026-10-04/docs/research/reference-site/`.

---

## 1. Verdict: can we build this?

**Yes, comfortably.** It is a single-page, mobile-first, scroll-driven invitation built with mainstream web tech (Next.js on Vercel, React, CSS variables, GSAP for scroll reveals, a React lightbox, a YouTube embed, a static Google Maps link). Nothing in it requires a backend beyond a tiny RSVP endpoint. Everything visually "premium" about it comes from four things we can reproduce or improve:

1. A **wax-sealed envelope intro** ("TAP TO OPEN" → 8-second opening video → 0.6s dissolve into the page).
2. A **consistent soft palette** (blush/cream background, dusty-rose accent, near-black ink) and a **three-font type system** (script + italic serif + clean sans).
3. **Watercolor illustration assets** (floral corners, a rose-wrapped cross, a couple walking down the aisle, a divider bouquet, falling petals) — theirs look AI-generated.
4. **Gentle motion**: falling petals, fade-up reveals on scroll, a pulsing music pill, shimmer on cards.

Our version can be lighter, faster, more personal (they ignore the guest's name), and add the features Indian guests expect (WhatsApp RSVP, Add to Calendar, directions, bottom nav).

---

## 2. Tech stack (observed)

| Layer | What they use | Evidence |
|---|---|---|
| Framework | **Next.js (App Router)**, React | `x-powered-by: Next.js`, route `/invitation/[slug]`, RSC flight payload, module `app/invitation/[slug]/page.tsx -> @/components/templates/christian-elegance` |
| Hosting | **Vercel** | `server: Vercel`, `x-vercel-id`, `x-vercel-cache: MISS`, `cache-control: private, no-store` (SSR per request) |
| Styling | **CSS variables + BEM-style classes** per template (`--ce-*`, `.ce-hero__…`), Tailwind present globally (`--tw-*` vars) | `template-css-ce-rules.css` (1,396 rules), `probe-1-after-open.json` → `cssVars` |
| Fonts | **next/font** self-hosted woff2 (14+ files) | `/_next/static/media/*.woff2` |
| Animation | **GSAP** (scroll reveals), plus CSS keyframes (`ce-pulse-music`, `ce-spin-slow`, `ce-env-hint-pulse`, `ce-env-skip-in`, `ce-entry-pulse`) | console: `GSAP target .ce-blessed__verse not found` |
| Gallery | **yet-another-react-lightbox** | lightbox root class `yarl__root yarl__portal` |
| Video | **YouTube iframe embed** (`/embed/{id}?rel=0&modestbranding=1`) | network |
| Music | `new Audio()` in JS (no `<audio>` element in DOM), loops a 0.9 MB MP3 | `.ce-music--playing` pill; no `<audio>` tag found |
| Maps | Plain `https://maps.google.com/?q=…` links (no embed) | anchors |
| CMS | **Headless WordPress** (WPGraphQL + ACF-style field groups) — fields like `featuredImage.node.sourceUrl`, `mediaItemUrl`, `modified`, `slug` | `template-data-model.json` |
| Media storage | Vercel Blob (`*.public.blob.vercel-storage.com/synced-media/…`) | network |
| Analytics | GA4, Google Ads conversion, Microsoft Clarity, PostHog, plus own `POST /api/analytics/ingest` (pageview, scroll depth 25/50/75/100, `section_visible` per section id) | `api-requests.json`, `recon4-log.json` |
| RSVP | Form posts to their API (demo mode fakes success: "Thank You! Your RSVP has been received…"). Data model has `rsvpEmail`/`rsvpSubject`, so RSVPs are e-mailed to the couple | `recon4-log.json` → `rsvpAfter` |

---

## 3. Page flow & information architecture (mobile, 393 px wide)

Total page height ≈ 7,500 px (≈ 11 phone screens). Measured section order and heights:

| # | Section (`<section>` class / id) | Height | Contents |
|---|---|---|---|
| 0 | `.ce-env-overlay` (fixed, z-200, bg `#f5ede0`) | full screen | Poster image (envelope with wax seal "P&R", "You are invited", pulsing "TAP TO OPEN"). On tap: plays `envelope-opening.mp4` (1080×1920, 8 s, 2.8 MB), a "Skip" button animates in, then overlay fades out over 0.6 s. |
| 1 | `.ce-hero` | 1,501 px | Floral corners (top-left/right) + watercolor cross centered; "Together with our families" (script, rose); H1 "They Are Getting Married" (Cormorant italic, rose); H2 "James & Sarah" (Great Vibes, ink, rose ampersand); watercolor couple walking down the aisle (full width); floral divider; H3 "Save the Date" (script); **"Scratch to Reveal the Date"** scratch-card button; parents' invitation wording (italic serif); countdown card (4 rose squares: days/hours/minutes/seconds); **"Join the Celebration"** pill button (scrolls to RSVP). Falling petals throughout. |
| 2 | `.ce-blessed` `#blessed-union` | 1,100 px | H2 "Blessed Union" (script); two Bible verses in uppercase tracked small caps (Hebrews 13:4, Ephesians 5:21); floral divider; **Groom**: round photo with rose ring, eyebrow "THE GROOM", name in script, "Son of Mr. & Mrs. …"; rose "&" medallion; **Bride** likewise. |
| 3 | `.ce-details` `#details` | 1,415 px | H2 "Celebration Timeline" (script); verse "Two are better than one." — Ecclesiastes 4:9; **event cards** (image header with gradient + icon badge + event name; body: clock + time, pin + venue, date, "View Map →", optional "DRESS CODE : Traditional" chip; shimmer sweep). Demo has 3 events: Madhurumveppu, Holy Matrimony, Wedding Reception (schema supports 10). |
| 4 | `.ce-gallery` `#gallery` | 1,436 px | Eyebrow "• OUR STORY IN FRAMES •", H2 "Our Gallery", subtitle; 2-column masonry of 10 photos; tap → full-screen lightbox. |
| 5 | `.ce-livestream` | 464 px | H2 "Watch Live", copy, "Join Live Stream" button (YouTube live URL), note; then a YouTube video embed with a decorative rose corner frame. |
| 6 | `.ce-rsvp` `#rsvp` | 1,129 px | H2 "RSVP", copy; form: Full Name*, Email*, "Will you be attending?" radios (Joyfully Accept / Regretfully Decline), Message textarea, "Send RSVP" pill; success state replaces form with "Thank You!". |
| 7 | `.ce-footer` | 483 px | Names in script, verse (Mark 10:9), date, giant translucent watermark of the names, rings divider, "This invite is made by MyShaadhi Link". |
| — | `.ce-music` (fixed, bottom-right) | 121×45 px | Dark glass pill "♪ SOUND ON", icon pulses while playing. |

**Desktop:** same single column, `--ce-max-content: 1200px`, `--ce-max-section: 680px` — the content stays a narrow centered column; it is designed phone-first.

**Not present** (despite fields existing in their data model): guest name greeting (the `?to=` param is parsed into `guestName` but never rendered in this template), Add-to-Calendar, WhatsApp share, directions embed, bottom navigation, dress-code section, gifts/blessings note, accommodation, FAQ, bilingual text.

---

## 4. Design tokens (extracted from `:root`)

### Colors (`--ce-*`)
| Token | Value | Use |
|---|---|---|
| `--ce-gold` (actually dusty rose) | `#c4687a` | accent: buttons, eyebrows, icons, rings |
| `--ce-gold-light` | `#e09aaa` | hover / music pill text |
| `--ce-gold-dark` | `#a34d5e` | pressed states |
| `--ce-cream` | `#fdf8f4` | section backgrounds |
| `--ce-white` | `#fffcfa` | page background |
| `--ce-black` | `#1a1015` | headings / names |
| `--ce-gray` / `--ce-gray-light` / `--ce-gray-lighter` | `#3a2a30` / `#7a6a70` / `#f8f4f2` | body / muted / cards |
| `--ce-text-on-light` / `-muted` | `#151515` / `#3c3c3c` | body copy |
| Shadows | `0 4px 20px rgba(181,115,126,.3)` (gold), `0 4px 20px rgba(0,0,0,.08)` (card), hover `0 12px 40px rgba(181,115,126,.2)` | buttons, cards |
| Borders | `rgba(181,115,126,.3)` / `.2` | dividers, input borders |
| Envelope overlay bg | `#f5ede0` | |
| Footer gradient | cream → blush pink (`~#f6dde3`) | |

Most-used computed colors on the page: `#151515` (body text), `#1a1015` (headings), `#c4687a` (accent), `#fffcfa` (bg).

### Typography
| Role | Font | Size / weight / style | Notes |
|---|---|---|---|
| Names, section titles (H2/H3) | **Great Vibes** (script) | 48 px / 36 px, normal | ampersand colored `--ce-gold` |
| Small script lines ("Together with our families") | **Allura** (script) | ~22 px | rose colored |
| H1 "They Are Getting Married" | **Cormorant Garamond** | 40 px, 300, *italic*, ls 0.8 px | rose colored |
| Invitation wording | **Cormorant Garamond** italic | 16–18 px, 300 | |
| Verses / quotes | **Playfair Display** | 16 px, 300 | muted (`rgba(21,21,21,.6)`) |
| Eyebrows ("THE GROOM", "DRESS CODE", verse refs) | sans | 12–14 px, 400–500, uppercase, letter-spacing ~0.15em | rose colored |
| Body / UI / form | **Plus Jakarta Sans** (falls back to Roboto) | 14–16 px, 300, line-height 1.65 | |
| Type scale | `clamp()` based: `--ce-text-lg: clamp(1.125rem,2.5vw,1.375rem)` … `--ce-text-6xl: clamp(3.5rem,11vw,6rem)` | fluid | |

### Spacing / radii / motion
- Spacing scale `0.5rem → 8rem` (`--ce-space-1 … -16`); section padding ~4–6 rem; horizontal padding 1 rem.
- Radii: 4 / 8 / 16 / 24 px and pill (`9999px`). Cards 16–24 px, buttons pill.
- Easing `cubic-bezier(0.4,0,0.2,1)`, durations 200 ms (UI) / 500 ms (slow).

---

## 5. Motion & interaction inventory

| Element | Behaviour | How to reproduce |
|---|---|---|
| Envelope intro | Fixed overlay with poster → tap → `<video>` plays (8 s, 24 fps, 1080×1920, with faint paper-rustle audio) with "Skip" fading in → overlay `opacity: 0` over 0.6 s (`.ce-env-overlay--dissolving`) → page beneath already rendered. **Video sequence** (see `thumbs/contact-sheet-envelope-video.jpg`): 0–1.5 s static blush envelope with embossed line-art roses and a burgundy wax seal "P&R"; 1.5–2.5 s the flap lifts with the seal attached; 2.5–4 s the interior shows and a white card starts rising; 4–8 s the card slides up to fill the frame (blank white), which the page then dissolves through. A "Veo" watermark in the corner shows it was generated with Google Veo. | Same pattern, or a **CSS/JS envelope** (flap rotateX + seal break + card slide) which is lighter than a 2.8 MB MP4 and plays everywhere (headless/old devices without H.264 showed nothing) |
| "TAP TO OPEN" | letter-spaced caption with `ce-env-hint-pulse` opacity pulse | CSS keyframes |
| Falling petals | Hero has 6 `<img class="ce-hero-petal">` petals with `data-target-x/y` landing coordinates (GSAP flies them in on load) plus a "petal shelf" of ~13 `ce-hero__landing-petal` images resting on the Save-the-Date card; further petals scatter over every section; all one 26 KB PNG (`scatter-petal-1.png`) | ~12–16 absolutely-positioned `<img>`/`<div>`s with randomized CSS animation (translateY + rotate + sway), `pointer-events:none`, `prefers-reduced-motion` off switch |
| Scroll reveals | GSAP (fade/slide-up of headings, verses, cards) | GSAP ScrollTrigger, or Framer Motion `whileInView`, or IntersectionObserver + CSS |
| Countdown | live `days / hours / minutes / seconds` tiles | `setInterval` 1 s; tiles in rose-tinted squares |
| Scratch to Reveal the Date | `.ce-scratch` container (24 px radius, `touch-action: none`, rose-tinted gradient) with a canvas scratch layer over the date | `<canvas>` with `globalCompositeOperation='destination-out'`, reveal when ≥50 % scratched |
| Join the Celebration | smooth-scrolls to `#rsvp` | `scrollIntoView({behavior:'smooth'})` |
| Event card shimmer | diagonal light sweep (`.ce-event-card__shimmer`) + hover lift | CSS gradient + keyframes |
| Gallery | masonry grid; tap opens full-screen lightbox with close "×" | `yet-another-react-lightbox` or PhotoSwipe |
| Music pill | fixed bottom-right, dark glass (`backdrop-filter: blur(12px)`), "♪ SOUND ON", icon pulses 1.5 s loop while playing; audio (32.8 s soft instrumental, looped) starts after the user's tap (autoplay policy satisfied by the envelope tap) | `new Audio(src)`; `loop=true`; start on envelope tap; persist mute preference |
| RSVP | required name/email, radios, textarea; success message swap | small API route or WhatsApp deep link |
| Map | opens Google Maps search URL | `https://maps.google.com/?q=` or `https://www.google.com/maps/dir/?api=1&destination=` |

---

## 6. Content data model (theirs → ours)

Their CMS exposes these groups (see `reference-site/template-data-model.json` for the complete JSON):

- `coupleDetails`: groom/bride first & full names, photos, parent labels ("Son of"/"Daughter of"), parents' names
- `weddingDetails`: ISO date, display date, time, city, `blessingText`
- `events` (×10): enabled, name, date, time, venue, mapLink, type (madhurumveppu / wedding / reception / other), dressCode flag + text
- `gallery`: up to 10 photos
- `venue`: name, address, map embed, directions URL
- `livestream`: enabled + URL; `videoSection`: YouTube URL, title, orientation
- `rsvpSettings`: email + subject
- `sectionVisibility`: showHero, showBlessing, showCouple, showCountdown, showEvents, showGallery, showVenue, showLivestream, showVideo, showRsvp, showMusic
- `backgroundMusic`: file URL
- `templateDesign`: template slug; `christianElegance`: custom envelope video/poster overrides
- `shareCalendar`: WhatsApp message, calendar title/description (unused in UI)
- `seoMeta`: meta description

**Takeaway:** a single typed `wedding.config.ts` (or JSON) with these groups is enough for our site; no CMS is needed for one wedding.

---

## 7. Assets they use (study only — not to be reused)

| File | Type / size | Role |
|---|---|---|
| `envelope-opening-poster.jpg` | 585 KB | envelope still with wax seal, "You are invited" |
| `envelope-opening.mp4` | 1080×1920, 8 s, 2.8 MB | opening animation |
| `aisle-walk.webp` | 385 KB | watercolor couple from behind walking down a church aisle |
| `cross-watercolor.webp` | 132 KB | wooden cross wrapped in dusty-rose roses & eucalyptus |
| `floral-corner.webp` | 148 KB | rose + eucalyptus corner spray (mirrored for the other side) |
| `floral-divider.webp` | 128 KB | horizontal rose bouquet divider |
| `scatter-petal-1.png` | 26 KB | single translucent rose petal (animated) |
| `event-madhurumveppu.jpg`, `event-wedding.jpg`, `event-reception.jpg` | ~90–130 KB each | event card headers (AI-looking renders) |
| `church.mp3` | 0.9 MB, 32.8 s, 226 kb/s | soft instrumental loop |
| 10 gallery photos + 2 portraits | Vercel Blob, mixed jpg/webp/avif | demo couple photos |

The illustrations have the uniform, slightly glossy look of AI image generation (consistent palette, no artist signature), and the envelope video carries a Google **Veo** watermark, so the whole asset set was AI-generated. For our build we will either generate our own custom watercolor set (then background-remove), buy a watercolor clipart pack, or use free watercolor florals — see [02-assets-and-resources.md](02-assets-and-resources.md) and [05-repos-inspiration-watercolor-assets.md](05-repos-inspiration-watercolor-assets.md).

---

## 8. Performance & quality observations

- ~240 requests on first load (measured by content-length, mobile): **images 4.4 MB**, **media 3.7 MB** (video 2.8 MB + music 0.9 MB), **third-party scripts/embeds 1.4 MB** (YouTube player, GA4, Google Ads, Clarity, PostHog), **fonts 0.7 MB in 20 woff2 files**, plus 16 CSS files and 13 JS chunks (sizes chunked/unknown). A well-built custom site can land under ~1.5 MB on first view.
- SSR with `no-store` on every request (because of per-guest params); we can statically generate and read `?to=` on the client.
- Guest personalization is advertised but **not rendered** in this template.
- Envelope video depends on H.264 playback; devices/browsers without it see an instant dissolve. A CSS/JS envelope avoids that.
- Eyebrow text at 12 px uppercase with low-contrast muted greys hurts readability for older guests.
- No `lang`-specific or bilingual support; no Add-to-Calendar; no WhatsApp share/RSVP; no bottom nav.

---

## 9. What to borrow vs. improve

**Borrow (works well):**
- Envelope "tap to open" gate that doubles as the audio unlock.
- Three-font system: script for names/headings, italic serif for wording, clean sans for UI.
- Soft blush/cream canvas + a single accent colour; generous vertical rhythm; narrow 680 px column even on desktop.
- Petals as ambient motion; rounded event cards with image headers and icon badges; round portraits with an accent ring; script watermark in the footer; floating music pill.

**Improve:**
- Render the guest's name ("Dear Sibin & Family, you are invited…") on the envelope and hero.
- Add **Add to Calendar** (Google + .ics), **Get Directions** deep links, **RSVP via WhatsApp** (prefilled) alongside/in place of an email form, **share** button, and a **sticky bottom nav** on mobile.
- Lighter intro (CSS/JS envelope or a ≤1 MB silent WebM/MP4 with poster fallback), 2–3 font files, no trackers.
- Larger minimum text (14–16 px), stronger contrast for elders; `prefers-reduced-motion` support.
- Optional Malayalam/Tamil/Konkani line for parents' wording.
