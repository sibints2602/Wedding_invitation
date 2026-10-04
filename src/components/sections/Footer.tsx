"use client";

import { wedding } from "@/content/wedding";
import { ui } from "@/content/ui";
import { useLang } from "@/lib/i18n";
import { Divider, DrawOnView } from "@/components/ornaments";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

/** Closing band: "With love", the blessing beneath it, and the rose divider drawing itself last. */
export function Footer() {
  const { t } = useLang();
  return (
    <footer className="band relative overflow-hidden px-6 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-20 text-center md:pb-24 md:pt-28">
      <Reveal stagger={0.12} className="relative mx-auto flex max-w-[36rem] flex-col items-center text-center">
        <RevealItem as="h2" className="t-title text-paper text-balance">
          {t(ui.blessingsTitle)}
        </RevealItem>
        <RevealItem as="p" className="t-lead mt-3 text-paper/85 text-balance">
          {t(wedding.blessings)}
        </RevealItem>
        <RevealItem>
          <DrawOnView className="mt-6" duration={1100} stagger={25}>
            <Divider variant="rose" className="h-8 w-72 md:w-80" />
          </DrawOnView>
        </RevealItem>
      </Reveal>
    </footer>
  );
}
