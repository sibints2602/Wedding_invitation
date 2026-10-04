"use client";

import { useEffect, useRef } from "react";
import { useIntro, type Point } from "@/components/intro/IntroContext";
import { KINDS, alphaOf, burstCount, drawSize, gone, rand, spawnBurst, spawnDrift, steadyCount, step, widthFactor, type Petal } from "./petalField";

type Mote = { x: number; y: number; r: number; t: number; speed: number };

const SPRITE = 64;
/** centre colour → edge colour → rim, per kind: ivory, pale tint, seafoam, deep seafoam */
const PALETTE: [string, string, string][] = [
  ["rgba(255,255,255,0.98)", "rgba(239,233,223,0.95)", "rgba(201,183,154,0.35)"],
  ["rgba(248,251,251,0.98)", "rgba(214,227,228,0.95)", "rgba(163,188,191,0.45)"],
  ["rgba(232,240,240,0.96)", "rgba(163,188,191,0.92)", "rgba(111,145,150,0.5)"],
  ["rgba(214,227,228,0.96)", "rgba(111,145,150,0.9)", "rgba(78,111,116,0.5)"],
];

/**
 * A rose petal: a slender blade, about five parts long to three wide, widest a third of the way down, with a
 * notch at its top and narrowing to its stem end at the bottom; it leans a touch to one side. Paler at the
 * stem, deeper towards the notch and the edges, with a faint rim.
 */
function makePetal([light, deep, rim]: [string, string, string], soft: boolean) {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE;
  const g = c.getContext("2d")!;
  const cx = SPRITE / 2, cy = SPRITE / 2, r = SPRITE * 0.39;
  if (soft && "filter" in g) g.filter = "blur(1.4px)";
  const grad = g.createRadialGradient(cx, cy + r * 0.45, r * 0.05, cx, cy - r * 0.1, r * 1.2);
  grad.addColorStop(0, light);
  grad.addColorStop(0.55, light);
  grad.addColorStop(1, deep);
  g.beginPath();
  g.moveTo(cx, cy + r);
  g.bezierCurveTo(cx - r * 0.46, cy + r * 0.72, cx - r * 0.78, cy - r * 0.2, cx - r * 0.3, cy - r * 0.9);
  g.quadraticCurveTo(cx + r * 0.02, cy - r * 0.6, cx + r * 0.3, cy - r * 0.92);
  g.bezierCurveTo(cx + r * 0.86, cy - r * 0.16, cx + r * 0.54, cy + r * 0.72, cx, cy + r);
  g.closePath();
  g.fillStyle = grad;
  g.fill();
  g.lineWidth = 1.1;
  g.strokeStyle = rim;
  g.stroke();
  return c;
}

function makeMote() {
  const c = document.createElement("canvas");
  c.width = c.height = 24;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(12, 12, 0, 12, 12, 12);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.6)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 24, 24);
  return c;
}

/**
 * Petals in the air over the page. Nothing shows while the envelope is sealed; at the tap a shower bursts from
 * the wax seal, flies out, slows in the air and drifts down the page, and from then on a few petals drift in
 * from the top and fall through, turning over as they go — with a scatter of faint light motes behind them.
 * The canvas is mounted from the start and begins drawing the instant the envelope is tapped (useIntro().onOpen),
 * before the page beneath re-renders, so the burst moves with the flap. Sprites are pre-rendered once, the loop
 * pauses when the tab is hidden, and reduced motion shows nothing.
 */
export function Petals() {
  const { onOpen } = useIntro();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, running = false, started = false;
    let petals: Petal[] = [], motes: Mote[] = [];

    const crisp = Array.from({ length: KINDS }, (_, k) => makePetal(PALETTE[k], false));
    const soft = Array.from({ length: KINDS }, (_, k) => makePetal(PALETTE[k], true));
    const moteSprite = makeMote();

    const spawnMote = (): Mote => ({ x: rand(0, w), y: rand(0, h), r: rand(2, 5), t: rand(0, Math.PI * 2), speed: rand(0.5, 1.2) });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // keep the petals in the air; only the motes are laid out afresh
      motes = Array.from({ length: w < 768 ? 8 : 14 }, spawnMote);
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000) || 0.016;
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        step(p, dt);
        if (gone(p, w, h)) {
          if (p.burst) petals.splice(i, 1);
          else petals[i] = spawnDrift(w, h, 0.2, rand);
          continue;
        }
        const a = alphaOf(p, h);
        if (a <= 0) continue;
        const size = drawSize(p);
        ctx.globalAlpha = a;
        ctx.setTransform(dpr, 0, 0, dpr, p.x * dpr, p.y * dpr);
        ctx.rotate(p.rot);
        ctx.scale(widthFactor(p), 1);
        ctx.drawImage((p.depth < 0.4 ? soft : crisp)[p.kind], -size / 2, -size / 2, size, size);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const m of motes) {
        m.t += dt * m.speed;
        const a = (Math.sin(m.t) + 1) / 2;
        ctx.globalAlpha = 0.1 + a * 0.35;
        const d = m.r * (1.2 + a);
        ctx.drawImage(moteSprite, m.x - d / 2, m.y + Math.sin(m.t * 0.5) * 4 - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (!started) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    // the burst from the seal (or from the middle of the page if the seal's place is unknown), then the steady
    // drift: petals set above the page in a tall band so they trickle in one by one over the first while
    const start = (origin: Point | null) => {
      if (started) return;
      started = true;
      resize();
      const from = origin ?? { x: w / 2, y: h * 0.5 };
      const n = burstCount(w);
      petals = Array.from({ length: n }, (_, i) => spawnBurst(from, w, h, i, n, rand));
      for (let i = 0; i < steadyCount(w); i++) petals.push(spawnDrift(w, h, 0.9, rand));
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const unsubscribe = onOpen(start);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      unsubscribe();
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [onOpen]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55]" />;
}
