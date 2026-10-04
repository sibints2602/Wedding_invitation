"use client";

import type { Verse as VerseT } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Divider, DrawOnView } from "@/components/ornaments";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

/** A single scripture, set like an epigraph on ivory damask: ornament, the words, the reference, ornament, in turn. */
export function Verse({ verse }: { verse: VerseT }) {
  const { t } = useLang();
  return (
    <section className="relative damask px-6 py-20 md:py-28">
      <Reveal stagger={0.12} className="mx-auto flex max-w-[36rem] flex-col items-center text-center">
        <RevealItem>
          <DrawOnView duration={1000} stagger={25}>
            <Divider variant="rose" className="h-8 w-64 md:w-72" />
          </DrawOnView>
        </RevealItem>
        <RevealItem as="blockquote" className="t-verse mt-6 text-ink text-balance">
          <span aria-hidden="true" className="text-accent">
            “
          </span>
          {t(verse.text)}
          <span aria-hidden="true" className="text-accent">
            ”
          </span>
        </RevealItem>
        <RevealItem as="p" className="t-label mt-4 text-accent-dusk">
          {t(verse.ref)}
        </RevealItem>
        <RevealItem>
          <DrawOnView className="mt-8" duration={1000} stagger={25} delay={150}>
            <Divider variant="flourish" className="h-8 w-64 rotate-180 md:w-72" />
          </DrawOnView>
        </RevealItem>
      </Reveal>
    </section>
  );
}
