/** Small vector helpers for building botanical line art procedurally. */
export type Pt = { x: number; y: number };

export function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  };
}

export function bezierTangentDeg(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): number {
  const mt = 1 - t;
  const dx = 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy = 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export function cubicPath(p0: Pt, p1: Pt, p2: Pt, p3: Pt): string {
  return `M${f(p0.x)} ${f(p0.y)} C${f(p1.x)} ${f(p1.y)} ${f(p2.x)} ${f(p2.y)} ${f(p3.x)} ${f(p3.y)}`;
}

/** A pointed leaf from the origin along +x, closed. Rotate/translate with a transform. */
export function leafPath(len: number, width: number): string {
  const l = f(len), w = f(width), h = f(len / 2);
  return `M0 0 Q${h} -${w} ${l} 0 Q${h} ${w} 0 0 Z`;
}

export const f = (n: number) => Math.round(n * 100) / 100;
