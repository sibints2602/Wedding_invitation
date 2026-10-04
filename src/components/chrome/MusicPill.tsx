"use client";

import { EASE_OUT } from "@/lib/motion";
import { motion } from "motion/react";
import { Music2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { useAudioPlayer } from "./AudioProvider";
import { useIntro } from "@/components/intro/IntroContext";

/** Floating music toggle: a round glass button with only the note, which pulses while playing. */
export function MusicPill() {
  const { t } = useLang();
  const { playing, toggle } = useAudioPlayer();
  const { opened } = useIntro();
  return (
    <motion.button
      type="button"
      onClick={() => void toggle()}
      aria-pressed={playing}
      aria-label={playing ? t(ui.musicOn) : t(ui.musicOff)}
      title={playing ? t(ui.musicOn) : t(ui.musicOff)}
      className={cn(
        "fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex size-11 items-center justify-center rounded-full border border-accent/35 bg-paper/80 text-ink-soft shadow-[0_8px_30px_rgba(42,58,60,0.16)] backdrop-blur-md",
        "transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] [@media(hover:hover)]:hover:bg-paper",
        "md:bottom-6 md:right-6",
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 12 }}
      transition={{ duration: 0.5, delay: opened ? 0.6 : 0, ease: EASE_OUT }}
      tabIndex={opened ? 0 : -1}
    >
      <Music2 className={cn("size-[1.15rem]", playing && "anim-pulse-soft")} aria-hidden="true" />
    </motion.button>
  );
}
