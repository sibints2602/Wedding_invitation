"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { motion, stagger, useInView, useReducedMotion, type UseInViewOptions, type Variants } from "motion/react";
import { useIntro } from "@/components/intro/IntroContext";
import { EASE_OUT } from "@/lib/motion";

/** A block counts as seen once it is a little way into the viewport, not while it only grazes the edge. */
const MARGIN: UseInViewOptions["margin"] = "-12% 0px -8% 0px";

type Tag = "div" | "p" | "h2" | "h3" | "blockquote";

/**
 * The one rule every entrance on the page follows: the element has scrolled into view, and the envelope
 * has already opened — so nothing plays unseen behind it. True once, then stays true.
 */
export function useRevealed(ref: RefObject<Element | null>, margin: UseInViewOptions["margin"] = MARGIN): boolean {
  const { opened } = useIntro();
  const inView = useInView(ref, { once: true, margin });
  return opened && inView;
}

type Props = {
  children: ReactNode;
  className?: string;
  /** Vertical travel in px (ignored under reduced motion). */
  y?: number;
  /** Seconds between the entrances of this block's <RevealItem>s; the block itself then holds still. */
  stagger?: number;
};

/**
 * One gentle entrance per block, the first time it scrolls into view and never before the envelope has
 * opened. Plain: the block fades in and rises. With `stagger`: the block holds still and its
 * <RevealItem>s arrive one after another, in reading order.
 */
export function Reveal({ children, className, y = 22, stagger: gap }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const show = useRevealed(ref);
  const variants: Variants = gap
    ? { hidden: {}, show: { transition: { delayChildren: stagger(reduce ? 0.04 : gap) } } }
    : {
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.4 : 0.9, ease: EASE_OUT } },
      };
  return (
    <motion.div ref={ref} className={className} variants={variants} initial="hidden" animate={show ? "show" : "hidden"}>
      {children}
    </motion.div>
  );
}

/** One line or piece inside a staggered <Reveal>: fades in and rises when its turn comes. */
export function RevealItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as unknown as typeof motion.div;
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.4 : 0.85, ease: EASE_OUT } },
  };
  return (
    <Comp className={className} variants={variants}>
      {children}
    </Comp>
  );
}
