"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Branch } from "@/components/ornaments";

/** On wide screens the page becomes a floating paper sheet over a pale field with two olive branches drifting behind it. */
export function Backdrop({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * -0.3);
  const style = reduce ? undefined : { y };

  return (
    <div className="lg:bg-[#e9f0f0]">
      <div aria-hidden="true" className="pointer-events-none">
        <motion.div style={style} className="fixed left-[max(1rem,calc(50vw-46rem/2-22rem))] top-[18vh] hidden w-[20rem] lg:block">
          <Branch className="h-auto w-full" />
        </motion.div>
        <motion.div style={style} className="fixed bottom-[8vh] right-[max(1rem,calc(50vw-46rem/2-22rem))] hidden w-[20rem] lg:block">
          <Branch className="h-auto w-full" flip />
        </motion.div>
      </div>
      <div className="relative overflow-hidden bg-paper lg:mx-auto lg:my-10 lg:max-w-[46rem] lg:rounded-[6px] lg:shadow-[0_30px_80px_rgba(42,58,60,0.12)]">{children}</div>
    </div>
  );
}
