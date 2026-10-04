import { describe, expect, it } from "vitest";
import { RELAX, alphaOf, gone, spawnBurst, spawnDrift, step, type Rand } from "@/components/chrome/petalField";

/** A seeded uniform generator (mulberry32) so the runs are repeatable. */
function seeded(seed: number): Rand {
  let a = seed >>> 0;
  return (lo, hi) => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const u = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return lo + u * (hi - lo);
  };
}

const W = 393, H = 780, ORIGIN = { x: 196, y: 405 };

function run(p: ReturnType<typeof spawnBurst>, seconds: number, dt = 1 / 60) {
  for (let t = 0; t < seconds; t += dt) step(p, dt);
}

describe("petal burst", () => {
  it("starts at the seal and mostly flies upwards", () => {
    const r = seeded(7);
    const n = 90;
    const petals = Array.from({ length: n }, (_, i) => spawnBurst(ORIGIN, W, H, i, n, r));
    for (const p of petals) expect(Math.hypot(p.x - ORIGIN.x, p.y - ORIGIN.y)).toBeLessThan(70); // from under the seal, not one point
    expect(petals.filter((p) => p.vy < 0).length).toBeGreaterThanOrEqual(n * 0.55);
    expect(petals.every((p) => p.burst)).toBe(true);
  });

  it("loses its throw within a few seconds and then falls with the air", () => {
    const r = seeded(11);
    const n = 90;
    const petals = Array.from({ length: n }, (_, i) => spawnBurst(ORIGIN, W, H, i, n, r));
    const top = Math.min(...petals.map((p) => p.vy)); // the hardest upward throw
    expect(top).toBeLessThan(-200);
    expect(petals.every((p) => p.wait >= 0 && p.wait <= 0.22)).toBe(true);
    for (const p of petals) run(p, 2.5);
    for (const p of petals) {
      expect(p.vy).toBeGreaterThan(0); // every one is falling now
      expect(p.vy).toBeLessThan(p.fall * 1.5); // at the air's pace, not its own
      expect(Math.abs(p.vx)).toBeLessThan(p.sway + 5);
      expect(p.y).toBeGreaterThan(ORIGIN.y - 620 / RELAX - 20); // never higher than the throw can carry it
    }
  });
});

describe("petal drift", () => {
  it("starts above the page and only ever falls", () => {
    const r = seeded(3);
    const petals = Array.from({ length: 12 }, () => spawnDrift(W, H, 0.9, r));
    for (const p of petals) {
      expect(p.y).toBeLessThan(0);
      expect(p.burst).toBe(false);
      expect(p.wait).toBe(0);
    }
    for (const p of petals) {
      let lastY = p.y;
      for (let t = 0; t < 30; t += 1 / 60) {
        step(p, 1 / 60);
        expect(p.y).toBeGreaterThanOrEqual(lastY);
        lastY = p.y;
      }
    }
  });

  it("is gone below the page or past its sides, not above it, and keeps a sane opacity", () => {
    const p = spawnDrift(W, H, 0.5, seeded(5));
    expect(gone(p, W, H)).toBe(false);
    p.y = -H;
    expect(gone(p, W, H)).toBe(false);
    p.y = H + 31;
    expect(gone(p, W, H)).toBe(true);
    p.y = H / 2;
    p.x = -41;
    expect(gone(p, W, H)).toBe(true);
    p.x = W / 2;
    for (let t = 0; t < 40; t += 0.25) {
      p.age = t;
      p.y = -100 + t * 25;
      const a = alphaOf(p, H);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(1);
    }
    p.y = H + 24;
    expect(alphaOf(p, H)).toBe(0);
  });
});
