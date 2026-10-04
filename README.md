# Priyank & Tosmy — Engagement Invitation Website

A mobile-first, trilingual (English / Malayalam / Kannada) digital invitation to the engagement of Priyank and Tosmy (21 November 2026, St. Thomas Church, Gandibagilu), in a light seafoam-and-ivory watercolour style. Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and `motion`. Still placeholder: the parents' names (hidden until known) and the livestream link.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Useful links while developing:

- `http://localhost:3000/?to=Sibin%20%26%20Family` — personalised greeting on the envelope and hero
- `http://localhost:3000/?lang=ml` or `?lang=kn` — open directly in Malayalam or Kannada
- The envelope shows on every load. Only the guest's language and music on/off choices are remembered (in the browser's local storage).

## Where to change things

| What | Where |
|---|---|
| Names, parents, dates, venues, verses, wording, livestream link | `src/content/wedding.ts` (every string has `en`, `ml` and `kn`). Each fact is shown once: the greeting wording in the hero, the date, time and venue in the celebration. |
| Button and label text | `src/content/ui.ts` |
| Photos | drop JPEGs into `public/photos/` as `hero.jpg` (the couple, Couple section) and `hero-church.jpg` (the opening scene), then run `npm run photos` (regenerates sizes, blur placeholders and alt text). `docs/originals/Tosmy.jpeg` is the untouched original the crops come from. |
| Florals and the rings | `public/florals/` (`bouquet.png`, `spray.png`, `seal.png`, `rings.png` with its `rings-mask.png` for the light sweep, `ceremony.png`, `hands.png`), registered with their sizes in `src/content/florals.ts` |
| Background music | replace `public/audio/love-melody.mp3` and update `music` in `src/content/wedding.ts` (the credit is kept in the content, not shown) |
| Social preview image | `public/og.jpg` (1200×630) |
| Colours, motion tokens | `src/app/globals.css` (`@theme`) |
| Fonts and text styles | `src/app/layout.tsx` (the three families) and the `t-*` role classes in `src/app/globals.css` (see Type below) |
| Section order | `src/app/page.tsx` |

## Structure

```
src/app/            layout (fonts, metadata), page (composition), globals.css (tokens)
src/content/        typed content: types.ts, wedding.ts, ui.ts, florals.ts, photos.generated.ts
src/lib/            i18n, guest-name parsing, calendar links (.ics / Google), countdown, dates, audio (useAudio), motion (the shared easing)
src/components/
  intro/            Envelope (the gate: phases, audio), EnvelopeShell (the paper envelope), IntroContext (opened state and the tap hook the petals use)
  chrome/           AudioProvider, LangToggle (the language dropdown), MusicPill, SmoothScroll (Lenis), Backdrop (desktop sheet), Petals (the shower from the seal at the tap, then the drift down the page; petalField.ts is its physics)
  sections/         Hero (the greeting), Couple, Verse, Events, Countdown, Livestream, Footer
  ornaments/        procedural line art (Branch, Rings, Divider, shared Defs) + the satin Ribbon on the envelope (ribbonPath.ts generates its rippling tails) + DrawOnView animator
  ui/               Button, Reveal / RevealItem (every entrance on the page, once seen and after the envelope), Floral, CoupleNames, ScriptText, ScratchReveal (the foil over the countdown)
scripts/photos.mjs  photo index generator
tests/              Vitest unit tests for the pure helpers
docs/               research, design spec, implementation plan, qa (screenshots), originals (the untouched studio photo and the source florals)
```

## Type

Two styles per language, each with one job. English: **Pinyon Script** for the couple's names and the guest's name, nothing else; **Cormorant Garamond**, always upright and in normal case, for everything else including buttons. Malayalam and Kannada: **Noto Serif Malayalam** / **Noto Serif Kannada** for everything. One exception: the serif ampersand inside script lines is italic. No spaced capitals: hierarchy comes from size, weight and colour only.

Every text role is one class in `globals.css` (family, fluid size, weight, leading and tracking together), with its own Malayalam sizes, so a section never sets its own type:

| Class | Use |
|---|---|
| `t-names` / `t-names-md` / `t-names-sm` | the couple's names (hero, Couple section) / the envelope headline / the guest's name, "Dear …", the "and" joiner |
| `t-title` | section titles, "With love" |
| `t-verse` | the scripture epigraph |
| `t-lead` | one quieter sentence under a title, the invite line |
| `t-strong` | the venue |
| `t-body` | running text |
| `t-label` | event name, weekday, time, scripture references, countdown units |
| `t-count` / `t-count-lg` | countdown numerals / the event day |
| `t-ui` / `t-ui-sm` | buttons, pills, menus |

`CoupleNames` sets the hero's names (the Couple section sets its own in the same voice); `ScriptText` sets any "&" in a script line in the serif, because Pinyon's own ampersand reads oddly.

Spacing follows one scale too, listed beside the roles in `globals.css`: lines of one group `mt-1`, label to value `mt-2`, title to lead `mt-3`, paragraph to paragraph `mt-4`, around names and before buttons `mt-6`, group to group `mt-8`, title block to content `mt-12 md:mt-16`. Sections are `px-6 py-20 md:py-28`.

## Checks

```bash
npm run lint
npm run typecheck
npm test
```

## Deploying later

The site is fully static (no API routes), so it deploys to Vercel with zero configuration: `vercel` from this folder, or import the repository in the Vercel dashboard. Set `siteUrl` in `src/content/wedding.ts` to the final domain so calendar files, the page metadata and the social preview use it.

## Credits

Photos: the couple's own (the church scene is a stock photo). Watercolour bouquet and spray: a Freepik watercolour set (free licence; attribution requested). Music: "Guitar and piano love melody" by Clavier-Music (Pixabay Content License, no attribution required; its silent tail was trimmed so it loops cleanly).
