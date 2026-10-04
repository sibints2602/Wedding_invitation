"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Localized, Person } from "@/content/types";
import { wedding } from "@/content/wedding";
import { ui } from "@/content/ui";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { rings, spray } from "@/content/florals";
import { Floral } from "@/components/ui/Floral";
import { Reveal, RevealItem, useRevealed } from "@/components/ui/Reveal";
import { Amp } from "@/components/ui/ScriptText";
import { EASE_OUT } from "@/lib/motion";

/** The rings' shadow while they are still in the air, and once they rest on the page. */
const RINGS_SHADOW_AIR = "drop-shadow(0 26px 30px rgba(42,58,60,0.06))";
const RINGS_SHADOW_REST = "drop-shadow(0 10px 14px rgba(42,58,60,0.2))";

/** One person: the role as a small label, the name large in the names voice, the family line beneath — arriving in that order inside a staggered <Reveal>. */
function PersonBlock({ person, lead, className }: { person: Person; lead: Localized; className?: string }) {
  const { t } = useLang();
  return (
    <div className={cn("flex flex-col", className)}>
      <RevealItem as="p" className="t-label text-ink-soft">
        {t(lead)}
      </RevealItem>
      <RevealItem as="h3" className="t-names mt-2 text-accent-dusk">
        {t(person.fullName)}
      </RevealItem>
      {person.parentsLine && (
        <RevealItem as="p" className="t-body mt-4 max-w-[18rem] text-ink-soft">
          {t(person.parentsLine)}
        </RevealItem>
      )}
      {person.note && (
        <RevealItem as="p" className="t-body mt-2 max-w-[18rem] text-muted">
          {t(person.note)}
        </RevealItem>
      )}
    </div>
  );
}

/**
 * The couple as an editorial spread: the names set large on a diagonal around the photograph,
 * which lies on the page like a mounted print, the rings resting against its near corner and one
 * watercolour spray behind the far one. On wide screens the photograph takes the left column and the names stack beside it.
 */
export function Couple() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const [landed, setLanded] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);
  // the print unrolls and the rings land on the page's one rule: seen, and the envelope already open
  const photoIn = useRevealed(photoRef, "-10% 0px");
  const { groom, bride, photo } = wedding.couple;

  return (
    <section id="couple" className="relative damask overflow-hidden px-6 py-20 md:py-28">
      <div className="mx-auto max-w-[64rem] md:grid md:grid-cols-[minmax(0,24rem)_1fr] md:items-center md:gap-16 md:pl-5 lg:gap-24">
        {/* phones: the bride opens the spread above the photograph */}
        <Reveal stagger={0.1} className="md:hidden">
          <PersonBlock person={bride} lead={ui.theBride} className="items-start text-left" />
        </Reveal>

        {/* the photograph, a mounted print laid on the page, set to the left on phones. The frame overhangs the
            print by 12px and the tilt adds a few more, so it is inset to land on the section's gutter; the width
            leaves the rings ending on the right gutter. */}
        <Reveal className="relative z-10 ml-5 mr-auto mt-8 w-[69%] md:ml-0 md:mt-0 md:w-full" y={0}>
          <div ref={photoRef} className="relative">
            {/* a spray behind the far corner (off the right of the photo on phones, off the page on wide screens) */}
            <div className="pointer-events-none absolute -right-[22%] -top-[12%] z-0 w-[58%] drop-shadow-[0_8px_12px_rgba(42,58,60,0.18)] md:-left-[26%] md:right-auto md:-top-[9%]" aria-hidden="true">
              <Floral art={spray} sizes="(min-width: 768px) 15rem, 46vw" className="md:-scale-x-100" />
            </div>

            {/* the print: a paper mat with one hairline frame, tilted a touch */}
            <div className="relative z-10 -rotate-[2.5deg] md:-rotate-2">
              <span className="pointer-events-none absolute -inset-3 rounded-[4px] border border-accent/50" aria-hidden="true" />
              <motion.div
                className="relative rounded-[3px] bg-paper p-2.5 shadow-[0_26px_60px_rgba(42,58,60,0.22)] md:p-3"
                initial={false}
                animate={reduce ? { opacity: photoIn ? 1 : 0 } : { clipPath: photoIn ? "inset(0 0 0 0 round 3px)" : "inset(100% 0 0 0 round 3px)" }}
                transition={{ duration: 1.1, ease: EASE_OUT }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-paper-deep">
                  <Image src={photo.src} alt={t(photo.alt)} fill sizes="(min-width: 768px) 384px, 74vw" placeholder={photo.blurDataURL ? "blur" : "empty"} blurDataURL={photo.blurDataURL} className="object-cover object-[50%_30%]" />
                </div>
              </motion.div>
            </div>

            {/* the rings are set down on the page against the print's near corner once the print has unrolled:
                they arrive from a little above, turning a few degrees as they settle, their shadow tightening as
                they land. Afterwards a band of light crosses them now and then (.rings-glint). */}
            <motion.div
              className="pointer-events-none absolute -bottom-[17%] -right-[36%] z-20 w-[56%] md:-bottom-[13%] md:-right-[30%] md:w-[48%]"
              aria-hidden="true"
              initial={false}
              animate={reduce ? { opacity: photoIn ? 1 : 0 } : photoIn ? { opacity: 1, y: 0, scale: 1, rotate: 0, filter: RINGS_SHADOW_REST } : { opacity: 0, y: -20, scale: 1.06, rotate: -5, filter: RINGS_SHADOW_AIR }}
              transition={{ duration: 1.2, delay: reduce || !photoIn ? 0 : 0.7, ease: EASE_OUT }}
              onAnimationComplete={() => setLanded(true)}
            >
              <div className="relative">
                <Floral art={rings} sizes="(min-width: 768px) 12rem, 42vw" />
                {landed && <span className="rings-glint" />}
              </div>
            </motion.div>
          </div>
        </Reveal>

        {/* the names: beside the photograph on wide screens, the groom closing the spread on phones */}
        <div className="md:pl-6">
          <Reveal stagger={0.1} className="hidden md:block">
            <PersonBlock person={bride} lead={ui.theBride} className="items-start text-left" />
          </Reveal>
          <Reveal className="hidden md:my-8 md:block">
            <div className="flex items-center gap-5" aria-hidden="true">
              <span className="h-px flex-1 bg-accent/60" />
              <span className="t-names-sm text-accent-deep">
                <Amp />
              </span>
              <span className="h-px flex-1 bg-accent/60" />
            </div>
          </Reveal>
          <Reveal stagger={0.1} className="mt-12 md:mt-0">
            <PersonBlock person={groom} lead={ui.theGroom} className="items-end text-right md:items-start md:text-left" />
          </Reveal>
          <Reveal className="mt-12">
            <p className="t-lead text-center text-accent-dusk text-balance md:text-left">{t(ui.coupleLead)}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
