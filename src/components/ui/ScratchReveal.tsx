"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  /** Printed on the foil and read to assistive tech ("Scratch to reveal"). */
  label: string;
  className?: string;
  /** Share of the foil to remove before it lifts away on its own. */
  threshold?: number;
};

type Phase = "foil" | "lifting" | "gone";
const BRUSH = 22; // radius in CSS px
const FOIL = "linear-gradient(135deg,#d9e5e5 0%,#f0f5f5 35%,#c3d5d6 50%,#e9f0f0 70%,#b9cdce 100%)";

/**
 * A scratch card over its children: a frosted seafoam foil the guest rubs away with a finger or
 * mouse. The foil lifts by itself once enough is gone; Enter or Space lifts it for keyboard users.
 * Nothing is remembered: every load starts covered, like the envelope.
 */
export function ScratchReveal({ children, label, className, threshold = 0.5 }: Props) {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("foil");
  const [painted, setPainted] = useState(false);
  const [touched, setTouched] = useState(false);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);

  // paint the foil at device resolution, and again if the plate changes size
  useEffect(() => {
    if (phase !== "foil") return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const paint = () => {
      const { width, height } = wrap.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, "#d9e5e5");
      g.addColorStop(0.35, "#f0f5f5");
      g.addColorStop(0.5, "#c3d5d6");
      g.addColorStop(0.7, "#e9f0f0");
      g.addColorStop(1, "#b9cdce");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      // fine brushed-metal lines
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      for (let x = -height; x < width; x += 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + height, height);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // from here on, strokes erase
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = BRUSH * 2;
      last.current = null;
      setPainted(true);
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [phase]);

  const lift = () => {
    setPhase((p) => (p === "foil" ? "lifting" : p));
    window.setTimeout(() => setPhase("gone"), reduce ? 0 : 700);
  };

  /** Share of the foil already erased, sampled every 7th pixel. */
  const cleared = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 28) {
      total++;
      if (data[i] < 40) clear++;
    }
    return total ? clear / total : 0;
  };

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const scratchTo = (p: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (last.current) {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, BRUSH, 0, Math.PI * 2);
      ctx.fill();
    }
    last.current = p;
  };

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "foil") return;
    e.preventDefault(); // no text selection under the foil while the mouse drags
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = null;
    setTouched(true);
    scratchTo(point(e));
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || phase !== "foil") return;
    scratchTo(point(e));
    if (++moves.current % 6 === 0 && cleared() > threshold) lift();
  };
  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    if (phase === "foil" && cleared() > threshold) lift();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      lift();
    }
  };

  return (
    <div ref={wrapRef} className={cn("relative", phase !== "gone" && "select-none", className)}>
      {children}
      {phase !== "gone" && (
        <div
          role="button"
          tabIndex={0}
          aria-label={label}
          onKeyDown={onKeyDown}
          className={cn(
            "absolute inset-0 overflow-hidden rounded-[6px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65),0_8px_22px_rgba(42,58,60,0.25)] outline-none transition-opacity ease-[var(--ease-out-strong)] focus-visible:ring-2 focus-visible:ring-paper/80",
            reduce ? "duration-0" : "duration-700",
            phase === "lifting" && "pointer-events-none opacity-0",
          )}
          style={painted ? undefined : { background: FOIL }}
        >
          <canvas
            ref={canvasRef}
            className="block h-full w-full cursor-pointer select-none [touch-action:none]"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-hidden="true"
          />
          <p className={cn("t-label pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-accent-dusk transition-opacity duration-300", touched && "opacity-0")} aria-hidden="true">
            {label}
          </p>
        </div>
      )}
    </div>
  );
}
