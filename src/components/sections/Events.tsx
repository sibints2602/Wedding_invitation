"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarPlus, MapPin } from "lucide-react";
import type { WeddingEvent } from "@/content/types";
import { wedding } from "@/content/wedding";
import { ui } from "@/content/ui";
import { useLang } from "@/lib/i18n";
import { formatDay, formatMonthYear, formatTime, formatWeekday } from "@/lib/dates";
import { buildIcs, googleCalendarUrl, icsDataUrl } from "@/lib/calendar";
import { ceremony } from "@/content/florals";
import { Button } from "@/components/ui/Button";
import { Floral } from "@/components/ui/Floral";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { EASE_OUT } from "@/lib/motion";

function mapsUrl(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function CalendarMenu({ event }: { event: WeddingEvent }) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      <Button variant="outline" size="sm" icon={<CalendarPlus />} aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className="w-full sm:w-auto">
        {t(ui.addToCalendar)}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            role="menu"
            className="frame absolute left-1/2 top-[calc(100%+8px)] z-20 min-w-[14rem] origin-top -translate-x-1/2 rounded-[4px] bg-paper p-2 text-left"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.16, ease: EASE_OUT }}
          >
            <a role="menuitem" href={googleCalendarUrl(event, lang)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="t-ui-sm block rounded px-3 py-2.5 text-ink-soft [@media(hover:hover)]:hover:bg-accent/10">
              {t(ui.googleCalendar)}
            </a>
            <a role="menuitem" href={icsDataUrl(buildIcs(event, lang, wedding.siteUrl))} download={`${event.id}.ics`} onClick={() => setOpen(false)} className="t-ui-sm block rounded px-3 py-2.5 text-ink-soft [@media(hover:hover)]:hover:bg-accent/10">
              {t(ui.appleCalendar)}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * One event's particulars, set straight on the paper and centred like a printed card: the event's name as
 * a small label, the day large between two hairlines with the weekday on one side and the time on the
 * other, the month and year beneath, the venue, and the two things a guest needs to do.
 */
function EventDetails({ event }: { event: WeddingEvent }) {
  const { lang, t } = useLang();
  const venue = t(event.venue);
  // the address line often starts with the venue's name again; say it once
  const address = t(event.address).replace(venue, "").replace(/^[\s,]+/, "");
  return (
    <Reveal stagger={0.1} className="flex flex-col items-center text-center">
      <RevealItem as="p" className="t-label text-ink-soft">
        {t(event.name)}
      </RevealItem>
      <RevealItem className="mt-3 grid grid-cols-[auto_auto_auto] items-center justify-center gap-3 md:gap-4">
          <p className="t-label whitespace-nowrap text-right text-accent-dusk">{formatWeekday(event.startIso, lang)}</p>
          <div className="flex flex-col items-center border-x border-accent/50 px-4 md:px-6">
            <p className="t-count t-count-lg text-ink">{formatDay(event.startIso, lang)}</p>
            <p className="t-label mt-2 text-center text-accent-dusk text-balance">{formatMonthYear(event.startIso, lang)}</p>
          </div>
          <p className="t-label whitespace-nowrap text-left text-accent-dusk">{formatTime(event.startIso, lang)}</p>
      </RevealItem>

      <RevealItem className="mt-8">
        <p className="t-strong text-ink">{venue}</p>
        {address && <p className="t-body mt-1 text-ink-soft">{address}</p>}
        {event.dressCode && (
          <p className="t-body mt-4 text-accent-dusk">
            {t(ui.dressCode)}: {t(event.dressCode)}
          </p>
        )}
        {event.note && <p className="t-body mt-1 text-muted">{t(event.note)}</p>}
      </RevealItem>

      <RevealItem className="mt-8 flex w-full max-w-[16rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
        <Button as="a" variant="solid" size="sm" href={mapsUrl(event.mapsQuery)} target="_blank" rel="noopener noreferrer" icon={<MapPin />} className="w-full sm:w-auto">
          {t(ui.directions)}
        </Button>
        <CalendarMenu event={event} />
      </RevealItem>
    </Reveal>
  );
}

/**
 * The celebration, painted on the page: no card, the watercolour couple and the words share the same
 * ivory paper, in the order of a printed invitation — the title, the painting, then the particulars.
 */
export function Events() {
  const { t } = useLang();
  return (
    <section id="events" className="relative damask px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-[40rem] flex-col items-center">
        <Reveal stagger={0.12} className="flex flex-col items-center text-center">
          <RevealItem as="h2" className="t-title text-ink text-balance">
            {t(ui.celebration)}
          </RevealItem>
          <RevealItem as="p" className="t-lead mt-3 text-accent-dusk text-balance">
            {t(ui.celebrationLead)}
          </RevealItem>
        </Reveal>

        {/* the painting: the couple among eucalyptus, keyed onto the paper so nothing boxes it in */}
        <Reveal className="mt-8 w-[84%] max-w-[22rem] md:mt-10" y={10}>
          <div aria-hidden="true">
            <Floral art={ceremony} sizes="(min-width: 768px) 22rem, 84vw" />
          </div>
        </Reveal>

        <div className="mt-10 flex w-full flex-col gap-12 md:mt-12">
          {wedding.events.map((e) => (
            <EventDetails key={e.id} event={e} />
          ))}
        </div>
      </div>
    </section>
  );
}
