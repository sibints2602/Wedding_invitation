"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { wedding } from "@/content/wedding";
import { ui } from "@/content/ui";
import { useLang } from "@/lib/i18n";
import { useIntro } from "@/components/intro/IntroContext";
import { CoupleNames } from "@/components/ui/CoupleNames";
import { ScriptText } from "@/components/ui/ScriptText";
import { EASE_OUT } from "@/lib/motion";

/**
 * The greeting: the church in natural colour fading into white paper, then the invitation's own
 * words to the guest. Dates and places are said once, in the celebration.
 */
export function Hero({ guestName }: { guestName: string | null }) {
  const { t } = useLang();
  const { opened } = useIntro();
  const reduce = useReducedMotion();
  const quick = !!reduce;
  const { wording } = wedding;
  const hosts = wording.hostsGroom && wording.hostsBride ? { groom: wording.hostsGroom, bride: wording.hostsBride } : null;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: quick ? 0.04 : 0.1, delayChildren: quick ? 0.05 : 0.35 } },
  };
  const line = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: quick ? 0.5 : 1, ease: EASE_OUT } },
  };

  return (
    <section id="top" className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-paper text-center text-ink">
      {/* photograph, natural colour, dissolving into the paper */}
      <div className="relative h-[58dvh] min-h-88 w-full md:h-[62dvh]">
        <Image
          src={wedding.hero.photo.src}
          alt={t(wedding.hero.photo.alt)}
          fill
          preload
          sizes="(min-width: 1024px) 46rem, 100vw"
          placeholder="blur"
          blurDataURL={wedding.hero.photo.blurDataURL}
          className="object-cover object-[50%_12%] md:object-[50%_14%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,250,247,0)_55%,rgba(251,250,247,0.75)_82%,#fbfaf7_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,250,247,0.35)_0%,rgba(251,250,247,0)_22%)]" />
      </div>

      {/* hairline frame */}
      <motion.div
        className="pointer-events-none absolute inset-3 md:inset-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 1.2, delay: quick ? 0 : 0.2 }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 border border-accent/50" />
        <div className="absolute inset-1.25 border border-accent/20" />
      </motion.div>

      {/* the greeting */}
      <motion.div className="relative flex flex-1 flex-col items-center px-6 pb-32 pt-10 md:px-12 md:pb-24 md:pt-12" variants={container} initial="hidden" animate={opened ? "show" : "hidden"}>
        <motion.p variants={line} className="t-names-sm text-accent-deep text-balance">
          {guestName ? (
            <>
              {t(ui.dear)} <ScriptText text={guestName} />,
            </>
          ) : (
            <>{t(ui.dearGuest)},</>
          )}
        </motion.p>

        {hosts ? (
          <motion.div variants={line} className="mt-8 flex flex-col items-center">
            <p className="t-body text-ink">{t(hosts.bride)}</p>
            <span className="my-4 block size-2 rotate-45 bg-accent" aria-hidden="true" />
            <p className="t-body text-ink">{t(hosts.groom)}</p>
            <p className="t-lead mt-8 max-w-[26rem] text-accent-dusk text-balance">{t(wording.requestLine)}</p>
          </motion.div>
        ) : (
          <motion.p variants={line} className="t-label mt-8 text-ink-soft">
            {t(wording.togetherLine)}
          </motion.p>
        )}

        <motion.div variants={line} className="mt-6">
          <CoupleNames as="h1" className="text-accent-dusk" joinerClassName="text-accent-deep" />
        </motion.div>

        {!hosts && (
          <motion.p variants={line} className="t-lead mt-6 max-w-[24rem] text-ink-soft text-balance md:max-w-none">
            {t(wording.inviteLine)}
          </motion.p>
        )}

        <motion.p variants={line} className="t-body mt-8 max-w-[22rem] text-muted text-balance">
          {t(wording.closingLine)}
        </motion.p>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 h-10 w-px -translate-x-1/2 bg-accent-deep anim-breathe md:bottom-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ delay: quick ? 0.4 : 1.8, duration: 0.6 }}
        aria-hidden="true"
      />
    </section>
  );
}
