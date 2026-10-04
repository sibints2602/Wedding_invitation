"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { wedding } from "@/content/wedding";
import { ui } from "@/content/ui";
import { useLang } from "@/lib/i18n";
import { getCountdown, type Countdown as CountdownT } from "@/lib/countdown";
import { Divider, DrawOnView, Rings } from "@/components/ornaments";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { ScratchReveal } from "@/components/ui/ScratchReveal";
import { EASE_OUT } from "@/lib/motion";

const pad = (n: number) => String(n).padStart(2, "0");

function Digit({ value, reduce }: { value: string; reduce: boolean }) {
  return (
    <span className="relative block h-[1.1em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="absolute inset-x-0 top-0 block"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(2px)" }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Seafoam band with numerals counting down to the ceremony, hidden under a scratch-off foil. */
export function Countdown() {
  const { t } = useLang();
  const reduce = !!useReducedMotion();
  const [cd, setCd] = useState<CountdownT | null>(null);

  useEffect(() => {
    const tick = () => setCd(getCountdown(wedding.ceremony.startIso, new Date()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  const tiles: { key: keyof typeof ui; value: string }[] = [
    { key: "days", value: cd ? String(cd.days) : "--" },
    { key: "hours", value: cd ? pad(cd.hours) : "--" },
    { key: "minutes", value: cd ? pad(cd.minutes) : "--" },
    { key: "seconds", value: cd ? pad(cd.seconds) : "--" },
  ];

  return (
    <section className="relative band px-6 py-20 text-center md:py-28">
      <Rings className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.07]" />
      <Reveal stagger={0.12} className="relative mx-auto flex max-w-[30rem] flex-col items-center">
        <RevealItem>
          <DrawOnView duration={1000} stagger={25}>
            <Divider variant="flourish" className="h-8 w-56" />
          </DrawOnView>
        </RevealItem>
        <RevealItem as="h2" className="t-lead mt-6 text-paper/90 text-balance">
          {t(ui.countdownLead)}
        </RevealItem>
        {cd?.done ? (
          <RevealItem as="p" className="t-title mt-6 text-paper">
            {t(ui.engaged)}
          </RevealItem>
        ) : (
          <RevealItem className="mt-8 w-full">
            <ScratchReveal label={t(ui.scratchToReveal)} className="w-full">
              <div className="grid w-full grid-cols-4 gap-3 md:gap-4" role="timer" aria-live="off">
                {tiles.map((tile) => (
                  <div key={tile.key} className="frame-dark rounded-[4px] bg-accent-dusk/50 px-1 py-4 md:py-6">
                    <p className="t-count text-paper">
                      <Digit value={tile.value} reduce={reduce} />
                    </p>
                    <p className="t-label mt-2 text-paper/75">{t(ui[tile.key])}</p>
                  </div>
                ))}
              </div>
            </ScratchReveal>
          </RevealItem>
        )}
      </Reveal>
    </section>
  );
}
