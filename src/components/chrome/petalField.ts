/**
 * The petal field behind <Petals>: spawning and motion as pure functions, so the burst from the seal and the
 * drift down the page can be unit-tested without a canvas. Coordinates are CSS pixels (y down), velocities px/s.
 *
 * One model moves every petal: its velocity relaxes towards "the air's" — a slow fall that is slower while the
 * petal lies flat and faster while it is edge-on, plus a side-to-side sway — at RELAX per second. A petal thrown
 * from the seal therefore flies out, loses its throw within about a second and a half, and from then on falls
 * exactly like the ones that drift in from the top of the page.
 */

import type { Point } from "@/components/intro/IntroContext";

export type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** the air: a slow fall and a sway it is always being brought back to */
  fall: number;
  sway: number;
  swayRate: number;
  phase: number;
  /** spin in the plane of the page, and a tumble about the petal's long axis (seen as it narrowing to an edge) */
  rot: number;
  vr: number;
  tumble: number;
  vt: number;
  /** 0 far … 1 near: scales size, opacity and the fall */
  depth: number;
  /** radius in px before depth */
  size: number;
  kind: number;
  age: number;
  /** seconds still to wait before it is thrown (the burst unfolds over a quarter second rather than popping) */
  wait: number;
  /** thrown from the seal: leaves the page for good instead of coming back in from the top */
  burst: boolean;
};

/** Uniform random in [a, b). Injected so tests can seed it. */
export type Rand = (a: number, b: number) => number;
export const rand: Rand = (a, b) => a + Math.random() * (b - a);

/** How fast a petal's velocity relaxes to the air's, per second. */
export const RELAX = 2.3;
/** The sprite kinds: ivory, pale tint, seafoam, deep seafoam — the deep one is rarer. */
export const KINDS = 4;
const KIND_WEIGHTS = [0.3, 0.3, 0.28, 0.12];
/** The burst leans on the seafoam kinds, which read against the pale paper; ivory ones would vanish on it. */
const BURST_WEIGHTS = [0.12, 0.26, 0.4, 0.22];

export function steadyCount(w: number) {
  return w < 768 ? 11 : 18;
}
export function burstCount(w: number) {
  return w < 768 ? 90 : 120;
}
/** Throw speeds scale with the screen so the burst covers a similar share of a phone and a desktop. */
function throwScale(w: number, h: number) {
  return Math.min(1.5, Math.max(1, Math.min(w, h) / 393));
}

function pickKind(r: Rand, weights = KIND_WEIGHTS) {
  let u = r(0, 1);
  for (let k = 0; k < KINDS; k++) {
    u -= weights[k];
    if (u < 0) return k;
  }
  return KINDS - 1;
}

function body(r: Rand, w: number, depth: number, weights = KIND_WEIGHTS): Omit<Petal, "x" | "y" | "vx" | "vy" | "age" | "wait" | "burst"> {
  return {
    fall: r(16, 30) * (0.7 + 0.6 * depth),
    sway: r(8, 22),
    swayRate: r(0.5, 1.1),
    phase: r(0, Math.PI * 2),
    rot: r(0, Math.PI * 2),
    vr: r(-0.5, 0.5),
    tumble: r(0, Math.PI * 2),
    vt: r(0.9, 2.2) * (r(0, 1) < 0.5 ? -1 : 1),
    depth,
    size: r(7, 12) * (w < 768 ? 1 : 1.15),
    kind: pickKind(r, weights),
  };
}

/** A petal above the page, somewhere in the band `spread` × the page height tall, falling at the air's pace already. */
export function spawnDrift(w: number, h: number, spread: number, r: Rand): Petal {
  const p = body(r, w, r(0, 1));
  const phase = p.phase;
  return { ...p, x: r(0, w), y: r(-h * spread, -20), vx: Math.sin(phase) * p.sway, vy: p.fall, age: 0, wait: 0, burst: false };
}

/**
 * Petal `i` of `n` thrown from the seal. The throws fan out around straight up — the throw's direction is
 * spread evenly, bunched towards up — and are fastest upwards, so the burst rises as a crown over the seal and
 * spills at its sides and foot; the throws range from a toss to a fling, so the shower has a full heart around
 * the seal and a far-flung rim. Each petal sets off from somewhere under the seal's rim rather than from one
 * point, a beat or so apart, so the burst unfolds instead of popping. Burst petals lie near the viewer, run
 * larger, and tumble fast while they fly.
 */
export function spawnBurst(origin: Point, w: number, h: number, i: number, n: number, r: Rand): Petal {
  const u = ((i + r(0, 1)) / n) * 2 - 1; // -1 … 1 around the circle, 0 = up
  const angle = -Math.PI / 2 + Math.sign(u) * Math.pow(Math.abs(u), 1.3) * Math.PI;
  const scale = throwScale(w, h);
  const speed = scale * r(200, 640) * (0.55 + 0.45 * (1 - Math.abs(u)));
  const p = body(r, w, r(0.35, 1), BURST_WEIGHTS);
  p.size *= r(1, 1.35);
  const start = r(8, 55) * scale;
  const side = r(-0.5, 0.5); // a little across the throw as well as along it
  return {
    ...p,
    x: origin.x + Math.cos(angle) * start - Math.sin(angle) * start * side,
    y: origin.y + Math.sin(angle) * start + Math.cos(angle) * start * side,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    age: 0,
    wait: r(0, 0.22),
    burst: true,
  };
}

/** 1 while the petal faces the page flat, 0 while it is edge-on. */
function flatness(p: Petal) {
  return Math.abs(Math.cos(p.tumble));
}

/** Advance one petal by `dt` seconds. */
export function step(p: Petal, dt: number) {
  if (p.wait > 0) {
    p.wait -= dt;
    return;
  }
  p.age += dt;
  p.phase += p.swayRate * dt;
  const flat = flatness(p);
  // the air: a flat petal rides on it and sinks slowly; edge-on it slips down faster
  const airVy = p.fall * (0.6 + 0.8 * (1 - flat));
  const airVx = Math.sin(p.phase) * p.sway;
  const k = 1 - Math.exp(-RELAX * dt);
  p.vx += (airVx - p.vx) * k;
  p.vy += (airVy - p.vy) * k;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  // it spins with its sideways motion and tumbles faster the faster it flies
  const speed = Math.hypot(p.vx, p.vy);
  p.rot += (p.vr + p.vx * 0.004) * dt;
  p.tumble += (p.vt + speed * 0.012 * Math.sign(p.vt)) * dt;
}

/** True once the petal has left the page below or to the sides (rising above it, it will come back). */
export function gone(p: Petal, w: number, h: number) {
  return p.y > h + 30 || p.x < -40 || p.x > w + 40;
}

/** Opacity: arrives in a beat, fades out before the bottom edge, fainter when far, a touch dimmer edge-on. */
export function alphaOf(p: Petal, h: number) {
  const enter = Math.min(1, p.age / (p.burst ? 0.15 : 0.9));
  const leave = Math.min(1, Math.max(0, (h + 24 - p.y) / 70));
  return enter * leave * (0.55 + 0.4 * p.depth) * (0.75 + 0.25 * flatness(p));
}

/** Drawn size (px) and the width factor of the tumble. */
export function drawSize(p: Petal) {
  return p.size * 2.6 * (0.55 + 0.45 * p.depth);
}
export function widthFactor(p: Petal) {
  return 0.14 + 0.86 * flatness(p);
}
