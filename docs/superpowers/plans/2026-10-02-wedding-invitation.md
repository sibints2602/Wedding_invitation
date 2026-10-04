# Wedding Invitation Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the premium bilingual (English/Malayalam) Christian wedding e-invitation described in the spec, with a wax-seal envelope intro, gold line-art ornaments, and smooth motion, using placeholder content.

**Architecture:** A static Next.js App Router site; all content in one typed config; a `LangProvider` context switches every string; the client-only `Envelope` gate unlocks audio and hands off to the hero; sections are independent components composed in `page.tsx`; pure helpers (guest name, calendar, countdown) are unit-tested with Vitest.

**Tech Stack:** Next.js 16.3 (App Router, Turbopack), React 19.2, TypeScript 5, Tailwind CSS 4 (`@theme` tokens), `motion` 13 (`motion/react`), `lenis` 1.3, `yet-another-react-lightbox` 3, `lucide-react`, `clsx` + `tailwind-merge`, Vitest + jsdom + Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-02-wedding-invitation-design.md`

## Global Constraints

- Next.js 16.3.x App Router; `next/font/google` for all fonts (`display: 'swap'`); `next/image` for all photos.
- Every user-facing string is a `Localized = { en: string; ml: string }` and rendered through `t()`; no hard-coded English in components.
- Colour tokens only via CSS variables defined in `src/app/globals.css` `@theme` (`--color-paper #F6F2EA`, `--color-parchment #ECE5D8`, `--color-paper-deep #EFE9DE`, `--color-ink #1E2A24`, `--color-ink-soft #3A4640`, `--color-muted #6E6F63`, `--color-gold #B08D57`, `--color-gold-light #D9BE8C`, `--color-gold-dark #8A6A3B`, `--color-sage #9BA78F`, `--color-moss #5B6B55`, `--color-wine #6B2D3A`).
- Motion: animate only `transform`, `opacity`, `clip-path`, `filter`, `stroke-dashoffset`; entrances use `cubic-bezier(0.23,1,0.32,1)`; UI feedback ≤ 160 ms; section reveals 600–800 ms; respect `prefers-reduced-motion` (opacity only).
- No tracked all-caps eyebrow labels; lead-ins are italic serif sentences.
- No RSVP, no API routes, no analytics.
- Full-height sections use `min-height: 100dvh`.
- Git: no commits unless Sibin asks (repository not initialised yet). Task "Commit" steps are therefore replaced by "Verify" steps.

## Review Focus

1. `?to=` containing HTML or very long text (e.g. `?to=<img src=x>` or 500 chars) must render as plain text, truncated to 60 chars, or be ignored. (Task 2 test.)
2. Ceremony timestamp already in the past must show the "Married!" state, never negative numbers. (Task 2 test.)
3. `.ics` with a venue containing commas or newlines must escape them so Apple/Google Calendar import the event. (Task 2 test.)
4. Returning in the same tab (reload) must skip the envelope and land on the hero without a flash of the envelope. (Task 5 manual Playwright check: sessionStorage flag read before first paint via `useSyncExternalStore`.)
5. Switching to Malayalam must not overflow the fixed-width countdown tiles or the bottom nav labels. (Task 7/9 Playwright screenshots in `ml` mode.)

---

## File structure

```
src/app/layout.tsx            fonts, metadata, <LangProvider>, <SmoothScroll>, chrome
src/app/page.tsx              <Envelope/> + section composition
src/app/globals.css           @theme tokens, base, paper texture, keyframes, utilities
src/content/types.ts          Localized, WeddingContent, WeddingEvent, Person, Photo…
src/content/wedding.ts        placeholder content (en/ml)
src/lib/cn.ts                 clsx + tailwind-merge
src/lib/i18n.tsx              LangProvider, useLang, resolveInitialLang
src/lib/guest.ts              parseGuestName
src/lib/calendar.ts           googleCalendarUrl, buildIcs, icsDataUrl
src/lib/countdown.ts          getCountdown
src/lib/useAudio.ts           useAudio hook (create/loop/toggle)
src/components/ornaments/     Cross.tsx Rings.tsx Branch.tsx Divider.tsx Dove.tsx Arch.tsx DrawOnView.tsx
src/components/ui/            Button.tsx Reveal.tsx SectionTitle.tsx Card.tsx
src/components/intro/         Envelope.tsx WaxSeal.tsx
src/components/chrome/        MusicPill.tsx LangToggle.tsx BottomNav.tsx SmoothScroll.tsx Backdrop.tsx
src/components/sections/      Hero.tsx Verse.tsx Invitation.tsx Events.tsx Countdown.tsx Couple.tsx Story.tsx Gallery.tsx Livestream.tsx Footer.tsx
public/photos/*.jpg  public/audio/music.mp3  public/og.jpg
tests/*.test.ts(x)            vitest
vitest.config.ts
```

---

### Task 1: Foundation — tokens, fonts, content schema, placeholders

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `next.config.ts`, `package.json` (scripts: `"test": "vitest run"`)
- Create: `src/content/types.ts`, `src/content/wedding.ts`, `src/lib/cn.ts`, `vitest.config.ts`

**Interfaces produced:**

```ts
// src/content/types.ts
export type Lang = 'en' | 'ml';
export type Localized = { en: string; ml: string };
export interface Person { firstName: Localized; fullName: Localized; parents: Localized; parentLabel: Localized; photo: Photo; note?: Localized }
export interface Photo { src: string; width: number; height: number; alt: Localized; blurDataURL?: string }
export interface WeddingEvent { id: string; name: Localized; startIso: string; endIso: string; venue: Localized; address: Localized; mapsQuery: string; dressCode?: Localized; note?: Localized }
export interface StoryMoment { year: string; title: Localized; text: Localized }
export interface WeddingContent {
  couple: { groom: Person; bride: Person; initials: string; hashtag: string };
  ceremony: { startIso: string; city: Localized; church: Localized };
  verses: { hero: { text: Localized; ref: Localized }; closing: { text: Localized; ref: Localized } };
  wording: { togetherLine: Localized; inviteLine: Localized; formal: Localized };
  events: WeddingEvent[];
  story: StoryMoment[];
  gallery: Photo[];
  livestream: { url: string; note: Localized };
  blessings: Localized;
  music: { src: string; title: string; credit: string };
  siteUrl: string;
}
```

- [ ] **Step 1:** Replace `globals.css` with `@import "tailwindcss";` plus an `@theme` block defining the 12 colour tokens, `--font-script/--font-serif/--font-sans/--font-ml` (bound to next/font CSS variables), `--ease-out-strong`, `--ease-in-out-strong`, and base styles: `html{background:var(--color-parchment)} body{background:var(--color-paper);color:var(--color-ink-soft);font-family:var(--font-serif)}`, a `.paper-grain::before` SVG-noise overlay at 3 % opacity, keyframes `breathe`, `shimmer`, `pulse-soft`, and `@media (prefers-reduced-motion: reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}` scoped with a `.motion-safe-only` escape hatch.
- [ ] **Step 2:** In `layout.tsx` load `Pinyon_Script({weight:'400',subsets:['latin'],variable:'--font-script',display:'swap'})`, `Cormorant_Garamond({weight:['300','400','500','600'],style:['normal','italic'],subsets:['latin'],variable:'--font-serif',display:'swap'})`, `Jost({weight:['400','500'],subsets:['latin'],variable:'--font-sans',display:'swap'})`, `Noto_Serif_Malayalam({weight:['400','600'],subsets:['malayalam'],variable:'--font-ml',display:'swap'})`; put the four `.variable` classes on `<html lang="en">`; set `metadata` (title "Joel & Merin — Wedding Invitation", description, `openGraph.images: ['/og.jpg']` 1200×630, `themeColor: '#F6F2EA'`), `viewport: { width:'device-width', initialScale:1, viewportFit:'cover' }`.
- [ ] **Step 3:** Write `types.ts` as above and `wedding.ts` with the placeholder content: Joel Thomas & Merin Sara Jacob; parents Mr. Thomas Mathew & Mrs. Annie Thomas / Mr. Jacob Varghese & Mrs. Susan Jacob; events Madhuram Veppu (2027-01-22T17:30:00+05:30, bride's residence, Kochi), Holy Matrimony (2027-01-23T10:30:00+05:30 → 12:00, St. Mary's Cathedral, Kottayam), Reception (2027-01-23T18:30:00+05:30 → 21:30, The Grand Pavilion, Kottayam); verses 1 Cor 13:4–7 (KJV / Sathyavedapusthakam 1910) and Mark 10:9; hashtag `#JoelWedsMerin`; gallery of 8 photos from `public/photos`; music `/audio/music.mp3`.
- [ ] **Step 4:** `vitest.config.ts` with `environment: 'jsdom'`, `include: ['tests/**/*.test.{ts,tsx}']`, react plugin, alias `@` → `src`. Add `"test": "vitest run"` script.
- [ ] **Step 5 (verify):** `npm run build` passes with the default page; `npm test` runs 0 tests without error.

### Task 2: Pure helpers with TDD — guest, calendar, countdown, i18n resolution

**Files:** Create `src/lib/guest.ts`, `src/lib/calendar.ts`, `src/lib/countdown.ts`, `src/lib/i18n.tsx`; tests `tests/guest.test.ts`, `tests/calendar.test.ts`, `tests/countdown.test.ts`, `tests/i18n.test.tsx`.

**Interfaces produced:**
```ts
export function parseGuestName(raw: string | null | undefined): string | null; // trims, decodes, strips <>&"'`, collapses spaces, max 60 chars, null if empty
export function googleCalendarUrl(e: WeddingEvent, lang: Lang): string; // https://calendar.google.com/calendar/render?action=TEMPLATE&text=…&dates=YYYYMMDDTHHMMSSZ/…&details=…&location=…
export function buildIcs(e: WeddingEvent, lang: Lang, siteUrl: string): string; // VCALENDAR with DTSTART/DTEND in UTC, escaped SUMMARY/LOCATION/DESCRIPTION, UID `${e.id}@…`
export function icsDataUrl(ics: string): string; // data:text/calendar;charset=utf-8,…
export type Countdown = { days: number; hours: number; minutes: number; seconds: number; done: boolean };
export function getCountdown(targetIso: string, now: Date): Countdown;
export function resolveInitialLang(search: string, stored: string | null): Lang; // ?lang=ml wins, then stored 'ml', else 'en'
export const LangProvider: React.FC<{children}>; export function useLang(): { lang: Lang; setLang(l: Lang): void; t(p: Localized): string };
```

- [ ] **Step 1 (failing tests):**
```ts
// tests/guest.test.ts
import { parseGuestName } from '@/lib/guest';
test('decodes and trims', () => expect(parseGuestName('Sibin%20%26%20Family')).toBe('Sibin & Family'));
test('strips markup', () => expect(parseGuestName('<img src=x>Anu')).toBe('img src=xAnu'.replace('img src=x','') || 'Anu'));
test('caps at 60 chars', () => expect(parseGuestName('a'.repeat(100))!.length).toBe(60));
test('null for empty', () => { expect(parseGuestName('')).toBeNull(); expect(parseGuestName(null)).toBeNull(); expect(parseGuestName('   ')).toBeNull(); });
```
(Write the markup test as: input `'<b>Anu</b> & Co'` → `'bAnu/b & Co'` is wrong; the implementation removes the characters `<>&"'\`` only when they form tags? Keep it simple and deterministic: remove all `<`, `>`, `"`, `` ` `` characters, keep `&` and `'`. Expected: `parseGuestName('<b>Anu</b> & Co')` → `'bAnu/b & Co'`. Test exactly that.)
```ts
// tests/countdown.test.ts
import { getCountdown } from '@/lib/countdown';
test('counts down', () => expect(getCountdown('2027-01-23T10:30:00+05:30', new Date('2027-01-22T10:29:30+05:30'))).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 30, done: false }));
test('past date is done with zeros', () => expect(getCountdown('2020-01-01T00:00:00+05:30', new Date('2027-01-01T00:00:00Z'))).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true }));
```
```ts
// tests/calendar.test.ts
import { googleCalendarUrl, buildIcs } from '@/lib/calendar';
const e = { id:'matrimony', name:{en:'Holy Matrimony',ml:'വിവാഹം'}, startIso:'2027-01-23T10:30:00+05:30', endIso:'2027-01-23T12:00:00+05:30', venue:{en:"St. Mary's Cathedral",ml:'സെന്റ് മേരീസ്'}, address:{en:'Cathedral Road, Kottayam, Kerala',ml:'കോട്ടയം'}, mapsQuery:'St Marys Cathedral Kottayam' };
test('google url has UTC dates', () => { const u = new URL(googleCalendarUrl(e,'en')); expect(u.searchParams.get('dates')).toBe('20270123T050000Z/20270123T063000Z'); expect(u.searchParams.get('text')).toBe('Holy Matrimony'); });
test('ics escapes commas and has UTC', () => { const ics = buildIcs(e,'en','https://x.test'); expect(ics).toContain('DTSTART:20270123T050000Z'); expect(ics).toContain('LOCATION:St. Mary\'s Cathedral\\, Cathedral Road\\, Kottayam\\, Kerala'); expect(ics).toContain('END:VCALENDAR'); });
```
```tsx
// tests/i18n.test.tsx
import { resolveInitialLang } from '@/lib/i18n';
test('query wins', () => expect(resolveInitialLang('?lang=ml', 'en')).toBe('ml'));
test('storage second', () => expect(resolveInitialLang('', 'ml')).toBe('ml'));
test('default en', () => expect(resolveInitialLang('', null)).toBe('en'));
test('garbage ignored', () => expect(resolveInitialLang('?lang=fr', 'xx')).toBe('en'));
```
- [ ] **Step 2:** `npm test` → all fail (modules missing).
- [ ] **Step 3:** Implement the four modules. `getCountdown` uses `Math.max(0, target - now)`; `done = target <= now`. `googleCalendarUrl` formats dates with `toISOString().replace(/[-:]|\.\d{3}/g,'')`. `buildIcs` escapes `\\`, `,`, `;`, newlines per RFC 5545 and uses CRLF line endings. `LangProvider` initialises with `'en'` on the server and resolves on mount (to avoid hydration mismatch), writes `localStorage['lang']`, sets `document.documentElement.lang`.
- [ ] **Step 4 (verify):** `npm test` → all pass; `npx tsc --noEmit` clean.

### Task 3: Ornament library (inline SVG, drawable)

**Files:** Create `src/components/ornaments/{DrawOnView,Cross,Rings,Branch,Divider,Dove,Arch}.tsx`.

**Interfaces produced:** every ornament is `(props: { className?: string; draw?: boolean; delay?: number }) => JSX` rendering an `<svg viewBox … fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">`. `DrawOnView` wraps children, measures each `path` length via `getTotalLength()` on mount, sets `strokeDasharray/strokeDashoffset`, and animates `strokeDashoffset → 0` with WAAPI over 1200 ms (`cubic-bezier(0.23,1,0.32,1)`) when in view (`IntersectionObserver`, once, `rootMargin:'-10% 0px'`); under reduced motion it sets offset 0 immediately. `Arch` renders a clip-path/mask arch (`M0,H L0,R A R R 0 0 1 W,R L W,H Z`) used by Couple portraits.

- [ ] **Step 1:** Author the SVGs with real path data: Cross (vertical 2–62, horizontal 14–50 at y=22, with two olive branches curving from the base), Rings (two circles r=14 offset 10, with a tiny highlight arc), Branch (cubic stem with 7 alternating leaf ellipses as paths), Divider (a 160×16 flourish: centre lozenge, two mirrored S-curves, end dots), Dove (single-stroke silhouette, 48×32), Arch (parametric).
- [ ] **Step 2 (verify):** render all ornaments on a temporary `/ornaments` route (delete after Task 10) and screenshot at 2× to check stroke quality; strokes must read as one hand (same width, round caps).

### Task 4: UI primitives

**Files:** Create `src/components/ui/{Button,Reveal,SectionTitle,Card}.tsx`.

- `Button`: `variant: 'solid' | 'outline' | 'ghost'`, `as?: 'a' | 'button'`, `href?`, `icon?: ReactNode`; pill, Jost 14 px, gold solid with ink text or gold outline; `transition: transform 160ms, background-color 160ms`; `:active{transform:scale(.97)}`; hover gated by `@media (hover:hover)`; visible focus ring (`outline: 2px solid var(--color-gold-dark); outline-offset: 3px`).
- `Reveal`: `motion.div` with `initial={{opacity:0, y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:'-10% 0px'}} transition={{duration:.7, ease:[0.23,1,0.32,1], delay}}`; under `useReducedMotion()` it animates opacity only.
- `SectionTitle`: `{ lead?: Localized; title: Localized; ornament?: 'divider' | 'rings' | 'branch' | 'none' }` → italic serif lead sentence, script title (Malayalam falls back to `--font-ml` 600), ornament below in gold.
- `Card`: paper surface, 1 px gold hairline (`rgba(176,141,87,.35)`), radius 4 px, padding scale.
- [ ] **Verify:** `npx tsc --noEmit`; visual check in Task 10.

### Task 5: Envelope intro, wax seal, audio, music pill

**Files:** Create `src/components/intro/Envelope.tsx`, `src/components/intro/WaxSeal.tsx`, `src/lib/useAudio.ts`, `src/components/chrome/MusicPill.tsx`. Modify `src/app/page.tsx`.

**Interfaces:** `useAudio(src): { playing: boolean; ready: boolean; start(): Promise<void>; toggle(): void }`; `<Envelope guestName={string|null} initials="J & M" onOpened={() => void} />`; `<MusicPill />` reads an `AudioContext` React context provided in `page.tsx` so Envelope's `start()` and the pill's `toggle()` share one element.

- [ ] **Step 1:** State machine `'sealed' | 'opening' | 'rising' | 'done'`. Layout: a 3D scene (`perspective: 1200px`) with the envelope body (paper, gold hairline, faint `Branch` ornaments at 20 % opacity in the corners), the back flap (triangle, `transform-origin: top`, `rotateX(0) → rotateX(-180deg)` over 900 ms `cubic-bezier(0.77,0,0.175,1)`), the card (`translateY(35%) → translateY(-62%)` over 900 ms, delayed 500 ms, with the guest greeting and "You are invited" in script), and `WaxSeal` (wine disc 84 px with inner ring and initials in script, drop shadow; on tap `scale(1.08) → opacity 0, translateY(-8px)` over 500 ms). After `rising`, the whole overlay fades (600 ms) and `onOpened()` fires. "Skip" link appears after 1 s (`ce-env-skip-in` equivalent). `sessionStorage['invite-opened']='1'` is set on open; `Envelope` returns `null` if it is already set (read with `useSyncExternalStore` so SSR renders the hero).
- [ ] **Step 2:** `useAudio` creates `new Audio(src)` lazily on `start()`, `loop = true`, `volume = 0.5`, `preload = 'none'`; catches play rejections; persists `localStorage['music']='off'` on mute and respects it on start (do not start if 'off').
- [ ] **Step 3:** `MusicPill`: fixed bottom-right (`bottom: calc(1rem + env(safe-area-inset-bottom))`), ink glass (`rgba(30,42,36,.82)` + `backdrop-filter: blur(12px)`), gold-light text, Jost 12 px, note icon pulses (`pulse-soft` 1.6 s) while playing; label `t({en:'Music on',ml:'സംഗീതം'})`/off; `aria-pressed`.
- [ ] **Verify (Playwright):** fresh session shows the envelope; tap → opens → hero; reload → hero directly; `?to=Sibin%20%26%20Family` shows "Dear Sibin & Family" on the card.

### Task 6: Hero, Verse, Invitation wording

**Files:** Create `src/components/sections/{Hero,Verse,Invitation}.tsx`. Modify `src/app/page.tsx`.

- [ ] **Hero:** `min-h-[100dvh]` centred column; `Cross` ornament 88 px gold with `draw`; lines staggered via `motion` variants (`staggerChildren: 0.06`, start after `onOpened` or immediately when the envelope was skipped); names in script with the ampersand in gold carrying a one-time `shimmer` background-clip sweep (1.8 s, 1 iteration); date as serif small caps (`font-variant: small-caps`, letter-spacing .06em); guest greeting line in italic if `guestName`; scroll cue: 1 px × 48 px gold line with `breathe` opacity loop.
- [ ] **Verse:** centred, italic serif 22→26 px, `Divider` ornament above and below, reference in Jost 13 px gold-dark.
- [ ] **Invitation:** formal wording; parents' names in serif 500; couple full names in script 36→44 px; church/date/time lines; Malayalam version uses `font-family: var(--font-ml)` and `line-height: 1.9`.
- [ ] **Verify:** screenshots in both languages at 393 px and 1440 px.

### Task 7: Events timeline + Countdown  *(subagent A)*

**Files:** Create `src/components/sections/{Events,Countdown}.tsx`.

- [ ] **Events:** `SectionTitle` ("The celebrations" / "ആഘോഷങ്ങൾ"); a vertical gold hairline (`::before`) with a `Rings`/`Cross`/`Divider` node per event; per event: name in script 32 px, weekday + long date + time in serif (formatted with `Intl.DateTimeFormat(lang==='ml'?'ml-IN':'en-IN', { timeZone:'Asia/Kolkata' })`), venue 500 weight, address muted, dress code italic line; actions row: `Button outline` "Directions" → `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}` (new tab) and `Button ghost` "Add to calendar" opening a tiny popover with "Google Calendar" (link) and "Apple / Outlook (.ics)" (`<a download="holy-matrimony.ics" href={icsDataUrl(buildIcs(...))}>`); popover scales from its trigger (`transform-origin: top left`, 160 ms). On ≥ 768 px the timeline keeps a single column (ceremonial), max width 36 rem.
- [ ] **Countdown:** `getCountdown` every second via `setInterval` in `useEffect`; four tiles (`Card`, min-width 4.5 rem, fixed height) with serif numerals 36→48 px and labels in Jost 12 px; numeral changes use a key change with `motion` `AnimatePresence mode="popLayout"` (`initial:{opacity:0, filter:'blur(2px)', y:4}`, 200 ms); `done` → script line "Married!" / "വിവാഹിതരായി". Server renders zeros to avoid hydration mismatch (first tick on mount).
- [ ] **Verify:** `npx tsc --noEmit`; screenshot in `ml`: tiles do not overflow at 393 px.

### Task 8: Couple, Story, Gallery + lightbox  *(subagent B)*

**Files:** Create `src/components/sections/{Couple,Story,Gallery}.tsx`.

- [ ] **Couple:** two `Person` blocks; portrait in an `Arch` mask (aspect 4/5, `next/image` with `sizes="(min-width:768px) 320px, 70vw"`, blur placeholder), 1 px gold arch outline offset 6 px outside the photo, name in script 40 px, `parentLabel` italic + parents serif, optional note; stacked on phones with a `Rings` ornament between, side by side from 768 px with the ornament centred.
- [ ] **Story:** three `StoryMoment`s on a horizontal rule on desktop / vertical on phones; year in Jost 13 px gold-dark, title serif 500 22 px, text 17 px; one `Reveal` for the whole block.
- [ ] **Gallery:** 2-column CSS masonry (`columns: 2; gap: .75rem`, 3 columns ≥ 1024 px); each image `clip-path: inset(0 0 100% 0) → inset(0)` on first view (700 ms); click opens `yet-another-react-lightbox` with `Zoom` plugin, `carousel.padding: 0`, backdrop `rgba(30,42,36,.96)`; `styles.container` background; dispatch a `CustomEvent('lightbox', {detail:{open}})` on open/close so `BottomNav` can hide.
- [ ] **Verify:** `npx tsc --noEmit`; lightbox opens/closes with Escape; images have `alt` from content.

### Task 9: Livestream, Footer, chrome (LangToggle, BottomNav, SmoothScroll, Backdrop)  *(subagent C)*

**Files:** Create `src/components/sections/{Livestream,Footer}.tsx`, `src/components/chrome/{LangToggle,BottomNav,SmoothScroll,Backdrop}.tsx`.

- [ ] **Livestream:** `Card` with `Dove` ornament, lead sentence, `Button solid` "Watch live" (external link, `rel="noopener"`), note line.
- [ ] **Footer:** blessings paragraph, hashtag in wine Jost 14 px, closing verse italic + ref, names in script 44 px, date, `Share` button (`navigator.share({title, url})` else `clipboard.writeText` + 2 s "Link copied" state with blur crossfade), credit line "Made with love".
- [ ] **LangToggle:** fixed top-right (safe-area aware), ghost pill, label is the *other* language's name; `aria-label` "Switch language"; press feedback.
- [ ] **BottomNav:** phones only (`md:hidden`), fixed bottom, ink glass bar with four items (Invitation `#top`, Events `#events`, Gallery `#gallery`, Directions → maps link for the ceremony), lucide icons 20 px + Jost 11 px labels; active item from an `IntersectionObserver` over section ids; slides in (`translateY(100%) → 0`, 400 ms) once the hero scrolls out; hidden when `lightbox` event says open; leaves room via `padding-bottom: env(safe-area-inset-bottom)`.
- [ ] **SmoothScroll:** Lenis only when `matchMedia('(pointer: fine)')` and not reduced motion; `lerp: 0.1`; integrates with `requestAnimationFrame`.
- [ ] **Backdrop:** ≥ 1024 px only: parchment page, the content wrapper becomes a floating card (max 46 rem, shadow `0 30px 80px rgba(30,42,36,.12)`), two large `Branch` ornaments in the margins at 12 % opacity moving at 0.3× scroll via `useScroll`/`useTransform` (disabled under reduced motion).
- [ ] **Verify:** `npx tsc --noEmit`; screenshots at 393/820/1440.

### Task 10: Integration, visual QA, polish

**Files:** Modify `src/app/page.tsx`, `src/app/layout.tsx`; remove any temporary routes; add `public/og.jpg`.

- [ ] Compose: `<Envelope/>` → `<main id="top">` with sections in spec order, ids `events`, `gallery`; chrome in layout.
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build` all green.
- [ ] Playwright QA script (scratchpad) against `next start` on port 3100: screenshots phone/tablet/desktop, envelope before/after, Malayalam mode, lightbox, bottom nav active state; review every screenshot against the spec; fix spacing, sizes, contrast; re-run.
- [ ] Lighthouse (mobile) via Playwright/Chrome `--headless` or `npx lighthouse` if available: performance ≥ 90; otherwise document the gap.
- [ ] Write `README.md` (how to run, where to edit content, how to replace photos/music, how to deploy to Vercel later).

## Self-review notes

- Spec coverage: §3 screens 0–10 → Tasks 5–9; §4 tokens/type → Task 1; §6 helpers → Task 2; §7 edge cases → Tasks 2, 5, 7, 8, 9; §8 testing → Tasks 2 and 10. RSVP intentionally absent.
- Type consistency: `Localized`, `WeddingEvent`, `Person`, `Photo` names are used identically in Tasks 1, 2, 7, 8. `useLang().t` is the only string accessor.
- Review Focus items 1–3 have tests in Task 2; 4 and 5 are Playwright checks in Tasks 5 and 10.

## Status (2026-10-02, end of first build)

All ten tasks implemented and visually verified (see `docs/qa/`). Deviations worth knowing:
- The session flag that hides the envelope on reload is written when the opening sequence *finishes*, not on tap; writing it on tap made the component treat the visitor as returning mid-animation.
- `paper-grain` no longer sets `position` (it silently overrode `fixed` on the overlay).
- Malayalam mode forces every text utility to the Malayalam serif via `html[data-lang="ml"]` rules in `globals.css`, so no string can fall back to a Latin face.
- The lightbox is loaded on demand through `next/dynamic` (`GalleryLightbox.tsx`).
- Noto Serif Malayalam is not preloaded; it downloads when Malayalam text first renders.
- Lighthouse (mobile, simulated): performance ~74, accessibility 100, best practices 100. LCP is the gating metric; next levers are fewer motion features on first paint and preloading the script font.
- No git repository yet (Sibin has not asked for commits). RSVP intentionally absent.
