/**
 * Geometry for the ribbon's tails. Each tail is a band built around a centreline that runs from under the
 * knot down in an S, twists once mid-way (the band narrows to an edge and shows its back face from there
 * on) and turns gently inward at the tip. A ripple travels along the centreline toward the tip, so the band bends
 * along its length like cloth instead of swinging from its root. Every pose has the same command structure,
 * so the paths morph into one another.
 *
 * The loops are built the same way: a band of the tails' own width, gathered a little at the knot,
 * wrapped around a closed teardrop centreline that rises up and out from the knot, with a slow undulation
 * running around it.
 *
 * Coordinates are in the ribbon's 400×520 box; the knot sits at (200, 136).
 */
export const KNOT: readonly [number, number] = [200, 136];
export const RIBBON_BOX = { width: 400, height: 520 } as const;
/** Where along the tail (0 root … 1 tip) the ribbon turns over. */
const TWIST = 0.44;

type Pt = [number, number];
export type Side = -1 | 1;
export type Part = "front" | "back";

const r1 = (v: number) => Math.round(v * 10) / 10;
const SAMPLES = 20;

/** Resting centreline of a full-length tail, relative to the knot (x outward, y down): down in an S, bowing outward, the tip turning gently back in. */
const ANCHORS: readonly Pt[] = [
  [-10, 12],
  [-20, 56],
  [-16, 108],
  [-40, 164],
  [-86, 218],
  [-118, 266],
  [-122, 306],
  [-106, 330],
];

/** Catmull-Rom cubic segments through `pts`, continuing a path that already stands at pts[0]. */
function catmull(pts: Pt[]): string {
  let d = "";
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}

type Sample = { p: Pt; n: Pt; t: number };

/**
 * The rippled centreline, sampled with unit normals.
 * @param side -1 for the left tail, 1 for the right
 * @param len tail length as a fraction of the full tail (also eases the outward sweep)
 * @param amp ripple amplitude at the tip, in box units
 * @param phase ripple phase; the motion repeats every whole unit
 */
function centreline(side: Side, len: number, amp: number, phase: number): Sample[] {
  const sx = 0.55 + 0.45 * len;
  const P: Pt[] = ANCHORS.map(([x, y]) => [x * sx, y * len]);
  const pos = (t: number): Pt => {
    const seg = Math.min(P.length - 2, Math.floor(t * (P.length - 1)));
    const u = t * (P.length - 1) - seg;
    const p0 = P[Math.max(0, seg - 1)];
    const p1 = P[seg];
    const p2 = P[seg + 1];
    const p3 = P[Math.min(P.length - 1, seg + 2)];
    const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])];
  };
  const out: Sample[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const p = pos(t);
    const q = pos(Math.min(1, t + 0.01));
    const o = pos(Math.max(0, t - 0.01));
    const tl = Math.hypot(q[0] - o[0], q[1] - o[1]) || 1;
    const nx = -(q[1] - o[1]) / tl;
    const ny = (q[0] - o[0]) / tl;
    // the ripple: sideways along the normal, growing toward the tip, travelling with the phase, plus a faint
    // second harmonic; both repeat over one unit of phase so the loop closes
    const w = amp * Math.pow(t, 1.5) * Math.sin(2 * Math.PI * (1.15 * t - phase)) + 0.35 * amp * t * t * Math.sin(2 * Math.PI * (2.4 * t - 2 * phase + 0.2));
    out.push({ p: [KNOT[0] + side * (p[0] + nx * w), KNOT[1] + p[1] + ny * w], n: [side * nx, ny], t });
  }
  return out;
}

/** Band width along the tail: full near the root, pinched to an edge at the twist, a little narrower toward the tip. */
function width(t: number, phase: number): number {
  const base = 28 - 8 * t;
  const twist = TWIST + 0.015 * Math.sin(2 * Math.PI * phase);
  const pinch = Math.exp(-Math.pow((t - twist) / 0.06, 2));
  return base * (1 - 0.75 * pinch);
}

const splitIndex = Math.round(TWIST * SAMPLES);

/**
 * One face of the tail as a closed band: the front runs from the root to the twist, the back from the twist
 * to the curled tip, where it ends in a swallowtail.
 */
export function tailPath(side: Side, len: number, amp: number, phase: number, part: Part): string {
  const all = centreline(side, len, amp, phase);
  const c = part === "front" ? all.slice(0, splitIndex + 1) : all.slice(splitIndex);
  const n = c.length - 1;
  const A: Pt[] = c.map(({ p, n: nn, t }) => {
    const h = width(t, phase) / 2;
    return [p[0] + nn[0] * h, p[1] + nn[1] * h];
  });
  const B: Pt[] = c.map(({ p, n: nn, t }) => {
    const h = width(t, phase) / 2;
    return [p[0] - nn[0] * h, p[1] - nn[1] * h];
  });
  let end: string;
  if (part === "back") {
    const tip = c[n].p;
    const prev = c[n - 1].p;
    const dx = tip[0] - prev[0];
    const dy = tip[1] - prev[1];
    const l = Math.hypot(dx, dy) || 1;
    const notch: Pt = [tip[0] - (dx / l) * 14, tip[1] - (dy / l) * 14];
    end = ` L${r1(notch[0])} ${r1(notch[1])} L${r1(B[n][0])} ${r1(B[n][1])}`;
  } else {
    end = ` L${r1(B[n][0])} ${r1(B[n][1])}`;
  }
  return `M${r1(A[0][0])} ${r1(A[0][1])}` + catmull(A) + end + catmull([...B].reverse()) + " Z";
}

/** A thin satin highlight along part of a face, following the same ripple. */
export function sheenPath(side: Side, len: number, amp: number, phase: number, part: Part): string {
  const all = centreline(side, len, amp, phase);
  const [a, b] = part === "front" ? [0.08, 0.34] : [0.56, 0.84];
  const s: Pt[] = all.slice(Math.round(a * SAMPLES), Math.round(b * SAMPLES) + 1).map(({ p, n: nn, t }) => {
    const h = width(t, phase) * 0.18;
    return [p[0] + nn[0] * h, p[1] + nn[1] * h];
  });
  return `M${r1(s[0][0])} ${r1(s[0][1])}` + catmull(s);
}

/* ───────────── loops ───────────── */

const LOOP_SAMPLES = 28;
/** The loops rise 24° above horizontal. */
const LOOP_TILT = (24 * Math.PI) / 180;
/** Closed centreline of the left loop, relative to the knot before the tilt: out along the top arm to the lobe, back along the bottom arm. */
const LOOP_ANCHORS: readonly Pt[] = [
  [-8, -12],
  [-48, -40],
  [-100, -56],
  [-146, -50],
  [-170, -18],
  [-166, 16],
  [-136, 34],
  [-90, 30],
  [-44, 14],
  [-8, 6],
].map(([x, y]) => [x * Math.cos(LOOP_TILT) - y * Math.sin(LOOP_TILT), x * Math.sin(LOOP_TILT) + y * Math.cos(LOOP_TILT)] as Pt);

/** Position on the closed Catmull-Rom spline through P at t ∈ [0, 1). */
function closedSpline(P: readonly Pt[]): (t: number) => Pt {
  const n = P.length;
  return (t) => {
    const u0 = (((t % 1) + 1) % 1) * n;
    const i = Math.floor(u0);
    const u = u0 - i;
    const p0 = P[(i - 1 + n) % n];
    const p1 = P[i % n];
    const p2 = P[(i + 1) % n];
    const p3 = P[(i + 2) % n];
    const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])];
  };
}

type LoopSample = { p: Pt; n: Pt; w: number };

function loopCentreline(side: Side, amp: number, phase: number): LoopSample[] {
  const pos = closedSpline(LOOP_ANCHORS);
  const out: LoopSample[] = [];
  for (let i = 0; i <= LOOP_SAMPLES; i++) {
    const t = i / LOOP_SAMPLES;
    const p = pos(t);
    const q = pos(t + 0.005);
    const o = pos(t - 0.005);
    const tl = Math.hypot(q[0] - o[0], q[1] - o[1]) || 1;
    const nx = -(q[1] - o[1]) / tl;
    const ny = (q[0] - o[0]) / tl;
    const s = Math.sin(Math.PI * t); // 0 at the knot, 1 at the lobe
    // the same ribbon as the tails: gathered to 12 at the knot, 28 at the lobe
    const w = 12 + 16 * Math.pow(s, 0.7);
    const rip = amp * s * Math.sin(2 * Math.PI * (1.6 * t - phase));
    out.push({ p: [KNOT[0] + side * (p[0] + nx * rip), KNOT[1] + p[1] + ny * rip], n: [side * nx, ny], w });
  }
  return out;
}

export type LoopPaths = {
  /** The ribbon band around the opening. */
  band: string;
  /** A sliver of the ribbon's inside along the opening's lower edge. */
  inside: string;
  /** Sheen along the top arm. */
  sheen: string;
  /** A softer highlight on the lobe. */
  lobe: string;
  /** Dark rim under the bottom arm. */
  rim: string;
  /** Folds radiating from the knot. */
  folds: string[];
};

/** One loop, as the set of paths that draw it; every pose shares the same structure, so they morph. */
export function loopPaths(side: Side, amp: number, phase: number): LoopPaths {
  const c = loopCentreline(side, amp, phase);
  const n = c.length - 1;
  const off = (k: number) => c.map(({ p, n: nn, w }) => [p[0] + nn[0] * w * k, p[1] + nn[1] * w * k] as Pt);
  const O = off(0.5);
  const I = off(-0.5);
  const open = (pts: Pt[]) => `M${r1(pts[0][0])} ${r1(pts[0][1])}` + catmull(pts);
  const band = open(O) + ` L${r1(I[n][0])} ${r1(I[n][1])}` + catmull([...I].reverse()) + " Z";
  const slice = (a: number, b: number, k: number) => off(k).slice(Math.round(a * n), Math.round(b * n) + 1);
  const inside = open(slice(0.5, 0.86, -0.5).map(([x, y], i) => { const { n: nn } = c[Math.round(0.5 * n) + i]; return [x + nn[0] * 1.8, y + nn[1] * 1.8] as Pt; }));
  const sheen = open(slice(0.1, 0.46, 0.28));
  const lobe = open(slice(0.4, 0.58, 0.1));
  const rim = open(slice(0.55, 0.9, 0.42));
  const folds = [0.2, 0.32, 0.68, 0.8].map((ft) => {
    const k0 = c[Math.round(ft * n)].p;
    const k: Pt = [KNOT[0] + (k0[0] - KNOT[0]) * 0.5, KNOT[1] + (k0[1] - KNOT[1]) * 0.5];
    const root: Pt = [KNOT[0] + side * 12, KNOT[1] + (ft < 0.5 ? -6 : 6)];
    const mid: Pt = [(root[0] + k[0]) / 2 + side * 4, (root[1] + k[1]) / 2 + (ft < 0.5 ? 4 : -4)];
    return `M${r1(root[0])} ${r1(root[1])} Q${r1(mid[0])} ${r1(mid[1])} ${r1(k[0])} ${r1(k[1])}`;
  });
  return { band, inside, sheen, lobe, rim, folds };
}

/** The command skeleton of a path (letters only), for checking that two poses can morph. */
export function pathSkeleton(d: string): string {
  return d.replace(/[-\d.\s]+/g, "");
}
