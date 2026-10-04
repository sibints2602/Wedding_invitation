"use client";

import { useId, useMemo } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@/lib/cn";
import { KNOT, RIBBON_BOX, loopPaths, sheenPath, tailPath, type LoopPaths, type Part, type Side } from "./ribbonPath";

/** Poses per ripple cycle; the cycle is closed, so the last pose equals the first. */
const POSES = 8;

function cycle(fn: (phase: number) => string, offset: number): string[] {
  const out: string[] = [];
  for (let i = 0; i <= POSES; i++) out.push(fn(offset + i / POSES));
  return out;
}

type Props = {
  className?: string;
  /** Tail length as a fraction of the full tail (the wide envelope has less room below the seal). */
  tail?: number;
  /** While the envelope opens the whole bow stirs hard and fast. */
  open?: boolean;
};

/** One tail: the front face from the root to the twist, the back face from the twist to the curled tip, each with a highlight. */
function Tail({ side, tail, amp, offset, duration, reduce, ids }: { side: Side; tail: number; amp: number; offset: number; duration: number; reduce: boolean; ids: Record<string, string> }) {
  const poses = useMemo(() => {
    const make = (part: Part) => ({ band: cycle((ph) => tailPath(side, tail, amp, ph, part), offset), sheen: cycle((ph) => sheenPath(side, tail, amp, ph, part), offset) });
    return { front: make("front"), back: make("back") };
  }, [side, tail, amp, offset]);
  const loop: Transition | undefined = reduce ? undefined : { duration, ease: "linear", repeat: Infinity };
  const face = side < 0 ? "L" : "R";
  return (
    <>
      <motion.path d={poses.back.band[0]} animate={reduce ? undefined : { d: poses.back.band }} transition={loop} fill={`url(#${ids["back" + face]})`} />
      <motion.path d={poses.back.sheen[0]} animate={reduce ? undefined : { d: poses.back.sheen }} transition={loop} fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2.5" strokeLinecap="round" />
      <motion.path d={poses.front.band[0]} animate={reduce ? undefined : { d: poses.front.band }} transition={loop} fill={`url(#${ids["front" + face]})`} />
      <motion.path d={poses.front.sheen[0]} animate={reduce ? undefined : { d: poses.front.sheen }} transition={loop} fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="3.5" strokeLinecap="round" />
    </>
  );
}

/** One loop: a gathered band around a see-through opening, rippling slowly, with its folds, rim and sheen following. */
function Loop({ side, amp, offset, duration, reduce, ids }: { side: Side; amp: number; offset: number; duration: number; reduce: boolean; ids: Record<string, string> }) {
  const poses = useMemo(() => {
    const all = cycle((ph) => JSON.stringify(loopPaths(side, amp, ph)), offset).map((j) => JSON.parse(j) as LoopPaths);
    const pick = (key: Exclude<keyof LoopPaths, "folds">) => all.map((l) => l[key]);
    return { band: pick("band"), inside: pick("inside"), sheen: pick("sheen"), lobe: pick("lobe"), rim: pick("rim"), folds: all[0].folds.map((_, i) => all.map((l) => l.folds[i])) };
  }, [side, amp, offset]);
  const loop: Transition | undefined = reduce ? undefined : { duration, ease: "linear", repeat: Infinity };
  const anim = (frames: string[]) => (reduce ? undefined : { d: frames });
  const face = side < 0 ? "L" : "R";
  return (
    <>
      <motion.path d={poses.band[0]} animate={anim(poses.band)} transition={loop} fill={`url(#${ids["loop" + face]})`} />
      <motion.path d={poses.inside[0]} animate={anim(poses.inside)} transition={loop} fill="none" stroke="#2a4145" strokeOpacity="0.5" strokeWidth="3.2" strokeLinecap="round" />
      {poses.folds.map((frames, i) => (
        <motion.path key={i} d={frames[0]} animate={anim(frames)} transition={loop} fill="none" stroke="#2a4145" strokeOpacity="0.18" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      <motion.path d={poses.rim[0]} animate={anim(poses.rim)} transition={loop} fill="none" stroke="#243a3e" strokeOpacity="0.3" strokeWidth="1.8" strokeLinecap="round" />
      <motion.path d={poses.sheen[0]} animate={anim(poses.sheen)} transition={loop} fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="5.5" strokeLinecap="round" />
      <motion.path d={poses.sheen[0]} animate={anim(poses.sheen)} transition={loop} fill="none" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
      <motion.path d={poses.lobe[0]} animate={anim(poses.lobe)} transition={loop} fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2.8" strokeLinecap="round" />
    </>
  );
}

/**
 * A satin bow in the seal's seafoam, after a classic tied ribbon: two glossy loops rising up and out from a
 * cinched knot, in the same light band as the tails, and two long tails that fall in an S, turn over
 * once mid-way and turn gently in at the tips. The whole bow moves: a ripple travels down each tail, a slower
 * one runs around each loop while it flexes about the knot, and the knot bobs — slowly while the envelope is
 * sealed, hard and fast while it opens. The knot sits at 50% across and 26.2% down the box (RIBBON_BOX).
 */
export function Ribbon({ className, tail = 1, open = false }: Props) {
  const reduce = !!useReducedMotion();
  const id = useId().replace(/:/g, "");
  const g = (name: string) => `${id}-${name}`;
  const ids = { frontL: g("frontL"), frontR: g("frontR"), backL: g("backL"), backR: g("backR"), loopL: g("loopL"), loopR: g("loopR") };
  const loopAmp = reduce ? 0 : open ? 10 : 3.5;
  const loopDur = open ? 1 : 7.1;
  const amp = reduce ? 0 : open ? 36 : 13;
  const duration = open ? 0.9 : 6.4;
  // the loops flex about the knot and the knot bobs, on their own slow rhythms (faster while opening)
  const flex = open ? 5 : 1.2;
  const flexDur = open ? 0.7 : 4.8;
  const ease: Transition["ease"] = "easeInOut";
  const [kx, ky] = KNOT;
  return (
    <svg viewBox={`0 0 ${RIBBON_BOX.width} ${RIBBON_BOX.height}`} className={cn("h-auto w-full overflow-visible", className)} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={ids.loopL} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#e4eeed" />
          <stop offset="0.25" stopColor="#a9c3c5" />
          <stop offset="0.6" stopColor="#6f9196" />
          <stop offset="1" stopColor="#3a5559" />
        </linearGradient>
        <linearGradient id={ids.loopR} x1="0.9" y1="0" x2="0.1" y2="1">
          <stop offset="0" stopColor="#e4eeed" />
          <stop offset="0.25" stopColor="#a9c3c5" />
          <stop offset="0.6" stopColor="#6f9196" />
          <stop offset="1" stopColor="#3a5559" />
        </linearGradient>
        <linearGradient id={ids.frontL} x1="1" y1="0" x2="0" y2="0.3">
          <stop offset="0" stopColor="#4d6f74" />
          <stop offset="0.35" stopColor="#86a7aa" />
          <stop offset="0.62" stopColor="#c6dad9" />
          <stop offset="1" stopColor="#6a8d92" />
        </linearGradient>
        <linearGradient id={ids.frontR} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#4d6f74" />
          <stop offset="0.35" stopColor="#86a7aa" />
          <stop offset="0.62" stopColor="#c6dad9" />
          <stop offset="1" stopColor="#6a8d92" />
        </linearGradient>
        <linearGradient id={ids.backL} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#4a6c71" />
          <stop offset="0.5" stopColor="#729599" />
          <stop offset="1" stopColor="#4d6f74" />
        </linearGradient>
        <linearGradient id={ids.backR} x1="1" y1="0" x2="0" y2="0.4">
          <stop offset="0" stopColor="#4a6c71" />
          <stop offset="0.5" stopColor="#729599" />
          <stop offset="1" stopColor="#4d6f74" />
        </linearGradient>
        <linearGradient id={g("knot")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a6c1c3" />
          <stop offset="0.5" stopColor="#5f8287" />
          <stop offset="1" stopColor="#2c4448" />
        </linearGradient>
      </defs>

      {/* tails first, so the loops and knot lie over their roots */}
      <Tail side={-1} tail={tail} amp={amp} offset={0} duration={duration} reduce={reduce} ids={ids} />
      <Tail side={1} tail={tail} amp={amp} offset={0.37} duration={duration * 1.13} reduce={reduce} ids={ids} />

      {/* loops: generated bands rising from the knot, each rippling and flexing on its own rhythm */}
      <motion.g
        style={{ transformBox: "fill-box", originX: 1, originY: 0.7 }}
        animate={reduce ? undefined : { rotate: [0, flex, 0, -flex * 0.7, 0] }}
        transition={reduce ? undefined : { duration: flexDur, ease, repeat: Infinity }}
      >
        <Loop side={-1} amp={loopAmp} offset={0} duration={loopDur} reduce={reduce} ids={ids} />
      </motion.g>
      <motion.g
        style={{ transformBox: "fill-box", originX: 0, originY: 0.7 }}
        animate={reduce ? undefined : { rotate: [0, -flex * 0.8, 0, flex, 0] }}
        transition={reduce ? undefined : { duration: flexDur * 1.17, ease, repeat: Infinity, delay: 0.6 }}
      >
        <Loop side={1} amp={loopAmp} offset={0.5} duration={loopDur * 1.16} reduce={reduce} ids={ids} />
      </motion.g>

      {/* knot: a short wrap of ribbon, cinched, bobbing a little */}
      <motion.g animate={reduce ? undefined : { y: [0, -1.5, 0, 1, 0] }} transition={reduce ? undefined : { duration: flexDur * 0.9, ease, repeat: Infinity }}>
        <path d={`M${kx - 17} ${ky - 20} C ${kx - 8} ${ky - 30}, ${kx + 8} ${ky - 30}, ${kx + 17} ${ky - 20} C ${kx + 24} ${ky - 8}, ${kx + 24} ${ky + 10}, ${kx + 17} ${ky + 22} C ${kx + 8} ${ky + 32}, ${kx - 8} ${ky + 32}, ${kx - 17} ${ky + 22} C ${kx - 24} ${ky + 10}, ${kx - 24} ${ky - 8}, ${kx - 17} ${ky - 20} Z`} fill={`url(#${g("knot")})`} />
        <path d={`M${kx - 14} ${ky - 14} C ${kx - 4} ${ky - 6}, ${kx + 4} ${ky + 6}, ${kx + 12} ${ky + 18}`} fill="none" stroke="#2f474b" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        <path d={`M${kx + 14} ${ky - 14} C ${kx + 4} ${ky - 6}, ${kx - 4} ${ky + 6}, ${kx - 12} ${ky + 18}`} fill="none" stroke="#2f474b" strokeOpacity="0.25" strokeWidth="1.6" strokeLinecap="round" />
        <path d={`M${kx - 12} ${ky - 18} C ${kx - 4} ${ky - 24}, ${kx + 4} ${ky - 24}, ${kx + 12} ${ky - 18}`} fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2.6" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}
