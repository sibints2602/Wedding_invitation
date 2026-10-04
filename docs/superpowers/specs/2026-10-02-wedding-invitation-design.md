# Wedding Invitation Website — Design Spec

> **Reading this log:** sections 1–9 are the original design (Revision 1: Joel & Merin, wine/gold, cards, gallery, bottom nav). They were superseded from Revision 3 on; the current state of the site is the latest revisions at the end.

Date: 2026-10-02 · Status: approved to build by Sibin ("let's begin"); details are placeholders until the couple's real information arrives.

## 1. Purpose

A premium, elegant, mobile-first digital invitation for an Indian Christian wedding, shared mostly as a WhatsApp link and opened on phones. It must feel like opening a beautifully made paper invitation: calm, tactile, unhurried, with animation that serves the ceremony rather than decorating it. It should also look deliberate on tablets and desktops.

Reference emulated and improved upon: myshaadhilink.in "Christian Elegance" (teardown in `docs/research/00-reference-site-teardown.md`).

## 2. Decisions already made

| Topic | Decision |
|---|---|
| Content | Placeholders now (couple "Joel & Merin", Kerala Christian names, fictional venues, date 2027-01-23). Real details later via one config file. |
| RSVP | Not in scope now. Leave a clear place to add it later. |
| Visual direction | Premium stationery: alabaster paper, deep green ink, antique gold line art, sage botanicals, wine wax seal. Gold line art instead of watercolor rasters. |
| Languages | English and Malayalam, switchable at any time, default English. |
| Intro | CSS/JS wax-sealed envelope that opens on tap (also unlocks background music). No video. |
| Deploy | Later (Vercel). Build must stay deployable there without changes. |
| Media | Placeholder photos (licence-free) and a royalty-free instrumental, swappable by replacing files. |

## 3. Experience, screen by screen

Order and behaviour on a phone (393 px). Tablet/desktop differences are in §5.

0. **Envelope (gate).** Full-viewport alabaster envelope with faint gold line-art botanicals and the guest's name written on it ("Dear Sibin & Family" from `?to=`; "Dear Guest" if absent). A wine wax seal with the couple's initials. Caption "Tap to open". On tap: seal lifts and fades (500 ms), flap rotates open in 3D (900 ms), card rises out (900 ms), envelope dissolves as the card's content becomes the hero (600 ms). Music starts on this tap, muted-by-default is NOT used; the tap is the user gesture. `prefers-reduced-motion`: a 300 ms crossfade instead. A "Skip" text button appears after 1 s. The envelope never appears again in the same session (sessionStorage), so reloads land on the hero.
1. **Hero.** Gold cross-and-branch ornament draws itself in (1.2 s stroke animation). Lines in order, 60 ms stagger: "Together with their families" (italic serif), names in script with a gold ampersand (one shimmer sweep, once), "invite you to celebrate their Holy Matrimony", date in small caps serif, city. Below: a small guest greeting "with love, for Sibin & Family". A subtle scroll cue (thin gold line that breathes).
2. **Verse.** One scripture (1 Corinthians 13:4–7) in italic serif, reference below, framed by a hairline divider with a small gold flourish.
3. **Invitation wording.** Formal wording in the selected language: parents' names, "request the honour of your presence at the Holy Matrimony of", the couple's full names, church, date, time. Malayalam uses the Malayalam serif at a larger line-height.
4. **Events.** Vertical timeline joined by a gold hairline with small ornaments at each node. Each event: name in script, day/date/time in serif, venue + address, dress code line if any, two actions: "Directions" (Google Maps) and "Add to calendar" (Google link and .ics download). Three placeholder events: Madhuram Veppu, Holy Matrimony, Reception.
5. **Countdown.** "Counting the days to the ceremony" with four values (days, hours, minutes, seconds) in serif numerals; each digit change crossfades with a 2 px blur (200 ms). Live, computed from the ceremony timestamp in IST.
6. **The couple.** Two arch-shaped portraits (church-arch top radius), names in script, "son of / daughter of" with parents, one short line each. Side by side from 768 px.
7. **Our story.** Three moments (met, engaged, wedding) on a short timeline with year, title, two sentences.
8. **Gallery.** 8 placeholder photos in a 2-column masonry; tap opens a full-screen lightbox with swipe and zoom; images lazy-load with a blurred placeholder.
9. **Livestream.** A paper card: "Can't be there in person?" with a "Watch live" button (YouTube placeholder URL) and the start note.
10. **Blessings & footer.** "Your presence is the greatest blessing" with the no-boxed-gifts note; hashtag; closing verse (Mark 10:9); names and date; small "Share this invitation" button (Web Share API, falls back to copy link); credit line.

Persistent chrome:
- **Music pill** bottom-right (dark green glass, "♪ Music on/off"), pulses while playing, remembers mute in localStorage.
- **Language toggle** top-right ("മലയാളം" when in English, "English" when in Malayalam). Persisted in localStorage and readable from `?lang=ml`.
- **Bottom nav** (phones only, appears after the hero): Invitation · Events · Gallery · Directions. Active section highlighted. Hidden while the lightbox is open.

Out of scope now: RSVP, admin, analytics, per-guest link generator, custom domain.

## 4. Visual system

**Colour tokens**

| Token | Hex | Use |
|---|---|---|
| paper | `#F6F2EA` | card / page background on phones |
| parchment | `#ECE5D8` | backdrop around the card on larger screens |
| paper-deep | `#EFE9DE` | alternating section tint, inputs |
| ink | `#1E2A24` | headings, names |
| ink-soft | `#3A4640` | body text |
| muted | `#6E6F63` | secondary text, captions |
| gold | `#B08D57` | line art, hairlines, buttons |
| gold-light | `#D9BE8C` | shimmer highlight |
| gold-dark | `#8A6A3B` | pressed states, small text on paper |
| sage | `#9BA78F` | leaves, soft chips |
| moss | `#5B6B55` | dark leaves, nav active |
| wine | `#6B2D3A` | wax seal, hashtag |

Contrast: body text ink-soft on paper is ≈ 9:1; gold text is used only at ≥ 18 px or for non-text lines.

**Type**

| Role | Family (next/font, Google) | Size (clamp mobile→desktop) |
|---|---|---|
| Names, section titles | Pinyon Script 400 | names 56→96 px; titles 40→56 px |
| Serif headings, wording, body | Cormorant Garamond 300/400/500/600 + italics | h 28→40 px; body 17→19 px, line-height 1.7 |
| UI (nav, buttons, chips) | Jost 400/500 | 13–15 px, letter-spacing 0.02em |
| Malayalam wording and titles | Noto Serif Malayalam 400/600 | body 16→18 px, line-height 1.9; titles 32→44 px |

No tracked all-caps eyebrow labels. Section lead-ins are italic serif sentences.

**Surfaces & shape.** Flat paper with a faint fibre texture (SVG noise, 3 % opacity) and a soft vignette. Cards are paper with a 1 px gold hairline and no shadow; only the floating card (desktop) and the envelope carry shadows. Radii vary by meaning: photos use an arch (top radius 999 px), buttons are pills, cards 4 px.

**Ornaments.** A small library of inline SVG line art in `currentColor` with 1.25 px strokes: cross with two branches, interlocking rings, olive branch, eucalyptus sprig, divider flourish, dove, arch frame. Drawn in on first view using stroke-dashoffset. Reused across sections so the page reads as one hand.

**Motion rules** (from the emil-design-eng checklist): animate only transform, opacity, clip-path and filter; strong ease-out `cubic-bezier(0.23,1,0.32,1)` for entrances, `cubic-bezier(0.77,0,0.175,1)` for on-screen movement; UI feedback 160 ms, section reveals 600–800 ms, ceremonial intro up to 900 ms per phase; one reveal per section heading, not per card; hover only under `(hover:hover) and (pointer:fine)`; buttons `scale(0.97)` on press; reduced motion keeps opacity fades and removes movement; no autoplay audio.

## 5. Responsive behaviour

- **< 768 px:** the viewport is the card. Content column max 36 rem for text. Bottom nav visible.
- **768–1023 px:** card floats on parchment at max 46 rem with a soft shadow; events timeline stays vertical; couple portraits side by side.
- **≥ 1024 px:** same floating card centred; faint oversized line-art branches in the margins moving at 0.3× scroll speed (parallax off under reduced motion); envelope rendered at min(90vw, 520px) centred. The envelope and hero always fill the viewport height using `100dvh`.

## 6. Architecture

- **Next.js (App Router, latest) + TypeScript + Tailwind CSS v4** (tokens as CSS variables in `@theme`), deployed statically on Vercel. No API routes.
- **Content** lives in `src/content/wedding.ts`, typed by `src/content/types.ts`. Every user-facing string is a `{ en: string; ml: string }` pair. Dates are ISO strings with the IST offset.
- **Language** via `LangProvider` (`src/lib/i18n.tsx`) exposing `lang`, `setLang`, and `t(pair)`; initial value from `?lang`, then localStorage, then `en`.
- **Guest name** parsed client-side from `?to=` by `parseGuestName` (`src/lib/guest.ts`): URL-decoded, trimmed, max 60 chars, HTML-unsafe characters removed, falls back to `null`.
- **Calendar links** built by `googleCalendarUrl(event)` and `buildIcs(event)` (`src/lib/calendar.ts`).
- **Countdown math** in `getCountdown(targetIso, now)` (`src/lib/countdown.ts`).
- **Animation**: `motion` (motion/react) for orchestration and in-view reveals; CSS keyframes for ambient loops; Lenis for smooth wheel scrolling on pointer devices only.
- **Gallery**: `yet-another-react-lightbox` with the Zoom plugin.
- **Audio**: a single `Audio` element created in `useAudio()` after the envelope tap; looped; volume 0.5.
- **Fonts**: `next/font/google`, `display: swap`, Latin subset only for Latin faces, Malayalam subset for Noto Serif Malayalam.
- **Images**: local files in `public/photos`, rendered with `next/image`, `sizes` set per layout, blur placeholders.

Component map: `src/components/intro/Envelope.tsx`, `src/components/chrome/{MusicPill,LangToggle,BottomNav,SmoothScroll,Backdrop}.tsx`, `src/components/sections/{Hero,Verse,Invitation,Events,Countdown,Couple,Story,Gallery,Livestream,Footer}.tsx`, `src/components/ornaments/*.tsx`, `src/components/ui/{Button,Reveal,SectionTitle,Card}.tsx`.

## 7. Error handling and edge cases

- Missing or malformed `?to=`: no greeting line is rendered; nothing else changes.
- Ceremony date in the past: countdown shows "Married!" state instead of negative numbers.
- Audio file missing or blocked: music pill shows the "off" state and does nothing; no console errors surface to users.
- Web Share API unsupported: "Share" copies the URL and shows "Link copied" for 2 s.
- JavaScript disabled or hydration pending: the page renders fully (hero visible) because the envelope overlay is only mounted on the client after hydration and is skipped for returning sessions.
- Reduced motion: envelope crossfade, no stroke drawing, no parallax, countdown digits swap without blur.
- Lightbox open: body scroll locked, bottom nav hidden, Escape closes.

## 8. Testing

- Unit tests (Vitest) for `parseGuestName`, `googleCalendarUrl`/`buildIcs`, `getCountdown`, and `LangProvider` initial-language resolution.
- `npm run build` and `npm run lint` must pass.
- Visual QA with Playwright scripts: screenshots at 393×852 (phone), 820×1180 (tablet), 1440×900 (desktop); envelope before and after tap; lightbox open; Malayalam mode. Checked by eye against this spec.
- Manual checks later on a real phone through WhatsApp's in-app browser.

## 9. Success criteria

- Opens from a WhatsApp link on a phone and feels premium within the first two seconds (envelope visible, fonts loaded without layout shift).
- Lighthouse mobile performance ≥ 90 on the built site; first load under ~1.5 MB including one hero photo and fonts (music loads only after the tap).
- Every string switches between English and Malayalam without layout breaking.
- All content changes for the real wedding are edits to `src/content/wedding.ts` and files in `public/`.

---

## Revision 2 (2026-10-02, after Sibin's review: "everything is bad, looks very bland")

The restrained stationery look in §4 was rejected as empty. The visual system is replaced by **"Gilded Wine"**; structure, content model and behaviour in §3, §6 and §7 are unchanged.

| Token | Hex | Use |
|---|---|---|
| paper / paper-deep / parchment | `#F7F1E6` / `#F1E7D6` / `#EFE6D6` | ivory sections (with a faint damask pattern and blush glows) |
| ink / ink-soft / muted | `#1F0B10` / `#3D2A2E` / `#7A6568` | text on ivory |
| wine / wine-deep / wine-black | `#5C1E2B` / `#2E0F16` / `#1A080D` | hero veil, countdown and footer bands, page backdrop on desktop, wax seal |
| gold / gold-light / gold-dark | `#C9A45C` / `#EED9A6` / `#8C6B2F` | foil gradients for names, frames, ornaments, buttons |
| blush / rose / rose-deep | `#E8C4C4` / `#C98B8B` / `#A6606B` | roses, petals, lead sentences |

- **Hero:** full-bleed photograph under a wine-to-ink gradient, gilded double frame with corner flourishes, gold cross with roses, gold-foil script names with a slow shimmer, Cinzel date.
- **Type:** Pinyon Script (names, titles), Cormorant Garamond (wording, body), **Cinzel** (dates, labels), Jost (UI), Noto Serif Malayalam.
- **Ornaments:** gold-gradient strokes (userSpaceOnUse gradients so straight lines render), filled leaves, stylised roses, corner flourishes, rose dividers.
- **Motion added:** falling rose petals and gold dust on a fixed canvas (reduced motion disables it), continuous foil shimmer on names, glow behind the envelope.
- **Sections:** photo-headed event cards with gold medallions; wine countdown band with gold numerals; gilded arch portraits with a rose at the keystone; gold-matted gallery; wine footer with watermark.
- **Lesson recorded:** background utility classes must never set `position` (they override `fixed`/`absolute` utilities because they are unlayered).

---

## Revision 3 (2026-10-02, after Sibin's review of the envelope and a change of brief)

The event is now **Tosmy & Priyank's Engagement, Saturday 21 November 2026, 4 pm onwards, St. Thomas Church, Gandibagilu** (not a wedding). The dark "Gilded Wine" look was rejected ("dont keep the theme a dark colors"); the palette is now sampled from the couple's own outfits in `public/photos/Tosmy.jpeg` (mint saree and shirt, cream blouse, white backdrop), with light, airy watercolor-stationery styling modelled on the dusty-blue template Sibin shared.

| Token | Hex | Sampled from / use |
|---|---|---|
| accent | `#A3BCBF` | saree & shirt mid-tone — envelope, hairlines, ornaments |
| accent-deep | `#6F9196` | wax crest, buttons, script accents |
| accent-dusk | `#4E6F74` | dates, bands, headings on light |
| accent-night | `#33484C` | footer, deepest band |
| tint / mist | `#D6E3E4` / `#EDF3F3` | pale washes, backdrop glows, desktop page field (`#E9F0F0`) |
| cream | `#EFE9DF` | the blouse — warm neutral accent |
| paper / parchment / paper-deep | `#FBFAF7` / `#F3F1EC` / `#EEF3F3` | white paper surfaces |
| ink / ink-soft / muted | `#2A3A3C` / `#4B5D5F` / `#7F8F90` | text |

Legacy token names (`wine*`, `gold*`, `blush`, `rose*`) are aliased to these until each section is restyled.

- **Type:** Cormorant Garamond light uppercase, widely tracked, for names (`font-display`); Great Vibes for script ("and", greetings); Jost for tracked labels; Cinzel and Pinyon Script dropped.
- **Envelope:** full-bleed on phones (per the Pinterest reference), wide 720 px on larger screens; seafoam cotton-paper faces (clip-path polygons + inline SVG grain), fold shadows, photo lining duotoned into seafoam, white card inside (YOU ARE INVITED / TOSMY / and / PRIYANK / date), wax crest with `T | P` and a laurel (modelled on the "O|A" crest reference). Florals come from a manifest in `src/content/florals.ts` (`public/florals/*`), empty until Sibin supplies artwork; the procedural watercolor module (`ornaments/Watercolor.tsx`) is kept as a fallback but judged not premium enough.
- **Hero:** the couple's photo in natural colour fading into white paper, the crest overlapping its bottom edge, names below in Cormorant caps, deep-seafoam date line, guest line in script.
- **Content model:** `parentsLine`, `hostsGroom`, `hostsBride` optional (hidden until known); `hashtag` hidden when empty; single `engagement` event; story/gallery/livestream/music remain placeholders.
- **Assets:** Pixabay (Content Licence, no attribution) is reachable through a real browser session and is the approved stock source if more artwork is needed; Rawpixel, Vecteezy, Freepik and the Pixabay CDN are blocked to plain requests.
- **Open:** florals from Sibin; parents' names; a higher-resolution couple photo for desktop; confirm Tosmy = groom, Priyank = bride; regenerate `public/og.jpg` and the favicon in the new palette; restyle remaining sections one by one.

### Revision 3a — envelope rebuilt after review ("the envelope is the main thing")

- **Phones:** a portrait envelope (aspect 0.72) sized to cover the screen height, so the sides crop slightly like the Pinterest reference; all four folds meet at the centre (`--meet: 50%`, flap tip `--flap: 52%`). A tap scales it to 0.66 (CSS transition on `.env-scene`), then the seal lifts, the flap swings open on the photo lining, the card rises, and the gate dissolves. Larger screens keep the landscape envelope (1.36) and skip the shrink.
- **Paper:** a real cotton-paper photo (`public/textures/paper.jpg`, from Pixabay image 2061709, Pixabay Content Licence, processed to a neutral grey grain) multiplied over mint face gradients; the synthetic SVG grain/linen is gone. Fold depth comes from paired shadows (tight contact + wide ambient) along the flap and bottom-flap edges, lit edge lines, a hairline of shade inside each fold, and a vignette.
- **Seal:** Sibin's gold "P&T" wax seal (`public/florals/seal.png`); the drawn SVG seals were removed. No florals on the envelope (bouquet and sprays were tried and rejected by Sibin). The hero shows only the couple's photo and the words (crest and florals removed); the Couple section carries the photo in an arch with the two sprays.
- Dead code removed: `WaxSeal.tsx`, `ornaments/Watercolor.tsx`, `ornaments/Eucalyptus.tsx`.

### Revision 3b — premium envelope (2026-10-02, after "redesign the envelope into a premium envelope")

Research first: no installable envelope component exists for this stack (checked npm, the shadcn and 21st.dev registries, Aceternity/Magic UI/Motion Primitives, and the open-source wedding repos people cite — those are gradient boxes with emoji hearts). The build stays custom; the techniques below are what premium digital stationery (Paperless Post, Greenvelope) actually does.

- **Geometry:** a real "euro flap" envelope instead of four flaps meeting at one point. Sides meet at the centre (`--meet: 50%`), the bottom flap overlaps them with its tip above the centre (`--bottom: 40%`), the pointed top flap comes down past the centre (`--flap: 66%`) with the seal on its tip. One geometry for phones and desktop (`GEOMETRY` in `EnvelopeShell.tsx` mirrors the CSS variables), so the portrait/landscape overlay duplicates are gone. The seal is smaller (17% of the width on phones, 12.5% on desktop) so the fold structure shows around it.
- **Seal lifts with the flap.** It is rendered inside the flap element, so it rotates up with the paper and disappears edge-on past 90° (backface hidden on the wrapper and on the image: Chrome does not hide composited children on its own).
- **Liner:** the pocket shows the couple's photo in natural colour with a light seafoam tint and a hinge shade (the duotone looked grey). The inside of the flap is pale lined paper (`#e2ecea`, light grain, soft highlight); a photo-derived wash was tried and read as dark slate because the paper texture is a mid-grey multiply layer.
- **Motion:** the card rises on a slow heavy spring (stiffness 54, damping 15) with a slight scale and settles; desktop tilts the envelope under the pointer (±7°/±9°, springs, only with a fine pointer); one slow light pass crosses the paper (`.env-sheen`, transform-only, off under reduced motion and while opening). Hero at 1.7 s, dissolve 2.0–2.7 s (plus 0.5 s shrink on phones). Card rise is −38% of its height on phones and −48% on desktop (card aspect 1.45 and smaller type there), chosen so the whole text block clears the fold and the side flaps while the card's top stays on screen.
- **Structure:** `intro/Envelope.tsx` (gate: phases, timers, audio, skip, hint, tilt) → `intro/EnvelopeShell.tsx` (the paper envelope, presentational, takes the liner photo, seal art, greeting and the card as children) → `intro/InviteCard.tsx` (the card's content).
- **Gotcha recorded:** the Next 16 dev server keeps its image-optimizer cache in `.next/dev/cache/images` (not `.next/cache/images`). After swapping a photo under the same filename, a stale WebP for one width kept serving the old placeholder (the church photo appeared on phones only). Delete that folder after replacing images in place.
- **QA:** screenshots cannot time an animation (Playwright's capture latency is 300–900 ms); the scratchpad script records a WebM with `recordVideo`, marks the tap with a red pixel, and extracts frames at exact offsets with Playwright's bundled ffmpeg.

### Revision 3c — hero photo (2026-10-02, Sibin: "in the hero keep back the old image, only in the hero")

- The hero goes back to the original church scene (couple at the altar, stained glass). Its only surviving copy was the optimizer's 828×1104 WebP, saved as `public/photos/hero-church.jpg`; a higher-resolution original would sharpen it on 3× phones.
- Content model: `wedding.couple.photo` is the pair photo (`hero.jpg`), used by the envelope liner and the Couple section; `wedding.hero.photo` is the scene (`photos.heroScene`). `hero-wide.jpg` is unchanged and still unused.

### Revision 3d — sections removed (2026-10-02, Sibin: "the gallery and our story sections are not needed")

- `Story` and `Gallery` (with its lightbox) are gone: components deleted, `story`/`gallery` dropped from the content model and the photo index, their UI strings removed, `yet-another-react-lightbox` uninstalled. The bottom nav is three items (Invitation, Events, Directions) and no longer listens for the lightbox. Page order: Hero, Verse, Invitation, Events, Countdown, Couple, Livestream, Footer.
- The nav's Directions link looked up a `holy-matrimony` event that no longer exists; it now falls back to the first event.
- `public/photos/gallery-*.jpg` are left on disk (unused, not bundled) in case a gallery comes back.

## Revision 4 (2026-10-02, after Sibin's reference: "this is how I want the envelope")

Sibin shared the myshaadhilink "christian-elegance" envelope (a Veo-generated poster + 8 s MP4, confirmed in their DOM) and asked for that look. Decisions: build it live in code (no video; keeps the guest name and Malayalam), keep **Seafoam & Ivory** (pale mint paper, deep-seafoam line art, Sibin's gold seal) rather than the reference's blush and burgundy.

**Composition, traced from the 1080×1920 poster.** On phones the screen *is* the envelope (no cropping, no shrink). "You are invited" at 20% height in Cormorant italic (about 5% of the height tall). The top flap is a pentagon: straight sides down to 40%, then a shallow point at 52%, with the seal (43–44% of the width) centred on its tip. The guest's name in script at 76%. "TAP TO OPEN" at the bottom. Letterpress line-art florals in two layers: on the flap (two roses, a bud, a leaf) and on the lower paper (a large rose with leaves, two buds, a sprig, a side rose, a daisy). Larger screens: a landscape envelope (aspect 1.4, 720 px) with the same parts scaled (headline at 12%, sides 30%, point 58%, seal 26%).

**Paper.** `.env-paper`: pale seafoam gradient (#e6eeec → #d4e0dc) with the fibre noise soft-lit over it and a generated speckle tile (`--env-speckle`: ~70 warm/mint flecks and 14 short fibres in a 420 px tile). The heavy cotton-linen photo texture is gone from the envelope (it read as towelling at full bleed).

**Letterpress.** `ui/Letterpress.tsx`: the drawing (SVG or transparent PNG, dark on transparent) is used as a CSS mask over two layers: white at 85% nudged 0.7/1.1 px down-right (the lit edge of the impression) under accent-dusk ink at 55%. Artwork by role (`roseOpen`, `roseSide`, `bud`, `sprig`, `daisy`, `leaf`) in `content/florals.ts` → `lineArt`; placements live in `EnvelopeShell.tsx` (`PHONE_FLAP`, `PHONE_POCKET`, `WIDE_*`). A role without artwork is skipped.

**Pocket.** Side flaps and a bottom flap with rounded petal tops (SVG `clipPath`s in object-bounding-box units: `#env-clip-sides`, `#env-clip-bottom-p/-w`), the inside wall shaded under the hinge, soft shade along the side and bottom flap edges, lit hairlines. The card starts inside the pocket (top at 66% of the envelope) and is clipped only at the envelope's bottom edge.

**Motion.** Tap → flap swings up (1.1 s, perspective 1400, seal and headline ride on it) → past vertical it drops behind the card → the card rises on a slow spring (−96% of its height on phones, −91% on desktop) → hero at 1.9 s → dissolve 2.2–2.9 s. No shrink step any more. Pointer tilt and the light pass stay; reduced motion / Skip crossfade.

**Open at the time of writing:** the line-art florals are being sourced (Pixabay Content Licence / CC0 only); until they land the layout renders without them.

**Florals landed (same day).** Seven drawings, all Pixabay Content Licence (no attribution required), processed to masks in `public/florals/line/` and mapped by role in `content/florals.ts`: `roseOpen` ← Pixabay 8815285 (OpenClipart-Vectors), `roseStem` ← 8851543 (GDJ), `roseSide` ← 7169418 (BiancaVanDijk), `bud` ← 2597154 (Roark, cropped to the head), `sprig` ← 37594 (OpenClipart-Vectors), `leaf` ← 32772 and `daisy` ← 32805 (Clker-Free-Vector-Images). The two 2024 roses are AI-generated uploads, allowed under that licence. Full source list in `docs/research/06-envelope-line-art-sources.md`. A CC0 SVG side rose from freesvg.org was evaluated and not used: it is a horizontal bloom with a hairline stroke that disappears at phone size.

**Closed envelope reads as one sheet (Sibin: "can see the V layer to both the sides").** The bottom flap's rounded edge (lit hairline + shade) is now hidden while sealed and fades in 0.35 s after the flap starts to lift, so the closed front shows only the top flap's crease; the pocket still reveals on opening.

**Nothing is remembered (Sibin: "when opening don't save the cookie").** The sessionStorage flag, the pre-paint `data-opened` script in the layout and its CSS rule are gone; every load starts sealed. Skip and reduced motion still crossfade.

**Conventional pocket (Sibin: "the inside doesn't look good, make it look like a normal envelope interior").** Flaps have straight edges again: side flaps are triangles meeting at the centre, the bottom flap rises from 70% (phone) / 68% (desktop) at the edges to a point at 55% / 50%. The inside wall is the same stock a shade deeper with a soft recessed vignette. Depth comes from cast shadows, not hairlines: the open flap's hinge across the top of the wall and the side flaps along their edges (drawn behind the card), and the bottom flap on whatever is behind it (drawn in front of the card); paper edges catch only a faint light. All of it fades in as the flap lifts, so the closed front stays one sheet.

### Revision 4a — simplifications (2026-10-02, Sibin: "the navbar is not needed… remove the skip… one good medium bouquet instead of multiple random flowers")

- **Bottom nav removed** (component, its strings, the nav-height padding on the footer; the music pill now sits at the bottom right). Scrolling is the only navigation.
- **Skip button removed** from the envelope; reduced motion still crossfades.
- **One bouquet.** The scattered flap/pocket florals are gone (their PNGs deleted; sources stay recorded in `docs/research/06-envelope-line-art-sources.md`). The envelope carries a single pressed bouquet low on the pocket's left (44% of the width on phones, 22% on desktop, tilted −6°), with the guest's name centred just under the seal (72% on phones, 84% on desktop).
- The card now starts a little lower in the pocket (72% / 70% of the height) so its top edge never peeks above the bottom flap while sealed; its rise is −106% / −96% of its own height.

**Bouquet chosen.** Fine-line ranunculus and peony bouquet, Pixabay 6992182 by lyubmalee (Content Licence, no attribution required), the only true stationery-style bouquet found across ~400 Pixabay results and Openclipart. Hairlines were dilated by 1.5 px so they survive phone scale; pressed ink raised to 74%. Placed in the lower-left corner: 50% of the width from 71.5% down on phones (tilted −8°), 29% from 50% down on desktop; the guest's name sits at 67.5% / 84%.

**Straight into the hero (Sibin: "the card popup is not needed… the inside view is not needed… transition properly with no glitch").** The card, the pocket (side/bottom flaps, interior wall, shading, clip paths) and `InviteCard.tsx` are gone. On tap the hero starts composing beneath at once (`markOpened` at 0 ms), the flap swings up (0.8 s, quick-start ease) while the envelope zooms to 1.06 and dissolves over 0.8 s from 380 ms; the gate unmounts at 1.23 s. Because the hero's photo is already loaded under the gate and its lines stagger in during the dissolve, nothing pops.

### Revision 4b — colour bouquet under the seal (2026-10-02, Sibin: "keep it centered… increase the size… make it multicolor")

- The line-art bouquet is replaced by Sibin's own watercolour bouquet (`public/florals/bouquet.png`, the one in the Couple section; Freepik, credited in the footer), centred behind the wax seal: 74% of the width from 37% down on phones, 38% from 29% down on desktop. The seal sits on its centre, the guest's name moves to 80% / 88%.
- It is printed across the crease: one copy inside the flap (positioned in the flap's own box) and one on the lower paper clipped to below the crease (`.env-below-flap`), so the two read as one print while sealed and the upper flowers lift with the flap on opening.
- The letterpress machinery (`ui/Letterpress.tsx`, `lineArt`, `.press-*`, `public/florals/line/`) is removed; the sourced drawings stay documented in `docs/research/06-envelope-line-art-sources.md` for reference only.

### Revision 4c — teal script seal and asset cleanup (2026-10-02)

- **Seal.** Sibin generated a new wax seal from the prompt written for them (deep seafoam wax #4E6F74, interlocking copperplate "P&T"). Installed as `public/florals/seal.png`: trimmed, squared to 1024×1024 with transparency (618 KB; next/image serves it at 256–384 px). The gold laurel seal it replaces is gone.
- **Unused images removed:** the eight gallery placeholders, `hero-wide.jpg`, the groom/bride portrait crops (never rendered; `Person.photo` is now optional and `hero.photoWide` is dropped), the root `seal.png`, the Next.js boilerplate SVGs and `textures/paper.jpg`. `public/` now holds only what renders: the music, `og.jpg`, the three photos (`hero.jpg`, `hero-church.jpg`, `event-engagement.jpg`), the two watercolour florals and the seal, plus `Tosmy.jpeg` kept as the untouched master the crops come from.
- Gotcha repeated: after swapping a file in place, clear `.next/dev/cache/images` or the dev server keeps serving the old picture.

### Revision 5 — one type system (2026-10-02, Sibin: "the font, text sizes and hierarchy… choose a stylish font and fix all these issues for all the sections"; then "max 2 fonts for English and max 2 for Malayalam"; then "looks like 3 or 4 styles, keep only 2")

**Audit.** Before: 4 families (Great Vibes, Cormorant Garamond, Jost, Noto Serif Malayalam), 49 distinct font sizes, 9 tracking values, 9 line-heights, the couple's names set five different ways (tracked caps in the hero and under the photo, script on the card and in the footer, a script watermark), dates in two families and four sizes, labels in five tracking values, and the old helpers (`.font-script`, `.tracked`, the Malayalam overrides) written outside Tailwind's layers so utilities like `leading-none` were silently ignored.

**Research** (luxury stationery 2025–26, Google Fonts, Malayalam faces): script reserved for names only, a high-contrast serif for everything else, at most two families; Pinyon Script is the most legible formal copperplate at phone sizes and matches the copperplate wax-seal monogram; Cormorant Garamond stays; Noto Serif Malayalam is the only formal Malayalam serif on Google Fonts (Chilanka is the hand-lettered option if ever wanted).

**System.** Two styles per language, each with one job: Pinyon Script for the couple's names and the guest's name; Cormorant Garamond, upright and normal case, for everything else including buttons (Jost dropped, no italics, no spaced capitals; hierarchy from size, weight and colour only). Noto Serif Malayalam for everything in Malayalam. Each role is one class in `globals.css` inside `@layer components` (`t-names`, `t-names-md`, `t-names-sm`, `t-title`, `t-verse`, `t-lead`, `t-strong`, `t-body`, `t-label`, `t-meta`, `t-count`, `t-ui`, `t-ui-sm`), fluid between 393 px and 1200 px with its own Malayalam size and leading (Malayalam glyphs are taller: a little smaller, more leading). Fonts load as variable files. `CoupleNames` renders the names identically in the hero, the card and the footer ("Tosmy / and / Priyank"); `ScriptText` sets "&" in the serif inside script lines.

**Per section.** Hero: label, names, lead, label date, body time·venue, script guest line. Verse: upright epigraph with label reference. Card: label opener, lead invite line, names, label date, strong time, body venue, muted closing. Events: serif event name over the photo, label date, strong time and venue, body address and note; buttons in the serif. Countdown: lead, serif numerals, label units (the foil gradient is gone from text). Couple: label + script name per person, stacked on phones, three columns from md. Livestream: lead, button, body note. Footer: serif "With love", body blessing, lead verse, names (md), label date, share, meta credits; the script watermark and the doubled "With love" are gone. Section titles are upright serif with the lead sentence beneath them. Envelope: serif headline, script greeting, "Tap to open" label.

**Checks:** typecheck, lint, 17 tests and the production build pass; screenshots in `docs/qa` (`sheet-2-type-phone.jpg`, `sheet-3-type-desktop.jpg`, `sheet-4-type-phone-ml.jpg`).

### Revision 5a — one spacing scale (2026-10-04, Sibin: "fix the padding and spacing issues everywhere… consistent padding within the section, between paragraphs, proper leading")

One scale, chosen by relationship and documented beside the type roles in `globals.css`: 1 between lines of one detail group; 2 between a label and its value (and title → lead is 3); 4 between paragraphs and between detail groups; 6 around the names block, before a button, after an ornament; 8 between groups; 12 (16 from md) from a title block to the section's content and between blocks. Every section is `px-6 py-20 md:py-28`; cards are `p-6 md:p-8` (the formal card keeps `px-6 py-12 md:px-14 md:py-16`); content widths are 30rem (countdown, livestream), 36rem (verse, titles, footer) and 40rem (cards, couple). Leads and the verse gained a little leading (1.5 / 1.55) for two-line sentences. The footer's blessing is now the lead of its title block with the rose ornament, so it follows the same rhythm as every other section. The couple block keeps `mt-16 md:mt-20` above and below the photo because the frame and sprays overhang it by about 1rem, which makes the visible gap match 12 / 16.

### Revision 6 — say everything once (2026-10-04, Sibin: "lots of contents are repeating… only once we will mention, so the sections will also be reduced")

- **Order:** Hero (the greeting) → Couple → Verse → The celebration → Countdown → Livestream → Footer. The formal card section is gone; its wording moved into the hero.
- **Hero is the greeting:** "Dear ‹guest›," in the names voice, then "Together with their families" (or the hosts' names and the request line when those are filled in), the names, "invite you to celebrate their Engagement", and "Your presence and prayers will make our joy complete." No date, time or venue here: those are said once, in the celebration card, which also carries the directions and calendar buttons.
- **Envelope:** the guest's name alone under the seal, like an addressed envelope; the "Dear" belongs to the hero now. Without a guest name the envelope shows only "You are invited".
- **Footer:** "With love", the blessing as its lead, the rose ornament, and one faint credit line. The Mark 10:9 verse, the names, the date, the share button and "Made with love" are removed. The credit line stays because the music (Kevin MacLeod, CC BY 4.0) requires attribution.
- Unused strings removed from `ui.ts`: forGuest, scroll, saveTheDate, share, linkCopied, madeWithLove, music.
- **Scratch-off countdown** (Sibin: "keep the current one itself, embed scratch in the current one"). The four tiles are unchanged and sit under a brushed seafoam foil (`ui/ScratchReveal.tsx`: a canvas painted at device resolution, strokes erase with `destination-out`, a 22 px round brush). "Scratch to reveal" is printed on the foil and fades at the first touch; once about half the foil is gone it lifts away over 0.7 s and the live counter stays. Enter or Space lifts it for keyboard users; the plate has `touch-action: none` so a finger scratches instead of scrolling; pointer-down is cancelled so a mouse drag cannot select the digits underneath. Nothing is remembered, so every load starts covered, like the envelope.

### Revision 6a — roles, envelope headline, couple row, quieter chrome (2026-10-04)

- **Priyank is the groom, Tosmy the bride** (Sibin's correction). Swapped in `wedding.ts` (names, initials "P & T", photo alt text); the names now read "Priyank and Tosmy" everywhere, matching the P&T seal.
- **Envelope headline** "You are invited" is set in the names voice (Pinyon, `t-names-md`) instead of the upright serif, which Sibin found plain on the flap.
- **Couple section:** "The groom-to-be" and "The bride-to-be" sit on one row at every width again (three-column grid), now that the labels are short normal-case text that fits a phone column.
- **Footer** is only "With love", the blessing and the rose: the music and florals credit line is removed at Sibin's request. Note for later: Kevin MacLeod's Canon in D (CC BY 4.0) and the Freepik bouquet both ask for attribution; the credit strings stay in `wedding.ts` and `florals.ts` if a credits line is wanted back.
- **Music control** is a round icon-only button (the note, pulsing while playing); its label lives in `aria-label` and `title`.
- Envelope headline reads "You Are Invited" in title case (Sibin, 4 Oct).

### Revision 7 — the couple as an editorial spread (2026-10-04, Sibin: "completely redesign the couple section, right now it looks very ordinary")

The centred title, centred arch and names-underneath pattern is replaced by one asymmetric spread, the only one on the page. The names are the heading, set in the names voice at `t-names` size and placed on a diagonal around the photograph: "The groom-to-be / Priyank" top-left, the photograph (74% wide, set to the right) in its double hairline arch, "The bride-to-be / Tosmy" bottom-right, "Two hearts, one calling." centred beneath. The P&T wax seal from the envelope pins the photograph's bottom-left corner, tilted 8°, in place of an ampersand; a single watercolour spray bleeds off behind the top-right corner. From md the photograph takes a 24rem left column and the names stack in the right column, left-aligned, with a rule-and-ampersand between them; the seal moves to the bottom-right corner toward the names and the spray to the top-left, mirrored. "The couple" title and its string are removed. Family lines and notes still render under each name when filled in.

### Revision 7a — the print and the rings (2026-10-04)

Sibin's iterations on the spread: the wax seal on the photo corner was first swapped for an ink-stamp monogram (an SVG rubber-stamp impression, rejected before it shipped), then for a watercolour of the couple's hands (`public/photos/engagement.png`, rejected: "not blending in"), and finally for the rings illustration Sibin supplied. The rings' white background is keyed out from the edges inward with a soft edge (`public/florals/rings.png`, 497×384), so the paper shows through them. Layout per Sibin: the photograph on the left, the rings to its right; the arch is gone. The photograph is now a mounted print, a paper mat with one hairline frame laid on the page at a 2.5° tilt (2° from md), with the rings resting against its bottom-right corner and just touching the mat, leading the eye down to the bride's name. The spray stays behind the far top corner. `engagement.png` is no longer used and can be deleted.
- Gutters (Sibin: "the couple photo went too much to the left"): the print is inset 20px on phones and the grid 20px from md, so the hairline frame's outer edge lands on the section's 24px gutter despite the 12px overhang and the tilt; the print is 69% wide so the rings end on the right gutter. Measured: frame 25px from the left, rings 25px from the right, against the verse section's 24px.

### Revision 8 — the celebration as a details card (2026-10-04, Sibin: "completely redesign the celebration section… elegant, don't overdo it")

The photo-headed event card (church photo, icon badge, left-aligned lines, thread-and-diamond connector) is replaced by the details card of a stationery suite: the framed ivory card (36rem), centred, with the event name, then the day set large (`t-count-lg`, 3.25→4.5rem) between two hairlines with the weekday on the left and the time on the right and the month and year beneath, then the venue and locality, the note, and the two actions. The church photograph is gone from this section (it is the hero's), as is the icon. The address line drops the venue's name when it repeats it, so "St. Thomas Church / Gandibagilu" reads once. On phones the two buttons stack at equal width; from sm they sit in one row. New date helpers: `formatDay`, `formatMonthYear`. Weekday and time never break; the month and year wrap first on very narrow phones.

### Revision 9 — the celebration painted on the page (2026-10-04, Sibin: "redesign the ceremony section again, instead of the card approach, with this image inside; keep the content, make sure both blend")

The details card is gone; the watercolour couple Sibin supplied (groom in sage, bride in ivory, seen from behind among eucalyptus and dried stems) is keyed off its white square from the edges inward with a soft edge (`public/florals/ceremony.png`, 718×730, palette PNG) so it sits on the ivory damask like a painting on the invitation itself. The section reads in the order of a printed card at every width: "The celebration" and its lead, the painting (84% wide, at most 22rem), then the particulars set straight on the paper — the event name as a small label, the day between hairlines with the weekday and the time, the month and year, the venue and locality, the note, and the two buttons. All the content of Revision 8 stays. A two-column desktop version (words left, painting right) was built and dropped: inside the 736px sheet the painting came out small and adrift beside a tall text column, and the Malayalam buttons had to wrap. Captures in `docs/qa/*-events*`.

### Revision 9a — the rings move (2026-10-04, Sibin: "make the ring in the couple animated, make sure it's not odd, make it elegant")

Two quiet motions, both on the rings alone. **Setting down:** the rings are no longer part of the print's reveal; they arrive 0.7 s after the print starts to unroll, from a little above (20 px), slightly larger (×1.06) and turned −5°, and settle into place over 1.2 s on the same ease as the print, their drop shadow tightening from a broad, faint one to the resting one as they land. Once only, when the spread scrolls into view. **Catching the light:** after they have landed, a soft band of light crosses them (`.rings-glint`: a skewed white gradient on `mix-blend-mode: overlay` (soft-light was tried first and read as nothing; plain white read as a stripe), clipped to the artwork's own silhouette through `public/florals/rings-mask.png`, a 5 KB alpha copy of the rings), one pass of about 2.3 s then a rest, every 9 s — the rhythm of the envelope's sheen. The band is masked so only the metal and blossoms brighten, never the paper or the print beneath. Under reduced motion the rings simply fade in with the print and the band is not rendered. Nothing else in the spread moves.

### Revision 10 — "Can't be there in person?" painted on the page (2026-10-04, Sibin: "redesign the can't be there in person section, use this image instead of the fly image")

The gilded card with the dove is replaced by the same treatment as the celebration: Sibin's watercolour of the couple's clasped hands (lace sleeve, suit cuff, both rings) set straight on the ivory damask, with the words beneath it. The scan's white is lifted out with a pulled-in curve (alpha runs from 0 at a darkest channel of 247 to 1 at 166, colour un-whitened), so the hands and the suit stay opaque while the grey wash behind them turns translucent and the paper shows through it; the scan's hairline frame and empty margins are cropped away and the top and side edges feathered over 36 px so the halo never ends in a straight line (`public/florals/hands.png`, 806×1000). Because the scan ends in a straight cut through the cuffs, the bottom fifth of the painting is feathered into the paper with a CSS mask. Order: the painting (66% wide, at most 16rem), "Can't be there in person?" promoted from a lead to the section's title, the Watch live button, the note. The section drops the deeper seafoam tint and sits on plain ivory like the celebration; the dove ornament is no longer used. Captures in `docs/qa/*-06-livestream*`.

### Revision 11 — everything arrives on scroll, after the envelope (2026-10-04, Sibin: "from hero to footer, after the envelope opens, start motions: the entire content reveals on scroll")

One rule for every entrance on the page (`useRevealed` in `ui/Reveal.tsx`): the element has scrolled a little way into the viewport **and** the envelope has already opened. Nothing plays unseen behind the envelope, and nothing below the hero is visible until it is scrolled to. The hero keeps its own staged entrance on opening. Every other block is a `<Reveal>`: plain blocks fade in and rise 22 px over 0.9 s; blocks with `stagger` hold still while their `<RevealItem>`s arrive one after another in reading order (0.1–0.12 s apart, each fading in and rising 18 px over 0.85 s). Staggered now: section titles (title, lead, ornament), the verse (ornament, words, reference, ornament), the celebration (title and lead; event name, the date spread, the venue lines, the buttons), the countdown (ornament, heading, the foil), the livestream (question, button, note), each person in the couple spread (role, name, family lines). Paintings and the photograph remain single blocks. The couple's print unrolls and the rings land on the same rule instead of their own in-view triggers. Reduced motion: fades only, 0.4 s, almost no stagger. The Footer's extra wrapper reveal is gone; the title's own reveal does the work. Verified with a Playwright run (frame strips in `docs/qa/reveal-*`): all probes at opacity 0 after the envelope opens, each section arrives when scrolled to, all at 1 at the end.

### Revision 12 — a ribbon on the envelope (2026-10-04, Sibin: "add a tied ribbon, kept the same way as the flower; make it fly like in the air" → "move it up into the centre of the flower behind the seal, bigger" → "it should move along with the seal, same time" → "extend both tails so much and make it move naturally" → a reference photo of a glossy satin bow with twisting, curling tails: "build one like this and make the entire ribbon move")

A satin bow ties the bouquet, knotted under the wax seal (`ornaments/Ribbon.tsx`, in the seal's seafoam, drawn after a classic tied ribbon: two light loops rising up and out of a cinched knot — generated like the tails, the same ribbon width as the tails (12 at the knot, 28 at the lobe) wrapped around a teardrop centreline tilted 24° up, so each loop is an open ring of ribbon with a sliver of its inside along the lower edge, short folds at the knot and a sheen along the top (hand-drawn ovals looked like goggles, a wide band looked heavy; Sibin: "the bow still looks bad", "very thick, keep it light, same like the long ends") — and two long tails that fall in an S, turn over once mid-way — the band pinches to an edge and shows its darker back face from there on — and curl inward at the tips, ending in swallowtails). No ready-made animated bow exists (checked: only Lottie players and icon packs), so the tails are generated: `ornaments/ribbonPath.ts` builds each face of each tail as a band around a centreline that carries a travelling ripple, and every pose has the same path structure, so Motion morphs between eight poses per cycle (unit-tested in `tests/ribbonPath.test.ts`). **The whole bow moves:** sealed, a ripple runs down each tail (6.4 s, the right tail 13% slower and out of phase), a slower undulation runs around each loop (7.1 s) while it flexes about the knot (±1.2°, 4.8 s, each on its own rhythm) and the knot bobs; while the envelope opens everything stirs hard and fast (ripple ×2.8 at 0.9 s, loops ±7°). Reduced motion: still. The bow is stuck to the flap with the seal, a child of the flap drawn just before it, so the seal stays in front, the loops show either side of it and the tails hang past it; it lifts with the seal in the flap's one swing. Sized against the seal (1.7× its width: 75% of the envelope on phones, capped at 374px; 44% on wide screens), knot 3% of the envelope below the flap's tip; 0.86-length tails on phones, 0.5-length on the wide envelope, the tips turning gently inward just above the guest's name, which moves beneath them: 88% of the envelope on phones (was 80%), 92% on wide screens (was 88%). The soft shadow is a CSS drop-shadow on the wrapper rather than an SVG filter, so the morphing paths are not re-blurred every frame. Earlier versions — a small bow at the bouquet's foot, one flying off on its own path, rigid tails swinging from their roots — were replaced at Sibin's request. Captures in `docs/qa/*-00-envelope*` and `docs/qa/ribbon-*`.

### Revision 13 — petals from the seal (2026-10-04, Sibin: "the petals falling animation: remove it from the envelope, it's only needed inside; when tapped to open, blast some petals at the same time, so the petals falling inside have an origin; make the petals falling inside a bit more elegant" → "blast more petals, a lot")

Nothing falls over the sealed envelope any more. The petals canvas (`chrome/Petals.tsx`) is mounted from the start but blank, and starts the instant the envelope is tapped: the Envelope passes the wax seal's centre on screen to `markOpened`, and IntroContext runs its `onOpen` listeners synchronously, before React re-renders the page beneath (which now composes as a transition), so the burst moves with the flap — on the production build both start about 90–115 ms after the tap, in the same frame (dev mode is slower). **The burst:** 90 petals on phones / 120 on wide screens are thrown from under the seal's rim, fanned around straight up (bunched towards up and fastest upwards, 200–640 px/s scaled to the screen) so the shower rises as a crown over the seal and spills at its sides and foot; each sets off within a fifth of a second of the tap, so it unfolds rather than pops; they lie near the viewer, run larger, tumble fast while they fly, and lean on the seafoam kinds so they read on the pale paper. **One motion model** (`chrome/petalField.ts`, unit-tested in `tests/petalField.test.ts`): every petal's velocity relaxes towards the air's — a slow fall, slower while the petal lies flat and faster while it is edge-on, plus a side-to-side sway — so a thrown petal loses its throw within about a second and a half and from then on falls exactly like the ones that drift in from the top. **The drift:** 11 / 18 petals set above the page in a tall band so they trickle in one by one over the first while; each turns over about its long axis (drawn as its width narrowing to an edge and opening again) as well as spinning, with depth (far ones smaller, fainter and pre-blurred), fading in over a beat and out before the bottom edge; burst petals leave the page for good, drift petals come back in from the top. The sprites are now slender blades with a notch at the top, paler at the stem and deeper towards the edges with a faint rim, in four kinds (ivory, pale tint, seafoam, deep seafoam), and the light motes behind them are fewer and fainter. Reduced motion: nothing. Captures in `docs/qa/petals-*` and the refreshed `docs/qa/*-00-envelope.png` (no petals while sealed).

### Revision 14 — the music (2026-10-04, Sibin: "the music feels like a funeral, change the music to something really good")

"Canon in D Major" (Kevin MacLeod's slow strings-and-organ reading, CC BY) is replaced by **"Guitar and piano love melody" by Clavier-Music** — fingerpicked acoustic guitar with piano, tagged wedding, laid back, dreamy, bright, hopeful and romantic, the most downloaded of the candidates (Pixabay Content License: free for personal and commercial web use, no attribution required; `public/audio/love-melody.mp3`, `wedding.music`). The track's 4 s silent tail was cut at an MP3 frame boundary so the loop breathes for about a second instead of going dead, and it is served at 128 kbps joint stereo (a 256 kbps master is heavy for phones). Candidates were gathered from Pixabay Music through a real browser session (its download button sits behind a Turnstile; the player stream is the same full-length file), with these as ready alternates if the pick is wrong: "Softly Sweet – Hopeful Acoustic" (Sonican, solo fingerpicked guitar, pixabay.com/music/acoustic-group-softly-sweet-hopeful-acoustic-339804/), "Romantic Waltz – Warm Grand Piano and Strings" (JuliusH, 3/4 piano and violin, …/modern-classical-romantic-waltz-warm-grand-piano-and-strings-8285/), "Hopeful Piano" (Ivan_Luzan, …/modern-classical-hopeful-piano-146733/), "Sunshine of Love" (Good_B_Music, …/modern-classical-sunshine-of-love-main-382477/), "Hopeful Heart – Acoustic Music Loop" (Sonican, a seamless loop, …/acoustic-group-hopeful-heart-acoustic-music-loop-287238/). Nothing was auditioned by ear: the ranking rests on the creators' tags, popularity and measured start/end loudness.

### Revision 15 — the codebase cleaned (2026-10-04, Sibin: "now clean the codebase completely")

Removed (copies of the removed source files and third-party captures are in `~/wedding-cleanup-backup-2026-10-04`, outside the repo): the unused ornaments (Cross, Dove, Rose, CornerFlourish), the unused Card and SectionTitle (the footer now sets its own three lines), dead props and variants (Button ghost/outline-light, CoupleNames sizes, Floral flip/rotate, Reveal delay/as, DrawOnView immediate/start, Branch/Divider/Rings titles and tones, the language toggle, petals, and verse class names), the smooth-scroll anchor router, the redundant `instant` intro state and the always-zero envelope timings, unused content fields (initials, hashtag, closing verse, per-person and per-event photos, floral credits), unused UI type and date formatters, the legacy colour aliases (wine, gold, blush, rose, sage, moss and friends), unused CSS (paper-grain, vignette, gold-rule, t-meta, anim-glow/float, two texture tiles, duplicate media blocks), 28 MB of reference-site captures, stale QA sheets, the unused engagement.png and event-engagement.jpg, three unused test-only dev dependencies (testing-library, jsdom, the React plugin; tests now run in plain Node). Renamed: `GoldDefs` to `Defs` (ink and bloom gradients), `.band-wine` to `.band`, `.gold-frame` to `.frame`, UI keys `celebrations`/`married` to `celebration`/`engaged`. One easing constant lives in `lib/motion.ts`. `next/image` `priority` became `preload` (deprecated in Next 16). Fixed: the iCalendar writer never escaped semicolons (and its test asserted the bug). New social preview (`public/og.jpg`, the sealed bouquet with the names, date and place) and a seafoam favicon replace the Joel & Merin / wine-and-gold ones. The untouched photo master moved from `public/` to `docs/originals/`.
