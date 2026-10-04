"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { EASE_OUT_CSS } from "@/lib/motion";

type Props = {
  children: ReactNode;
  /** Total duration of the stroke drawing, ms. */
  duration?: number;
  /** Delay before drawing starts, ms. */
  delay?: number;
  /** Extra delay between successive shapes, ms. */
  stagger?: number;
  className?: string;
};

const DRAWABLE = "path, circle, ellipse, line, polyline, polygon";

/**
 * Makes the SVG line art inside it "draw itself" the first time it is seen.
 * Strokes animate via stroke-dashoffset; filled shapes fade in. Respects reduced motion.
 */
export function DrawOnView({ children, duration = 1200, delay = 0, stagger = 40, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shapes = Array.from(host.querySelectorAll<SVGGeometryElement>(DRAWABLE));
    if (reduce || shapes.length === 0) {
      host.style.opacity = "1";
      return;
    }

    // Prepare: hide strokes by offsetting their dash to their own length.
    let prepared: { el: SVGGeometryElement; len: number }[] = [];
    // Read everything first, then write, to avoid layout thrash. Runs lazily, right before drawing.
    const prepare = () => shapes.map((el) => {
      const hasStroke = el.getAttribute("stroke") !== "none" && getComputedStyle(el).stroke !== "none";
      let len = 0;
      if (hasStroke && typeof el.getTotalLength === "function") {
        try {
          len = el.getTotalLength();
        } catch {
          len = 0;
        }
      }
      return { el, len };
    });
    const hide = () => {
      prepared = prepare();
      for (const { el, len } of prepared) {
        if (len > 0) {
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len}`;
        } else {
          el.style.opacity = "0";
        }
      }
      host.style.opacity = "1";
    };

    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      hide();
      prepared.forEach(({ el, len }, i) => {
        const d = delay + i * stagger;
        if (len > 0) {
          const anim = el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
            duration,
            delay: d,
            easing: EASE_OUT_CSS,
            fill: "forwards",
          });
          anim.onfinish = () => {
            el.style.strokeDasharray = "";
            el.style.strokeDashoffset = "";
          };
        } else {
          const anim = el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: Math.min(600, duration),
            delay: d + duration * 0.5,
            easing: "ease-out",
            fill: "forwards",
          });
          anim.onfinish = () => {
            el.style.opacity = "";
          };
        }
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { rootMargin: "-10% 0px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [duration, delay, stagger]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block", opacity: 0 }}>
      {children}
    </span>
  );
}
