"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useLang } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { useAudioPlayer } from "@/components/chrome/AudioProvider";
import { sealArt } from "@/content/florals";
import { useIntro } from "./IntroContext";
import { ScriptText } from "@/components/ui/ScriptText";
import { EnvelopeShell } from "./EnvelopeShell";

type Phase = "sealed" | "opening" | "fading" | "done";

/* Choreography after the tap, in ms. The hero starts composing beneath at once; the flap lifts while the
   envelope zooms a touch and dissolves into it. */
const FADE_AT = 380;
const FADE_MS = 800;
const DONE_AT = FADE_AT + FADE_MS + 50;

const TILT = { stiffness: 90, damping: 18, mass: 0.8 };

/**
 * Full-screen intro. On phones the screen is the envelope: pale paper, "You are invited", the
 * couple's wax seal on a shallow flap. Tap it and the flap swings up with the seal while the
 * envelope dissolves straight into the hero. Larger screens show a wide
 * envelope that tilts under the pointer. Reduced motion crossfades instead. Nothing is remembered:
 * every load starts sealed.
 */
export function Envelope({ guestName }: { guestName: string | null }) {
  const { t } = useLang();
  const { markOpened } = useIntro();
  const audio = useAudioPlayer();
  const reduce = !!useReducedMotion();
  const [phase, setPhase] = useState<Phase>("sealed");
  const timers = useRef<number[]>([]);
  const finePointer = useRef(false);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, TILT);
  const rotateY = useSpring(tiltY, TILT);

  useEffect(() => {
    finePointer.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const restTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!finePointer.current || reduce || phase !== "sealed") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 8);
    tiltX.set(-py * 6);
  };

  const open = (e: MouseEvent<HTMLButtonElement>) => {
    if (phase !== "sealed") return;
    void audio.start();
    restTilt();
    // the petals burst from the seal: its centre on screen at the moment of the tap
    const seal = e.currentTarget.querySelector<HTMLElement>(".env-seal")?.getBoundingClientRect();
    const origin = seal && seal.width ? { x: seal.left + seal.width / 2, y: seal.top + seal.height / 2 } : undefined;
    const finish = () => setPhase("done");
    if (reduce) {
      setPhase("fading");
      later(() => markOpened(origin), 50);
      later(finish, 400);
      return;
    }
    setPhase("opening");
    markOpened(origin);
    later(() => setPhase("fading"), FADE_AT);
    later(finish, DONE_AT);
  };

  if (phase === "done") return null;

  const opening = phase === "opening" || phase === "fading";

  return (
    <motion.div
      className={cn("envelope-gate gate-paper fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden", phase === "fading" && "pointer-events-none", opening && "env-open")}
      initial={false}
      animate={{ opacity: phase === "fading" ? 0 : 1 }}
      transition={{ duration: reduce ? 0.3 : FADE_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
      aria-label={t(ui.youAreInvited)}
    >
      {/* soft washes on the paper behind the envelope (seen on wide screens) */}
      <div className="pointer-events-none absolute -left-[20%] -top-[12%] hidden h-[55vmin] w-[70vmin] rounded-full bg-[radial-gradient(closest-side,rgba(163,188,191,0.45),rgba(163,188,191,0))] md:block" />
      <div className="pointer-events-none absolute -bottom-[14%] -right-[18%] hidden h-[60vmin] w-[75vmin] rounded-full bg-[radial-gradient(closest-side,rgba(143,173,176,0.32),rgba(143,173,176,0))] md:block" />

      {/* Scene */}
      <button
        type="button"
        onClick={open}
        onPointerMove={onPointerMove}
        onPointerLeave={restTilt}
        aria-label={t(ui.tapToOpen)}
        className={cn(
          "env-scene group absolute inset-0 block cursor-pointer outline-none [perspective:1600px] md:relative md:inset-auto md:w-[min(90vw,720px)]",
          "focus-visible:[&_.env-body]:outline focus-visible:[&_.env-body]:outline-2 focus-visible:[&_.env-body]:-outline-offset-[6px] focus-visible:[&_.env-body]:outline-accent-deep md:focus-visible:[&_.env-body]:outline-offset-[10px]",
        )}
      >
        <EnvelopeShell
          open={opening}
          reduce={reduce}
          seal={sealArt}
          tilt={{ rotateX, rotateY }}
          headline={
            <p className="t-names-md text-accent-dusk text-balance">{t(ui.youAreInvited)}</p>
          }
          greeting={
            guestName ? (
              <p className="t-names-sm text-accent-dusk text-balance">
                <ScriptText text={guestName} />
              </p>
            ) : null
          }
        />
      </button>

      {/* hint: on the paper at the bottom on phones, under the envelope on larger screens */}
      <motion.p
        className="t-label pointer-events-none absolute bottom-[calc(1.75rem+env(safe-area-inset-bottom))] z-10 text-ink-soft md:static md:mt-12 md:text-ink-soft/80"
        initial={false}
        animate={{ opacity: opening ? 0 : [0.55, 1, 0.55] }}
        transition={opening ? { duration: 0.3 } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {t(ui.tapToOpen)}
      </motion.p>
    </motion.div>
  );
}
