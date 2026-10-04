"use client";

import type { ReactNode } from "react";
import { motion, type MotionValue } from "motion/react";
import type { FloralArt } from "@/content/florals";
import { bouquet } from "@/content/florals";
import { Floral } from "@/components/ui/Floral";
import { Ribbon } from "@/components/ornaments/Ribbon";
import { cn } from "@/lib/cn";
import { EASE_OUT } from "@/lib/motion";

/**
 * Envelope geometry as fractions of the envelope height. The top flap is a pentagon: straight
 * sides down to `side`, then a shallow point at `flap`. Phones show the envelope full-bleed (the
 * screen is the envelope); wider screens show a landscape envelope.
 * Mirrors --flap / --flap-side / --headline in globals.css.
 */
const GEOMETRY = {
  phone: { flap: 0.52, side: 0.4, headline: 0.2 },
  wide: { flap: 0.58, side: 0.3, headline: 0.12 },
} as const;
type Geometry = (typeof GEOMETRY)[keyof typeof GEOMETRY];

/** Quick off the mark, settling slowly: the flap swings up before the dissolve starts. */
const EASE_LIFT: [number, number, number, number] = [0.3, 0.7, 0.2, 1];

/** The bouquet's box as fractions of the envelope (left, top, width); the seal sits on its centre. */
const BOUQUET = {
  phone: { x: 0.13, y: 0.372, w: 0.74 },
  wide: { x: 0.31, y: 0.29, w: 0.38 },
} as const;

type Props = {
  /** Flap lifting (the gate dissolves into the hero meanwhile). */
  open: boolean;
  reduce: boolean;
  seal: FloralArt;
  /** Large line on the flap ("You are invited"). */
  headline: ReactNode;
  /** Calligraphy under the seal. */
  greeting: ReactNode;
  /** Pointer tilt on devices with a fine pointer. */
  tilt?: { rotateX: MotionValue<number>; rotateY: MotionValue<number> };
};

/** The shadow the closed top flap throws onto the paper below it. */
function FlapShadow({ g, id, className }: { g: Geometry; id: string; className?: string }) {
  const side = g.side * 1000;
  const tip = g.flap * 1000;
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className={cn("h-full w-full", className)} aria-hidden="true">
      <defs>
        <filter id={`${id}-a`} x="-10%" y="-10%" width="120%" height="130%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id={`${id}-b`} x="-10%" y="-10%" width="120%" height="140%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>
      <path d={`M-30 -60 L1030 -60 L1030 ${side + 40} L500 ${tip + 44} L-30 ${side + 40} Z`} fill="#2a3a3c" fillOpacity="0.26" filter={`url(#${id}-b)`} />
      <path d={`M-30 -60 L1030 -60 L1030 ${side + 16} L500 ${tip + 18} L-30 ${side + 16} Z`} fill="#2a3a3c" fillOpacity="0.3" filter={`url(#${id}-a)`} />
    </svg>
  );
}

/** Crease light along the flap's lower edges, drawn in the flap's own box. */
function FlapCrease({ g, className }: { g: Geometry; className?: string }) {
  const y = (g.side / g.flap) * 1000;
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className={cn("pointer-events-none absolute inset-0 h-full w-full [backface-visibility:hidden]", className)} aria-hidden="true">
      <path d={`M0 ${y} L500 1000 L1000 ${y}`} fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      <path d={`M0 ${y} L500 1000 L1000 ${y}`} fill="none" stroke="#2a3a3c" strokeOpacity="0.16" strokeWidth="1" vectorEffect="non-scaling-stroke" transform="translate(0 -1.5)" />
    </svg>
  );
}

/**
 * The watercolour bouquet, printed across the crease: the copy on the flap lifts with it, the copy
 * on the lower paper is clipped to below the crease so the two read as one print while sealed.
 */
function Bouquet({ box, onFlap, g, className }: { box: { x: number; y: number; w: number }; onFlap: boolean; g: Geometry; className?: string }) {
  const top = onFlap ? `${(box.y / g.flap) * 100}%` : `${box.y * 100}%`;
  return (
    <div className={cn("pointer-events-none absolute", className)} style={{ left: `${box.x * 100}%`, top, width: `${box.w * 100}%` }} aria-hidden="true">
      <Floral art={bouquet} preload sizes="(min-width: 768px) 320px, 74vw" className="drop-shadow-[0_6px_14px_rgba(42,58,60,0.12)]" />
    </div>
  );
}

/**
 * The ribbon tying the bouquet, knotted under the wax seal and stuck to the flap with it: its loops show either
 * side of the seal and its long tails trail down past it, flanking the guest's name (a shorter pair on the wide
 * envelope, which has less room). It is sized against the seal (1.7× its width, so the loops clear it) and its
 * knot sits 3% of the envelope's height below the tip, which keeps the loops below the crease while sealed.
 * Being part of the flap, it lifts with the seal in the same swing at the same moment; its tails ripple slowly
 * while sealed and flutter hard while it opens (see Ribbon).
 */
function FlapRibbon({ open }: { open: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 w-[75%] max-w-[374px] -translate-x-1/2 -translate-y-[26.2%] [backface-visibility:hidden] [filter:drop-shadow(0_5px_6px_rgba(42,58,60,0.28))] md:w-[44%] md:max-w-none"
      style={{ top: "calc(100% + (0.03 / var(--flap)) * 100%)" }}
      initial={false}
      animate={{ scale: open ? 1.04 : 1 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      aria-hidden="true"
    >
      <Ribbon tail={0.86} open={open} className="md:hidden" />
      <Ribbon tail={0.5} open={open} className="hidden md:block" />
    </motion.div>
  );
}

/**
 * A pale seafoam paper envelope with a wax seal on a shallow flap over a watercolour bouquet. Purely presentational: the
 * gate decides when it opens. Must sit inside an element with `perspective` (the scene button)
 * and uses the --flap / --flap-side / --headline variables from globals.css.
 */
export function EnvelopeShell({ open, reduce, seal, headline, greeting, tilt }: Props) {
  return (
    <motion.div className="h-full w-full [transform-style:preserve-3d] md:h-auto" style={tilt ? { rotateX: tilt.rotateX, rotateY: tilt.rotateY } : undefined}>
      <div className="env-body relative h-full w-full [container-type:size] md:aspect-[1.4] md:h-auto md:rounded-[8px] md:shadow-[0_40px_80px_rgba(42,58,60,0.28),0_12px_26px_rgba(42,58,60,0.18)]" aria-hidden="true">
        {/* the paper below the flap: the lower face, the lower half of the bouquet, the guest's name */}
        <div className="env-paper absolute inset-0 md:rounded-[8px]" />
        <div className="env-below-flap absolute inset-0 z-[2]">
          <Bouquet box={BOUQUET.phone} onFlap={false} g={GEOMETRY.phone} className="md:hidden" />
          <Bouquet box={BOUQUET.wide} onFlap={false} g={GEOMETRY.wide} className="hidden md:block" />
        </div>
        <motion.div className="pointer-events-none absolute inset-x-[8%] top-[88%] z-[2] -translate-y-1/2 text-center md:top-[92%]" initial={false} animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.35 }}>
          {greeting}
        </motion.div>

        {/* shadow of the closed flap */}
        <motion.div className="pointer-events-none absolute inset-0 z-[3]" initial={false} animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.45 }} aria-hidden="true">
          <FlapShadow g={GEOMETRY.phone} id="flap-shadow-p" className="md:hidden" />
          <FlapShadow g={GEOMETRY.wide} id="flap-shadow-w" className="hidden md:block" />
        </motion.div>

        {/* top flap: paper, headline and the wax seal on its tip; a paler lining inside */}
        <motion.div
          className="env-flap absolute inset-x-0 top-0 z-[4] origin-top [transform-style:preserve-3d]"
          style={{ transformPerspective: 1400 }}
          initial={false}
          animate={{ rotateX: open ? -150 : 0 }}
          transition={{ duration: reduce ? 0.01 : 0.8, ease: EASE_LIFT }}
        >
          <div className="env-paper env-flap-front absolute inset-0 overflow-hidden [backface-visibility:hidden]">
            <Bouquet box={BOUQUET.phone} onFlap g={GEOMETRY.phone} className="md:hidden" />
            <Bouquet box={BOUQUET.wide} onFlap g={GEOMETRY.wide} className="hidden md:block" />
            <FlapCrease g={GEOMETRY.phone} className="md:hidden" />
            <FlapCrease g={GEOMETRY.wide} className="hidden md:block" />
            <div className="env-headline pointer-events-none absolute inset-x-[6%] -translate-y-1/2 text-center">{headline}</div>
          </div>
          <div className="env-flap-back absolute inset-0 overflow-hidden [backface-visibility:hidden] [transform:rotateX(180deg)]">
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(42,58,60,0.1)_0%,rgba(42,58,60,0)_30%)]" />
          </div>
          {/* the ribbon under the seal, then the wax seal, both stuck to the tip of the flap */}
          <FlapRibbon open={open} />
          <motion.div
            className="env-seal pointer-events-none absolute left-1/2 top-full w-[44%] max-w-[220px] -translate-x-1/2 -translate-y-1/2 [backface-visibility:hidden] [transform:translateZ(2px)] md:w-[26%]"
            initial={false}
            animate={open ? { scale: 1.04 } : { scale: 1 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <Floral
              art={seal}
              preload
              sizes="(min-width: 768px) 12rem, 44vw"
              className="[backface-visibility:hidden] [filter:drop-shadow(0_3px_3px_rgba(42,58,60,0.3))_drop-shadow(0_16px_24px_rgba(42,58,60,0.28))] transition-transform duration-200 ease-[var(--ease-out-strong)] group-active:scale-[0.97]"
            />
          </motion.div>
        </motion.div>

        {/* a pass of light across the paper */}
        {!reduce && <div className="env-sheen pointer-events-none absolute inset-y-[-25%] left-0 z-[5] w-[55%]" aria-hidden="true" />}
      </div>
    </motion.div>
  );
}
