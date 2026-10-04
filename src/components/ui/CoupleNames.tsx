"use client";

import { wedding } from "@/content/wedding";
import { ui } from "@/content/ui";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type Props = {
  as?: "h1" | "p";
  className?: string;
  /** Colour of the "and" between the names. */
  joinerClassName?: string;
};

/** The couple's first names, the bride's first, stacked with "and" between them, in the names voice: the hero's greeting. */
export function CoupleNames({ as: Comp = "p", className, joinerClassName }: Props) {
  const { t } = useLang();
  const { groom, bride } = wedding.couple;
  return (
    <Comp className={cn("t-names flex flex-col items-center text-balance", className)}>
      <span>{t(bride.firstName)}</span>
      <span className={cn("t-names-sm my-1", joinerClassName)} aria-hidden="true">
        {t(ui.and)}
      </span>
      <span>{t(groom.firstName)}</span>
    </Comp>
  );
}
