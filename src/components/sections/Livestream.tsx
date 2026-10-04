"use client";

import { Play } from "lucide-react";
import { wedding } from "@/content/wedding";
import { ui } from "@/content/ui";
import { hands } from "@/content/florals";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Floral } from "@/components/ui/Floral";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

/**
 * For guests who join from afar: the couple's clasped hands painted on the paper, the question beneath
 * them, the one button, and the note. No card — the painting's own wash is all the framing it needs.
 */
export function Livestream() {
  const { t } = useLang();
  return (
    <section id="livestream" className="relative damask px-6 py-20 md:py-28">
      <div className="mx-auto flex max-w-[30rem] flex-col items-center text-center">
        <Reveal className="w-[66%] max-w-[16rem]" y={10}>
          {/* the scan ends in a straight cut through the cuffs, so the bottom of the painting is feathered into the paper */}
          <div aria-hidden="true" className="[mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)]">
            <Floral art={hands} sizes="(min-width: 768px) 16rem, 66vw" />
          </div>
        </Reveal>
        <Reveal stagger={0.12} className="mt-8 flex flex-col items-center">
          <RevealItem as="h2" className="t-title text-ink text-balance">
            {t(ui.livestreamLead)}
          </RevealItem>
          <RevealItem className="mt-6">
            <Button as="a" variant="solid" href={wedding.livestream.url} target="_blank" rel="noopener noreferrer" icon={<Play />}>
              {t(ui.livestream)}
            </Button>
          </RevealItem>
          <RevealItem as="p" className="t-body mt-6 text-muted text-balance">
            {t(wedding.livestream.note)}
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
