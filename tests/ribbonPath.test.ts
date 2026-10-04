import { describe, expect, test } from "vitest";
import { KNOT, RIBBON_BOX, loopPaths, pathSkeleton, sheenPath, tailPath, type Part } from "@/components/ornaments/ribbonPath";

const numbers = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
const PARTS: Part[] = ["front", "back"];

describe("ribbon tails", () => {
  test("each face keeps the same command structure across phases, amplitudes, lengths and sides, so poses morph", () => {
    for (const part of PARTS) {
      const base = pathSkeleton(tailPath(-1, 1, 0, 0, part));
      for (const [len, amp, phase] of [
        [1, 13, 0.25],
        [1, 34, 0.8],
        [0.6, 10, 0.5],
      ] as const) {
        expect(pathSkeleton(tailPath(-1, len, amp, phase, part))).toBe(base);
        expect(pathSkeleton(tailPath(1, len, amp, phase, part))).toBe(base);
      }
      expect(pathSkeleton(sheenPath(1, 1, 13, 0.3, part))).toBe(pathSkeleton(sheenPath(-1, 0.6, 34, 0.9, part)));
    }
  });

  test("closes its loop: phase 1 is the same pose as phase 0", () => {
    for (const part of PARTS) expect(tailPath(1, 1, 13, 1, part)).toBe(tailPath(1, 1, 13, 0, part));
  });

  test("the two faces meet at the twist", () => {
    const front = numbers(tailPath(-1, 1, 13, 0.3, "front"));
    const back = numbers(tailPath(-1, 1, 13, 0.3, "back"));
    // the back face starts where the front face's edge arrives
    expect(front).toContain(back[0]);
    expect(front).toContain(back[1]);
  });

  test("hangs below the knot and stays inside the ribbon's box, even at full flutter", () => {
    for (const side of [-1, 1] as const) {
      for (const part of PARTS) {
        const d = tailPath(side, 1, 34, 0.4, part);
        const xs = numbers(d).filter((_, i) => i % 2 === 0);
        const ys = numbers(d).filter((_, i) => i % 2 === 1);
        expect(Math.min(...xs)).toBeGreaterThan(-20);
        expect(Math.max(...xs)).toBeLessThan(RIBBON_BOX.width + 20);
        expect(Math.min(...ys)).toBeGreaterThan(KNOT[1]);
        expect(Math.max(...ys)).toBeLessThan(RIBBON_BOX.height);
      }
    }
  });

  test("is mirrored left to right", () => {
    const l = numbers(tailPath(-1, 1, 0, 0, "back"));
    const r = numbers(tailPath(1, 1, 0, 0, "back"));
    expect(l.length).toBe(r.length);
    for (let i = 0; i < l.length; i += 2) expect(l[i] + r[i]).toBeCloseTo(2 * KNOT[0], 0);
  });
});

describe("ribbon loops", () => {
  test("every part keeps its command structure across ripple amplitudes, phases and sides", () => {
    const base = loopPaths(-1, 0, 0);
    for (const [amp, phase, side] of [
      [3.5, 0.3, -1],
      [10, 0.8, 1],
      [10, 0.1, -1],
    ] as const) {
      const other = loopPaths(side, amp, phase);
      for (const key of ["band", "inside", "sheen", "lobe", "rim"] as const) expect(pathSkeleton(other[key])).toBe(pathSkeleton(base[key]));
      other.folds.forEach((f, i) => expect(pathSkeleton(f)).toBe(pathSkeleton(base.folds[i])));
    }
  });

  test("rises above the knot and stays inside the box", () => {
    for (const side of [-1, 1] as const) {
      const d = loopPaths(side, 10, 0.4).band;
      const xs = numbers(d).filter((_, i) => i % 2 === 0);
      const ys = numbers(d).filter((_, i) => i % 2 === 1);
      expect(Math.min(...ys)).toBeLessThan(KNOT[1] - 60);
      expect(Math.min(...ys)).toBeGreaterThan(-1);
      expect(Math.min(...xs)).toBeGreaterThan(-1);
      expect(Math.max(...xs)).toBeLessThan(RIBBON_BOX.width + 1);
    }
  });
});
